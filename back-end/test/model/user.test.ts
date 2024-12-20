import { User } from '../../model/user'; // Adjust the path to where your User class is defined
import { Role } from '../../types'; // Adjust the path to where Role is defined

// Mock data for testing
const validUserData = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'securePassword123',
  role: 'USER' as Role,
};

describe('User Class', () => {
  test('should create a User instance with valid data', () => {
    const user = new User(validUserData);

    expect(user.getId()).toBe(validUserData.id);
    expect(user.getFirstName()).toBe(validUserData.firstName);
    expect(user.getLastName()).toBe(validUserData.lastName);
    expect(user.getEmail()).toBe(validUserData.email);
    expect(user.getPassword()).toBe(validUserData.password);
    expect(user.getRole()).toBe(validUserData.role);
  });

  test('should throw an error if required fields are missing during validation', () => {
    const invalidUserData = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: undefined,
    };

    expect(() => {
      new User(validUserData).validate(invalidUserData as any);
    }).toThrow('First name is required');

    invalidUserData.firstName = 'John';
    expect(() => {
      new User(validUserData).validate(invalidUserData as any);
    }).toThrow('Last name is required');

    invalidUserData.lastName = 'Doe';
    expect(() => {
      new User(validUserData).validate(invalidUserData as any);
    }).toThrow('Email is required');

    invalidUserData.email = 'john.doe@example.com';
    expect(() => {
      new User(validUserData).validate(invalidUserData as any);
    }).toThrow('Password is required');

    invalidUserData.password = 'securePassword123';
    expect(() => {
      new User(validUserData).validate(invalidUserData as any);
    }).toThrow('Role is required');
  });

  test('should correctly compare two User instances with equals()', () => {
    const user1 = new User(validUserData);
    const user2 = new User(validUserData);

    expect(user1.equals(user2)).toBe(true);

    const differentUserData = { ...validUserData, email: 'different@example.com' };
    const user3 = new User(differentUserData);

    expect(user1.equals(user3)).toBe(false);
  });

  test('should create a User instance from a Prisma User object', () => {
    const prismaUserData = { 
      ...validUserData, 
      role: 'USER' as Role // Explicitly casting to Role
    };
    const user = User.from(prismaUserData);
  
    expect(user).toBeInstanceOf(User);
    expect(user.getId()).toBe(prismaUserData.id);
    expect(user.getFirstName()).toBe(prismaUserData.firstName);
    expect(user.getLastName()).toBe(prismaUserData.lastName);
    expect(user.getEmail()).toBe(prismaUserData.email);
    expect(user.getPassword()).toBe(prismaUserData.password);
    expect(user.getRole()).toBe(prismaUserData.role);
  });  
});
