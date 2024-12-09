import React, { useState } from "react";
import { useRouter } from "next/router";

// Simulate a simple login service
const loginService = async (email: string, password: string, role: string) => {
  // In a real scenario, you would use a backend service for authentication.
  // Here, we're assuming a simple check based on hardcoded values for demonstration.

  if (role === "trainer") {
    if (email === "trainer@example.com" && password === "trainer123") {
      // Save trainer info to localStorage (can replace with your auth logic)
      localStorage.setItem("trainerId", "trainer12345");
      return { success: true, role: "trainer" };
    }
  } else if (role === "nurse") {
    if (email === "nurse@example.com" && password === "nurse123") {
      // Save nurse info to localStorage (can replace with your auth logic)
      localStorage.setItem("nurseId", "nurse12345");
      return { success: true, role: "nurse" };
    }
  }

  return { success: false, message: "Wrong email or password." };
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("trainer");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation (can be enhanced)
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    const response = await loginService(email, password, role);

    if (response.success) {
      // Redirect based on role
      if (response.role === "trainer") {
        router.push("/pokemons"); // Redirect to the trainer's Pokémon page
      } else if (response.role === "nurse") {
        router.push("/nurseDashboard"); // Redirect to the nurse's dashboard (implement this page)
      }
    } else {
      setErrorMessage(response.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>PokéPal</h1>
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="role"
              value="trainer"
              checked={role === "trainer"}
              onChange={() => setRole("trainer")}
              style={styles.radio}
            />
            Trainer
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="role"
              value="nurse"
              checked={role === "nurse"}
              onChange={() => setRole("nurse")}
              style={styles.radio}
            />
            Nurse
          </label>
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>Login</button>

        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      </form>
    </div>
  );
};


const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f7f7f7",
    padding: "20px",
  },
  header: {
    fontSize: "3rem",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  radioGroup: {
    display: "flex",
    justifyContent: "space-between",
  },
  radioLabel: {
    fontSize: "1rem",
  },
  radio: {
    marginRight: "5px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "1rem",
    marginBottom: "5px",
  },
  input: {
    padding: "8px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
    marginTop: "10px",
  },
};

export default LoginPage;
