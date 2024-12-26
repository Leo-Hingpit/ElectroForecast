import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css"; // Import global CSS for better styling

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.status === 200) {
        setMessage(data.message);

        if (data.user && data.user.uuid) {
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/"); // Redirect to home
        } else {
          setError("Login successful, but user data is invalid.");
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Sign In</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Sign In
          </button>
        </form>
        <div className="signup-prompt">
          <p>Don't have an account?</p>
          <button onClick={() => navigate("/signup")} className="signup-button">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
