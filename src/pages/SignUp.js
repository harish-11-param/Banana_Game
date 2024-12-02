import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../style/SignUp.css"; // Import your CSS file
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";

// Initialize Firebase with your configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIlS4Os5elVlemAEfTxTNMpBhGopV1YGs",
  authDomain: "game-18c9a.firebaseapp.com",
  databaseURL: "https://game-18c9a-default-rtdb.firebaseio.com",
  projectId: "game-18c9a",
  storageBucket: "game-18c9a.firebasestorage.app",
  messagingSenderId: "70857506927",
  appId: "1:70857506927:web:83b5060a7a1f7a7dd90d9a",
  measurementId: "G-D805KZTMPX",
};

firebase.initializeApp(firebaseConfig);

const SignUpPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  const handleSave = async () => {
    // Check if any of the input fields are empty
    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return; // Exit the function early
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return; // Exit the function early
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Write to firebase database
    const userData = {
      username: username,
      email: email,
      password: hashedPassword,
      // password: password,
    };

    firebase.database().ref("users").push(userData);
    console.log("User data saved successfully!");

    // Redirect to Login page
    navigate("/Login");
  };

  const redirectToLogin = () => {
    navigate("/login");
  };
  return (
    <div className="signup-page">
      <form onSubmit={handleSubmit}>
        <div className="signup-form">
          <div className="signup-form1">
            <label htmlFor="username">Username</label>
            <br />
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
          </div>

          <div className="signup-form1">
            <label htmlFor="email">Email</label>
            <br />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
          </div>
          <div className="signup-form1">
            <label htmlFor="password">Password</label>
            <br />
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <br />
          </div>
          <div className="signup-form1">
            {" "}
            <label htmlFor="confirmPassword">Confirm Password</label>
            <br />
            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                className="eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
            <br />
          </div>

          <center>
            <button type="button" className="signup-btn" onClick={handleSave}>
              Register
            </button>
          </center>
        </div>
      </form>

      <div>
        {" "}
        <center>
          <p className="register-text">
            Already have an account?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={redirectToLogin}
            >
              Login
            </span>
          </p>
        </center>
      </div>
    </div>
  );
};

export default SignUpPage;
