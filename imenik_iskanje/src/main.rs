use std::env;
use std::io;
use std::io::prelude::*;
use std::os::unix::net::UnixStream;
use std::path::Path;

// max bytes size
const MAX_SIZE: usize = 1024;

fn main() {
    // parse arguments
    let mut args: Vec<String> = env::args().collect();
    if args.len() != 1 {
        eprintln!("Error: Incorrect number of arguments.");
        return;
    }

    // write message to server
    args[0] = args[0][13..].to_string(); // remove target/build/

    // send data to server
    handle_server(&mut args);
}

fn handle_server(args: &Vec<String>) {
    // program is closing with message EXIT, otherwise must install crate 'ctrlc'
    loop {
        // connect to server
        let path = Path::new("/tmp/s");
        let mut stream = UnixStream::connect(path).unwrap();

        let mut pattern = String::new();
        println!("Search pattern:");
        io::stdin()
            .read_line(&mut pattern)
            .ok()
            .expect("Failed to read line.");

        let mut message = format!("{}.{}", args.join("."), pattern);
        message.pop();
        message.push('.');
        stream.write(message.as_bytes()).unwrap();

        // receive response from server
        let mut buffer = vec![0; MAX_SIZE];
        stream.read(&mut buffer[..]).unwrap();
        let message = String::from_utf8(buffer).unwrap();
        println!("# Server: {}", message);

        if pattern.trim() == "EXIT" {
            break;
        }
    }
}
