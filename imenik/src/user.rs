use std::fmt;

pub struct User {
    fname: String,
    lname: String,
    phone: String,
}

impl Clone for User {
    fn clone(&self) -> User {
        User {
            fname: self.fname.clone(),
            lname: self.lname.clone(),
            phone: self.phone.clone(),
        }
    }
}

impl User {
    pub fn new(fname: String, lname: String, phone: String) -> User {
        User {
            fname,
            lname,
            phone,
        }
    }

    pub fn to_string(&self) -> String {
        format!(
            "Ime: {} {}, telefonska: {}",
            self.fname, self.lname, self.phone
        )
    }
}

impl fmt::Display for User {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "Ime: {} {}, telefonska: {}",
            self.fname, self.lname, self.phone
        )
    }
}

pub struct PhoneBook {
    pub users: Vec<User>,
}

impl Clone for PhoneBook {
    fn clone(&self) -> PhoneBook {
        PhoneBook {
            users: self.users.clone(),
        }
    }
}

impl PhoneBook {
    pub fn new() -> PhoneBook {
        PhoneBook { users: Vec::new() }
    }

    pub fn find(&mut self, phone: &String) -> Option<(&User, usize)> {
        for (index, user) in self.users.iter().enumerate() {
            if user.phone == *phone {
                return Some((user, index));
            }
        }

        None
    }

    pub fn add(&mut self, user: User) -> Result<String, String> {
        match self.find(&user.phone) {
            None => {
                self.users.push(user);
                Ok("Successfully added new user.".to_string())
            }
            Some(_) => Ok("User already exists.".to_string()),
        }
    }

    pub fn remove(&mut self, phone: &String) -> Result<String, String> {
        match self.find(phone) {
            None => Ok("Error: user does not exist.".to_string()),
            Some((_user, index)) => {
                self.users.remove(index);
                Ok("Successfully removed user.".to_string())
            }
        }
    }

    pub fn print(&mut self, phone: &String) -> Result<String, String> {
        match self.find(phone) {
            None => Ok("Error: user does not exist.".to_string()),
            Some((user, _index)) => Ok(user.to_string()),
        }
    }

    pub fn search(&mut self, pattern: &String) -> Vec<String> {
        let mut vec: Vec<String> = Vec::new();

        for user in self.users.iter_mut() {
            if user.fname.contains(pattern) || user.lname.contains(pattern) {
                let user = format!("\t-> {}", user);
                vec.push(user);
            }
        }

        return vec;
    }

    pub fn clear(&mut self) -> Result<String, String> {
        self.users.clear();

        if self.users.is_empty() {
            Ok("Successfully cleared phone book.".to_string())
        } else {
            Ok("Error: cannot clear phone book.".to_string())
        }
    }

    /* pub fn print_all(&mut self) {
        for user in self.users.iter_mut() {
            println!("{}", user);
        }
    } */
}
