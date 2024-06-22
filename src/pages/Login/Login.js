// src/pages/Login/Login.js
import React from "react";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

let BASE_URL = "http://localhost:4000/api";

export default function BackgroundComponent() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const response = await axios.post(`${BASE_URL}/users/login`, {
        email,
        password,
      });

      setError("Login Successful");
      console.log("token:", response.data.token);

      // Redirect to the home page
      navigate("/home");
    } catch (err) {
      if (err.response) {
        console.error("Response error:", err.response);
        setError(err.response.data.message || "Invalid Credentials");
      } else if (err.request) {
        console.error("Request error:", err.request);
        setError("No response from the server. Please try again later.");
      } else {
        console.error("General error:", err.message);
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="background-container">
      <div className="background-left">
        <div className="logo"></div>
        <div className="text-container">
          <h1>Helwan</h1>
          <h2>Monitoring System</h2>
        </div>
      </div>
      <div className="background-right">
        <div className="login-form-container">
          <h2>Welcome Back!</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label className="label">
                <p>Email</p>
              </label>
              <span className="icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label className="label">
                <p>Password</p>
              </label>
              <span className="icon">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type="password"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="forgot-password">Forgot Password?</div>
            <div>
              <button type="submit">Log In</button>
            </div>
          </form>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
