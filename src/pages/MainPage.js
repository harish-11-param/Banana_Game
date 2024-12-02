import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/MainPage.css";
import imgUrl from "../images/banana.png";

const MainPage = () => {
  const navigate = useNavigate();
  return (
    <div className="div">
      <div className="img">
        <img src={imgUrl} alt="" />
      </div>
      <div className="div1">
        <button className="sign-button" onClick={() => navigate("/login")}>
          Log In
        </button>
        <button className="sign-button" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default MainPage;
