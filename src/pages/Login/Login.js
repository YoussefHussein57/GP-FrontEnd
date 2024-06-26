import React from "react";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { getLast10Readings, login } from "../../Helpers/apiHelper";

const Login = ({ setEmail, setPassword }) => {
  const [email, setEmailLocal] = React.useState(""); // Local state for email
  const [password, setPasswordLocal] = React.useState(""); // Local state for password
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    const token = await login(email, password); // Get the token from login function
    console.log("Login token:", token); // Log the token
    if (token) {
      // Redirect to the home page and pass email and password to Sidebar
      setEmail(email); // Update parent state with current email
      setPassword(password); // Update parent state with current password
      navigate("/home");
    }
  };

  const handleEmailChange = (e) => {
    setEmailLocal(e.target.value); // Update local state for email
  };

  const handlePasswordChange = (e) => {
    setPasswordLocal(e.target.value); // Update local state for password
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
                onChange={handleEmailChange}
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
                onChange={handlePasswordChange}
              />
            </div>

            <div>
              <button type="submit">Log In</button>
            </div>
          </form>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
