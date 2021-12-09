use std::fs;
use std::io::prelude::*;
use std::os::unix::net::{UnixListener, UnixStream};
use std::path::Path;
use std::sync::{Arc, Mutex};
use std::thread;

mod user;
use user::PhoneBook;
use user::User;

// max bytes size
const MAX_SIZE: usize = 1024;

fn main() {
    let path = Path::new("/tmp/s");
    let pb = PhoneBook::new();
    let pb = Arc::new(Mutex::new(pb));

    if path.exists() {
        match fs::remove_file(path) {
            Ok(result) => result,
            Err(e) => {
                println!("Socket remove error: {:?}", e);
                return;
            }
        };
    }

    let socket = UnixListener::bind(path).unwrap();
    println!("Server successfully connected.");
    println!("Listening for clients ...");

    for stream in socket.incoming() {
        let stream = stream.unwrap();
        let pb = Arc::clone(&pb);

        let handle = thread::spawn(move || {
            println!("\n* THREAD START *");
            let mut pb = pb.lock().unwrap();
            handle_client(stream, &mut pb);
        });

        // only thread join, mutex drop is automatic
        let result = match handle.join() {
            Ok(_) => "* THREAD CLOSED *".to_string(),
            Err(e) => format!("Thread Join Error: {:?}", e),
        };

        println!("{}", result);
    }
}

fn handle_client(mut stream: UnixStream, pb: &mut PhoneBook) {
    // read from client
    let mut buffer = vec![0; MAX_SIZE];
    stream.read(&mut buffer).unwrap();
    let message = String::from_utf8(buffer).unwrap();
    println!("# Client: {}", message.replace(".", " "));

    // send response to client
    let response = get_response(message, pb);
    stream.write(response.as_bytes()).unwrap();
}

fn get_response(message: String, pb: &mut PhoneBook) -> String {
    let args: Vec<String> = message
        .split(".")
        .map(|arg| arg.trim().to_string())
        .collect();

    let response: String = match args[0].as_str() {
        "imenik_izpis" => pb.print(&args[1]).unwrap(),
        "imenik_izbris" => pb.remove(&args[1]).unwrap(),
        "imenik_zapri" => pb.clear().unwrap(),
        "imenik_vpis" => pb
            .add(User::new(args[1].clone(), args[2].clone(), args[3].clone()))
            .unwrap(),
        "imenik_iskanje" => {
            if args[1] == "EXIT" {
                return "Searching closed.".to_string();
            }

            let users = pb.search(&args[1]);
            let response = format!("Found {} users\n{}", users.len(), users.join("\n"));
            response
        }
        _ => "Wrong header argument.".to_string(),
    };

    response
}
