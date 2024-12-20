  import database from "../util/database";
  import { User } from "../model/user";  
  import { Role } from "../types";

  const getAllUsers = async (): Promise<User[]> => {
    try {
      const usersPrisma = await database.user.findMany();

      const users = usersPrisma.map((userPrisma) => 
        new User({
          ...userPrisma,
          role: userPrisma.role as Role,
        })
      );

      return users;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw new Error('Database error. See server log for details.');
    }
  };

  const getUserByEmail = async ({ email }: { email: string }): Promise<User | null> => {
    try {
      const userPrisma = await database.user.findUnique({
        where: { email },
      });


      if (userPrisma) {
        const user = new User({
          ...userPrisma,
          role: userPrisma.role as Role, 
        });

        return user;
      }
      
      return null; 
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw new Error('Database error. See server log for details.');
    }
  };

const createUser = async ({
  firstName,
  lastName,
  email,
  password,
  role,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "trainer" | "nurse" | "admin";  
}): Promise<User> => {
  try {
    const userPrisma = await database.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        role,
      },
    });

    if (role === "trainer") {
      await database.trainer.create({
        data: {
          userId: userPrisma.id,
        },
      });
    } else if (role === "nurse") {
      await database.nurse.create({
        data: {
          userId: userPrisma.id,
        },
      });
    }



    return User.from(userPrisma);  
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

  
 export default { getAllUsers, getUserByEmail,createUser };
