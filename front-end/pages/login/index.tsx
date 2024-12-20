
import React, { useState } from "react";
import { useRouter } from "next/router";
import LoginForm from "@components/login/loginUser"; 
import styles from "../../styles/login/login.module.css";

const LoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  const handleLoginSuccess = () => {
    console.log("Login successful!");
  };

  const handleSignUpRedirect = () => {
    router.push("/signup");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Login</h1>
      <LoginForm onLoginSuccess={handleLoginSuccess} />

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      <div className={styles.toggle}>
        <p>
          Don't have an account?{" "}
          <button className={styles.toggleButton} onClick={handleSignUpRedirect}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
