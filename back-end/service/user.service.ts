import bcrypt from 'bcrypt';
import { AuthenticationResponse, Userinput } from "../types";
import { generateJwtToken } from '../util/jwt';
import userDB from '../repository/user.db';
import database from '../util/database';
import { User } from '../model/user';

const getAllUsers = async (): Promise<User[]> => userDB.getAllUsers();

const getUserByEmail = async ({ email }: { email: string }): Promise<User> => {
    const user = await userDB.getUserByEmail({ email });
    if (!user) {
      throw new Error(`User with email: ${email} does not exist.`);
    }
    return user;
  };
  
  const authenticate = async ({ email, password }: { email: string, password: string }): Promise<AuthenticationResponse> => {
    console.log('Attempting authentication for email:', email);

    const user = await getUserByEmail({ email });

    if (!user) {
        throw new Error('User not found.');
    }

    console.log("User found:", user);
    console.log("Stored password hash:", user.password);  
    console.log("Attempted plain text password:", password); 

    const isValidPassword = await bcrypt.compare(password, user.password);

    console.log("Password comparison result:", isValidPassword);

    if (!isValidPassword) {
        throw new Error('Incorrect password.');
    }

    
    return {
        token: generateJwtToken({ email, role: user.role }),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
    };
};

const createUser = async ({
  firstName,
  lastName,
  email,
  password,
  role,
}: Userinput): Promise<User> => {
  
  const existing = await userDB.getUserByEmail({ email });
  if (existing) {
    throw new Error(`User with email ${email} already exists`);
  }

  
  if (!["trainer", "nurse", "admin"].includes(role)) {
    throw new Error(`Invalid role: ${role}. Role must be either 'trainer', 'nurse', or 'admin'.`);
  }

  
  const hashPassword = await bcrypt.hash(password, 10);

  
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashPassword,
    role: role as "trainer" | "nurse" | "admin", 
  });

  
  return await userDB.createUser(user);
};


export default { authenticate,getAllUsers, createUser,getUserByEmail };
