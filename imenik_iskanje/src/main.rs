use std::env;
use std::io;
use std::io::prelude::*;
use std::os::unix::net::UnixStream;

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
    args[0] = "imenik_iskanje".to_string();

    // send data to server
    // type EXIT to close, otherwise install crate 'ctrlc'
    loop {
        let mut pattern = String::new();
        println!("Search pattern:");
        io::stdin()
            .read_line(&mut pattern)
            .ok()
            .expect("Failed to read line.");

        // connect to server
        let mut stream = UnixStream::connect("/tmp/s").unwrap();

        // send message to server
        let mut message = format!("{}.{}", args.join("."), pattern);
        message.pop();
        message.push('.');
        stream.write(message.as_bytes()).unwrap();

        // receive response from server
        let mut buffer = vec![0; MAX_SIZE];
        stream.read(&mut buffer[..]).unwrap();
        let message = String::from_utf8(buffer[..].to_vec()).unwrap();
        println!("# Server: {}", message);
    }
}
