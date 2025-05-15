import React, { useEffect, useState } from "react";
import quizData from "./quiz.json";
import "./QuizPage.css";

function QuizPage({ category, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    if (quizData.quiz[category]) {
      setQuestions(quizData.quiz[category]);
    } else {
      alert("Kategoriye ait soru bulunamadı.");
    }
  }, [category]);

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const checkAnswer = (answer) => {
    const correctAnswer = questions[current].dogru_cevap;
    if (answer === correctAnswer) {
      alert("✅ Doğru!");
      setCorrect((prev) => prev + 1);
    } else {
      alert("❌ Yanlış! Doğru cevap: " + correctAnswer);
      setWrong((prev) => prev + 1);
    }

    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  if (!questions.length) return <p>Yükleniyor...</p>;

  return (
    <div className="quiz-page-container">
      <h2 className="quiz-category-title">{category.replace(/_/g, " ").toUpperCase()}</h2>

      {!quizStarted ? (
        <button id="start-btn" onClick={startQuiz}>🎯 Quizi Başlat</button>
      ) : !quizFinished ? (
        <>
          <p className="quiz-question">{questions[current].soru}</p>
          <div className="quiz-options">
            {questions[current].secenekler.map((s, i) => (
              <button key={i} onClick={() => checkAnswer(s)}>
                {s}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div id="sonuc">
          <h3>Quiz Bitti!</h3>
          <p>✅ Doğru: {correct} | ❌ Yanlış: {wrong}</p>
          <button className="btn-success mt-3" onClick={onBack}>Ana Sayfa</button>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
