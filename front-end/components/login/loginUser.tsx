import React, { useState } from "react";
import { useRouter } from "next/router";
import UserService from "@services/user.service";
import styles from "../../styles/login/login.module.css";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("trainer");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      const response = await UserService.logIn(email, password);
      if (response.status === 200) {
        const decryptedResponse = await response.json();
        const user = decryptedResponse.response;
        localStorage.setItem("loggedInUser", JSON.stringify({
          token: user.token,
          role: user.role,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
        }));


        onLoginSuccess();

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      setErrorMessage("Login failed: User not found or incorrect credentials.");
      console.error("Login error:", error);
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.form}>
      <div className={styles.radioGroup}>
        {}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="password" className={styles.label}>Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
      </div>


      <button type="submit" className={styles.button}>Login</button>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      {}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Password</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>red@gmail.com</td>
              <td>GonnaBeTheBest151</td>
              <td>trainer</td>
            </tr>
            <tr>
              <td>blue@gmail.com</td>
              <td>Sm3llY4L4ter</td>
              <td>trainer</td>
            </tr>
            <tr>
              <td>joy@gmail.com</td>
              <td>easyNurse</td>
              <td>nurse</td>
            </tr>
            <tr>
              <td>oak@gmail.com</td>
              <td>GoAsh!Go4</td>
              <td>admin</td>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  );
};

export default LoginForm;
