export interface User {
    email: string;
    password: string;
    name: string;
    phone: string;
    favItems: string[];
  }
  
  export const users: User[] = [
    { 
      email: 'user1@example.com', 
      password: 'password123', 
      name: 'User One', 
      phone: '123-456-7890',
      favItems: ['tt0372784', 'tt0372782', 'tt0372781']
    },
    { 
      email: 'user2@example.com', 
      password: 'password123', 
      name: 'User Two', 
      phone: '987-654-3210',
      favItems: ['tt0372786', 'tt0372785']
    },
  ];
  
  // Function to find a user by email
  export const findUserByEmail = (email: string): User | undefined => {
    return users.find(user => user.email === email);
  };
  
  // Function to add a new user (prevents duplicate emails)
  export const addUser = (user: User): boolean => {
    if (findUserByEmail(user.email)) {
      return false; // Email already exists, prevent duplicate registration
    }
    users.push(user);
    return true;
  };
  