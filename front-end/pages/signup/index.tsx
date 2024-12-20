// pages/signup.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import SignUpForm from "@components/singup/signupUser"; // Importing SignUpForm
import styles from "../../styles/login/login.module.css";
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serversideTranslations';

const SignUpPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/login"); // Redirect to the login page
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
