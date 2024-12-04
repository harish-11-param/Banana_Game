import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/API.css";

import firebase from "firebase/compat/app";
import "firebase/compat/database";

import confetti from "https://cdn.skypack.dev/canvas-confetti";
import loss from "../sounds/loss.wav";
import won from "../sounds/won.wav";
import start from "../sounds/start.wav";
import imgUrl from "../images/bana.png";

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

const API = () => {
  const [heart, setHeart] = useState(5);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState("");
  const [solution, setSolution] = useState(-1);
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");
  const [time, setTime] = useState(25);
  const [timerRunning, setTimerRunning] = useState(false);
  const [pauseButtonText, setPauseButtonText] = useState("Pause");
  const [gameOver, setGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  let wonAudio = new Audio(won);
  let lossAudio = new Audio(loss);

  const startAudio = new Audio(start); // Create an Audio object for the start sound

  const navigate = useNavigate();
  const location = useLocation();
  var username = location.state?.username;

  const scoreData = {
    username: location.state?.username,
    score: score,
  };

  const fetchData = async () => {
    try {
      const response = await fetch("https://marcconrad.com/uob/banana/api.php");

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      setQuestion(data.question);
      setSolution(data.solution);

      setUserInput("");
      startTimer();
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    }
  };

  const startTimer = () => {
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const heartCountDec = () => {
    setHeart((prevHeart) => {
      lossAudio.play();
      if (prevHeart > 1) {
        prevHeart -= 1;
      } else {
        setGameOver(true);
        stopTimer();
      }
      return prevHeart;
    });
  };

  useEffect(() => {
    if (!username) {
      navigate("/");
      return; // Return to prevent further execution of the useEffect hook
    }

    // Check if the game is over and push score data to Firebase
    if (gameOver) {
      firebase.database().ref("scores").push(scoreData);
    }

    // Timer logic
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            heartCountDec();
            setTime(25);
          }
          return prevTime > 0 ? prevTime - 1 : prevTime;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [username, navigate, gameOver, timerRunning]);

  const checkAnswer = () => {
    if (Number(userInput) === solution) {
      wonAudio.play();
      confetti();
      setScore((score) => score + 10);
      setTime(25);
      fetchData();
    } else {
      heartCountDec();
    }
    clearAnswer();
  };

  const clearAnswer = () => {
    setUserInput("");
  };

  const restartGame = () => {
    setGameOver(false);
    setHeart(5);
    setScore(0);
    stopTimer();
    setTime(25);
    fetchData();
  };

  if (heart === 0) {
    setGameOver(true);
  }

  const handleNumberClick = (number) => {
    setUserInput((prevUserInput) => {
      if (prevUserInput.length < 1) {
        return number.toString();
      }
      return prevUserInput;
    });
  };

  const handleStartGame = () => {
    startAudio.play();
    setStartGame(true);
    fetchData();
  };

  const goToScoreboard = () => {
    navigate("/HighScoreBoard", { state: { username } });
  };

  const pauseGame = () => {
    if (!isPaused) {
      stopTimer();
      setPauseButtonText("Resume");
    } else {
      startTimer();
      setPauseButtonText("Pause");
    }
    setIsPaused(!isPaused);
  };

  const goLogout = () => {
    navigate("/", { state: { username: null } });
  };

  return (
    <div
      className={`container ${startGame ? "game-started" : "game-not-started"}`}
    >
      {!startGame ? (
        <>
          <div className="start-button">
            <button className="sign-button" onClick={handleStartGame}>
              Let’s PLAY
            </button>
          </div>
        </>
      ) : (
        <>
          {gameOver ? (
            <>
              <center className="center">
                <h1>Game Over</h1>
                <h3>
                  {username}'s Score is {score}
                </h3>
                <div>
                  <img src={imgUrl} alt="" />
                </div>
                <div>
                  <button
                    className="sign-button"
                    style={{ width: "200px" }}
                    onClick={restartGame}
                  >
                    New Game
                  </button>
                  <button
                    className="sign-button"
                    style={{ width: "200px" }}
                    onClick={goToScoreboard}
                  >
                    Scoreboard
                  </button>
                </div>
              </center>
            </>
          ) : (
            <>
              {error && <div className="error">Error: {error}</div>}

              <div className="api-top">
                <div className="timer">Time: {time} seconds</div>
                <button className="api-button" onClick={pauseGame}>
                  <span>{pauseButtonText}</span>
                </button>
                <div className="heart-icons">
                  {[...Array(heart)].map((_, index) => (
                    <span key={index} role="img" aria-label="banana">
                      🍌
                    </span>
                  ))}
                </div>
              </div>

              <center>
                <div className="question-container">
                  <img src={question} alt="Question" />
                </div>
              </center>

              <center>
                <div className="number-buttons">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                    <button
                      key={number}
                      onClick={() => handleNumberClick(number)}
                    >
                      {number}
                    </button>
                  ))}
                </div>
              </center>

              <center>
                <div className="api-bottom">
                  <div className="answer">
                    Answer:{" "}
                    <input
                      type="number"
                      className="inp-ans"
                      value={userInput}
                      readOnly
                    />
                    <button
                      className="api-button"
                      style={{ width: "150px" }}
                      onClick={checkAnswer}
                      disabled={userInput.length === 0}
                    >
                      Check
                    </button>
                    <button
                      className="api-button"
                      style={{ width: "150px" }}
                      onClick={clearAnswer}
                    >
                      Clear
                    </button>
                    <button className="api-button" onClick={restartGame}>
                      New Game
                    </button>
                    <button className="api-button" onClick={goLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              </center>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default API;
