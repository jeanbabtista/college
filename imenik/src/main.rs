use std::fs;
use std::io::prelude::*;
use std::os::unix::net::{UnixListener, UnixStream};
use std::path::Path;
use std::sync::{Arc, Mutex};
use std::thread;
use std::ptr;
use rand::Rng;

mod user;
use user::PhoneBook;
use user::User;

// max bytes size
const MAX_SIZE: usize = 1024;

fn main() {
    let path = Path::new("/tmp/s");
    let pb = PhoneBook::new();
    let pb = Arc::new(Mutex::new(pb));
    let open = Arc::new(Mutex::new(true));

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
        {
            let stream = stream.unwrap();
            let pb = Arc::clone(&pb);
            let open = Arc::clone(&open);

            let handle = thread::spawn(move || {
                // println!("\n* THREAD START *");
                
                let mut pb = pb.lock().unwrap();
                let mut open = open.lock().unwrap();
                handle_client(stream, &mut pb, &mut open);
            });

            handle.join().unwrap();

            // only thread join, mutex drop is automatic
            /* let result = match handle.join() {
                Ok(_) => "* THREAD CLOSED *".to_string(),
                Err(e) => format!("Thread error occured: {:?}", e)
            };

            println!("{}", result); */
        }

        // close server if open is false
        {
            let open = Arc::clone(&open);
            let open = open.lock().unwrap();

            if *open == false {
                break;
            }
        }
    }

    println!("Server closed.");
}

fn handle_client(mut stream: UnixStream, pb: &mut PhoneBook, open: &mut bool) {
    // read from client
    let mut buffer = vec![0; MAX_SIZE];
    stream.read(&mut buffer).unwrap();

    let message = String::from_utf8(buffer).unwrap();
    println!("# Client: {}", message.replace(".", " "));

    // send response to client
    // parse arguments
    let args: Vec<String> = message
        .split(".")
        .map(|arg| arg.trim().to_string())
        .collect();

    // send response
    let response: String = match args[0].as_str() {
        "imenik_izpis" => pb.print(&args[1]).unwrap(),
        "imenik_izbris" => pb.remove(&args[1]).unwrap(),
        "imenik_zapri" => {
            *open = false;
            pb.clear().unwrap()
        }
        "imenik_vpis" => pb
            .add(User::new(args[1].clone(), args[2].clone(), args[3].clone()))
            .unwrap(),
        "imenik_iskanje" => {
            let users = pb.search(&args[1]);
            let response = format!("Found {} users\n{}", users.len(), users.join("\n"));
            let size = response.len();

            // shared memory
            let key = generate_shm_key().to_string();
            create_shm(key.clone(), response);
            
            format!("{}.{}.", key, size)
        }
        _ => "Wrong header argument.".to_string(),
    };
    stream.write(response.as_bytes()).unwrap();

    // clear stream
    stream.flush().unwrap();
}

fn generate_shm_key() -> u16 {
    let mut rang = rand::thread_rng();
    let number: u16 = rang.gen();
    return number;
}

fn create_shm(key: String, response: String) {
    unsafe {
        // data
        let data = response.as_bytes();
        let ptr = data.as_ptr() as *const libc::c_void;
        let size: libc::size_t = response.len();

        // name of shared memory becomes our key
        let name: *const libc::c_char = key.as_ptr() as *const libc::c_char;
        
        // open shared memory
        let fd = libc::shm_open(name, libc::O_RDWR | libc::O_CREAT, libc::S_IRUSR | libc::S_IWUSR);
        if fd == -1 {
            println!("Error: cannot open shared memory.");
        }

        // set size of shared memory
        let response = libc::ftruncate(fd, size as libc::off_t);
        if response == -1 {
            println!("Error: cannot create shared memory.");
        }

        // map to shared memory
        let address = libc::mmap(ptr::null_mut(), size, libc::PROT_WRITE, libc::MAP_SHARED, fd, 0);
        if address == libc::MAP_FAILED {
            println!("Error: cannot map to shared memory.");
        }
        
        // copy data to shared memory
        libc::memcpy(address, ptr, data.len());
        libc::close(fd);
    }
}