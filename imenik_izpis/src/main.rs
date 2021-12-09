use std::env;
use std::io::prelude::*;
use std::os::unix::net::UnixStream;

// max bytes size
const MAX_SIZE: usize = 1024;

fn main() {
    // parse arguments
    let mut args: Vec<String> = env::args().collect();
    if args.len() != 2 {
        eprintln!("Error: Incorrect number of arguments.");
        return;
    }

    // connect to server
    let mut stream = UnixStream::connect("/tmp/s").unwrap();

    // write message to server
    args[0] = args[0][13..].to_string(); // remove target/build/
    let mut message = args.join(".");
    message.push('.');
    stream.write(message.as_bytes()).unwrap();

    // receive response from server
    let mut buffer = vec![0; MAX_SIZE];
    stream.read(&mut buffer[..]).unwrap();
    let message = String::from_utf8(buffer).unwrap();
    println!("# Server: {}", message);
}
