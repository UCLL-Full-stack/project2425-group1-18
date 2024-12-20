

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UserService = {
  logIn: async (email: string, password: string) => {
    return fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
  },

  signUp: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: "admin" | "trainer" | "nurse"
  ) => {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role,
        }),
      });

      return await response.json();
  },
};

export default UserService;
