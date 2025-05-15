import React, { useState } from "react";
import "./QuizSolvePage.css";

function QuizSolvePage({ quiz, onBack }) {
  const { questions, questionType } = quiz;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentIndex] = answer;
    setUserAnswers(updatedAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (
        q.answer.trim().toLowerCase() === (userAnswers[i] || "").trim().toLowerCase()
      ) {
        score += 1;
      }
    });
    return score;
  };

  const renderOptions = () => {
    if (questionType === "dogru-yanlis") {
      return (
        <div className="options">
          <button onClick={() => handleAnswer("Doğru")}>Doğru</button>
          <button onClick={() => handleAnswer("Yanlış")}>Yanlış</button>
        </div>
      );
    } else if (questionType === "bosluk-doldurma") {
      return (
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Cevabınızı yazın"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAnswer(e.target.value);
            }}
          />
          <button onClick={(e) => {
            const input = document.querySelector(".input-wrapper input");
            handleAnswer(input.value);
          }}>Gönder</button>
        </div>
      );
    } else {
      // Çoktan seçmeli
      return (
        <ul className="options">
          {currentQuestion.options.map((opt, i) => (
            <li key={i}>
              <button onClick={() => handleAnswer(opt)}>{opt}</button>
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div className="quiz-solve-container">
      {showResult ? (
        <div className="result">
          <h3>Quiz Bitti!</h3>
          <p>Puanınız: {calculateScore()} / {questions.length}</p>
          <button onClick={onBack}>Geri Dön</button>
        </div>
      ) : (
        <>
          <h2>Soru {currentIndex + 1}</h2>
          <div className="question-box">
            <h3>{currentQuestion.question}</h3>
            {renderOptions()}
          </div>
        </>
      )}
    </div>
  );
}

export default QuizSolvePage;
