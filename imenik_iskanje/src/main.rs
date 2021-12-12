use std::env;
use std::io;
use std::io::prelude::*;
use std::os::unix::net::UnixStream;
use std::{ptr, str};

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
        stream.read(&mut buffer).unwrap();
        let message = String::from_utf8(buffer).unwrap();

        // parse arguments
        let args: Vec<String> = message
        .split(".")
        .map(|arg| arg.trim().to_string())
        .collect();

        // read from shared memory
        let key = args[0].to_string();
        let size = args[1].to_string().parse::<usize>().unwrap();
        println!("size: {}, key: {}", size, key);

        read_shm(key, size);
    }
}

fn read_shm(key: String, size: usize) {
    unsafe {
        let name: *const libc::c_char = key.as_ptr() as *const libc::c_char;
        let size: libc::size_t = size - 1;

        let fd = libc::shm_open(name, libc::O_RDWR | libc::O_CREAT, libc::S_IRUSR | libc::S_IWUSR);
        if fd == -1 {
            println!("Error: cannot open shared memory.");
        }

        // map to shared memory
        let address = libc::mmap(ptr::null_mut(), size, libc::PROT_READ, libc::MAP_SHARED, fd, 0);
        if address == libc::MAP_FAILED {
            println!("Error: cannot map to shared memory.");
        }

        // data buffer
        let mut data  = vec![0_u8; size];
        let ptr = data.as_mut_ptr() as *mut libc::c_char;
        libc::strncpy(ptr, address as *const libc::c_char, size);

        // unlink shared memory and close connection
        libc::shm_unlink(name);
        libc::close(fd);

        // response
        println!("# Server: {}", str::from_utf8(&data).unwrap());
    }
}
