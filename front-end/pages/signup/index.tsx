
import React, { useState } from "react";
import { useRouter } from "next/router";
import SignUpForm from "@components/singup/signupUser"; 
import styles from "../../styles/login/login.module.css";

const SignUpPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Sign Up</h1>
      <SignUpForm />

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      <div className={styles.toggle}>
        <p>
          Already have an account?{" "}
          <button className={styles.toggleButton} onClick={handleLoginRedirect}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
