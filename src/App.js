import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.js";
import SignUp from "./pages/SignUp.js";
import API from "./API/API.js";
import HighScoreBoard from "./pages/HighScoreBoard.js";
import "../src/style/App.css";
import MainPage from "./pages/MainPage.js";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/HighScoreBoard" element={<HighScoreBoard />} />
        <Route path="/API" element={<API />} />
      </Routes>
    </div>
  );
};

export default App;
