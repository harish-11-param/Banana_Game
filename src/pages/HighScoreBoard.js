import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import { useNavigate, useLocation } from "react-router-dom";
import "firebase/compat/database";
import "../style/HighScoreBoard.css";

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
const database = firebase.database();

// Function to fetch high scores from the database
const fetchHighScores = async () => {
  const scoresRef = database.ref("scores");
  const snapshot = await scoresRef
    .orderByChild("score")
    .limitToLast(10)
    .once("value");
  const scores = snapshot.val();
  return scores ? Object.values(scores).sort((a, b) => b.score - a.score) : [];
};

const HighScoreBoard = () => {
  const navigate = useNavigate();
  const [highScores, setHighScores] = useState([]);

  const location = useLocation();
  var username = location.state?.username;

  useEffect(() => {
    const fetchScores = async () => {
      const scores = await fetchHighScores();
      setHighScores(scores);
    };
    fetchScores();
  }, []);

  const goNewGame = () => {
    navigate("/API", { state: { username } });
  };

  return (
    <div className="container2">
      <table className="highscores-table">
        <tbody>
          {highScores.map((score, index) => (
            <tr key={index}>
              <td className="td1">{index + 1}</td>
              <div className="td2">
                <td>{score.username}</td>
                <td>{score.score}</td>
              </div>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <br />
      <button
        className="sign-button"
        style={{ width: "200px" }}
        onClick={goNewGame}
      >
        New Game
      </button>
    </div>
  );
};

export default HighScoreBoard;
