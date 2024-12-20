// pages/login.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import LoginForm from "@components/login/loginUser"; // Importing LoginForm
import styles from "../../styles/login/login.module.css";
import { serverSideTranslations } from 'next-i18next/serversideTranslations';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';

const LoginPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  const { t } = useTranslation();


  // Success callback when login is successful
  const handleLoginSuccess = () => {
    console.log("Login successful!");
    // You can add further logic here after login success
  };

  const handleSignUpRedirect = () => {
    router.push("/signup"); // Redirect to the signup page
  };

  return (
    <>
    <Head>
      <title>{t("app.title")}</title>
    </Head>
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
    </>
  );
};

export const getServerSideProps = async (context: { locale: any; }) => {
  const {locale} = context;

  return {
      props: {
          ...(await serverSideTranslations(locale ?? "en", ["common"]))
      },
  };
};

export default LoginPage;
