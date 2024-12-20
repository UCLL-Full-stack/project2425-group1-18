import bcrypt from "bcrypt";
import { Userinput, AuthenticationResponse } from "../..//types";
import userService from "../../service/user.service";
import userDB from "../../repository/user.db";
import { User } from "../../model/user";
import { Role } from "@prisma/client";

// Mock the userDB methods
jest.mock("../../repository/user.db", () => ({
  getAllUsers: jest.fn(),
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
}));

// Mock bcrypt methods
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe("User Service", () => {
  const mockUser: User = new User({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "hashedPassword",  // This is a hashed password, not plain-text
    role: Role.trainer,  // role can be 'trainer', 'nurse', or 'admin'
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    test("should fetch all users", async () => {
      (userDB.getAllUsers as jest.Mock).mockResolvedValue([mockUser]);

      const users = await userService.getAllUsers();

      expect(users).toHaveLength(1);
      expect(users[0].email).toBe(mockUser.email);
    });
  });

  describe("getUserByEmail", () => {
    test("should fetch a user by email", async () => {
      (userDB.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      const user = await userService.getUserByEmail({ email: mockUser.email });

      expect(user).toBeTruthy();
      expect(user?.email).toBe(mockUser.email);
    });

    test("should throw an error if user is not found", async () => {
      (userDB.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(userService.getUserByEmail({ email: "nonexistent@example.com" }))
        .rejects
        .toThrow("User with email: nonexistent@example.com does not exist.");
    });
  });

  describe("createUser", () => {
    const userInput: Userinput = {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      password: "plainPassword",
      role: "trainer",
    };

    test("should create a new user", async () => {
      (userDB.getUserByEmail as jest.Mock).mockResolvedValue(null);

      (userDB.createUser as jest.Mock).mockResolvedValue({
        ...userInput,
        password: 'hashedPassword',  // Mocked hashed password
      });

      const createdUser = await userService.createUser(userInput);

      expect(createdUser).toBeTruthy();
      expect(createdUser.email).toBe(userInput.email);
      expect(createdUser.role).toBe(userInput.role);
    });

    test("should throw an error if the email already exists", async () => {
      (userDB.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(userService.createUser(userInput))
        .rejects
        .toThrow(`User with email ${userInput.email} already exists`);
    });
  });

  describe("authenticate", () => {
    test("should authenticate a user with valid credentials", async () => {
      (userDB.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const authResponse: AuthenticationResponse = await userService.authenticate({
        email: mockUser.email,
        password: "plainPassword",
      });

      expect(authResponse.token).toBeTruthy();
      expect(authResponse.email).toBe(mockUser.email);
    });

    test("should throw an error if password is incorrect", async () => {
      (userDB.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        userService.authenticate({ email: mockUser.email, password: "wrongPassword" })
      ).rejects.toThrow("Incorrect password.");
    });

    test("should throw an error if user is not found", async () => {
      (userDB.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        userService.authenticate({ email: "nonexistent@example.com", password: "password" })
      ).rejects.toThrow("User with email: nonexistent@example.com does not exist.");
    });
  });
});
