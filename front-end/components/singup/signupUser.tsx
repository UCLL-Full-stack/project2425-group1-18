import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/login/login.module.css";
import { useTranslation } from "next-i18next";
import UserService from "../../services/user.service";

const SignUpForm: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<"admin" | "trainer" | "nurse">("trainer");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [signUpSuccess, setSignUpSuccess] = useState<boolean>(false); 

  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {

      const user = await UserService.signUp(firstName, lastName, email, password, role);
      console.log("User created successfully:", user);
      setSignUpSuccess(true); 
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (signUpSuccess) {

      setTimeout(() => {
        router.push("/login");
      }, 1000); 
    }
  }, [signUpSuccess, router]);

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="firstName" className={styles.label}>firstName</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="lastName" className={styles.label}>lastName</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email" className={styles.label}>email</label>
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
        <label htmlFor="password" className={styles.label}>password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="role" className={styles.label}>role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as "admin" | "trainer" | "nurse")}
          required
          className={styles.input}
        >
          <option value="trainer">trainer</option>
          <option value="nurse">nurse</option>
        </select>
      </div>

      <button type="submit" className={styles.button}>
        signUp
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default SignUpForm;
