import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../style/Login.css";
import firebase from "firebase/compat/app"; // Import the Firebase module
import "firebase/compat/database"; // Import the Firebase Realtime Database module
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
const database = firebase.database(); // Initialize the database

const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginPass, setLoginPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  // Function to hash the password
  const hashPassword = async (password) => {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error("Error hashing password");
    }
  };

  const logInfun = async () => {
    try {
      // Fetch user data for the entered username
      const snapshot = await database
        .ref("users")
        .orderByChild("username")
        .equalTo(username)
        .once("value");
      const userData = snapshot.val();

      if (!userData) {
        alert("User not found. Please sign up.");
        return;
      }

      // Get the hashed password from the database
      const storedPassword = userData[Object.keys(userData)[0]].password;

      // Compare the entered password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, storedPassword);

      if (!passwordMatch) {
        alert("Incorrect password. Please try again.");
        return;
      }

      // Successful login - set username in local storage (optional)
      localStorage.setItem("username", username);

      navigate("/API", { state: { username } });

      setLoginPass(true);
    } catch (error) {
      console.log("Error logging in:", error.message);
      alert("An error occurred. Please try again.");
    }
  };

  const redirectToSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <div className="login-form">
          <div className="login-form1">
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

          <div className="login-form1">
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
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <br />
          </div>

          <center>
            {" "}
            <button
              type="submit"
              className="sign-btn"
              style={{
                width: "50%",
              }}
              onClick={logInfun}
            >
              Log In
            </button>
          </center>
        </div>
      </form>
      <div>
        {" "}
        <center>
          <p className="register-text">
            Don't have an account?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={redirectToSignUp}
            >
              Register
            </span>
          </p>
        </center>
      </div>
    </div>
  );
};

export default LoginPage;
