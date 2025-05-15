import React, { useEffect, useState } from "react";

function MyQuizzesPage({ onBack, onSolve }) {
  const [myQuizzes, setMyQuizzes] = useState([]);

  useEffect(() => {
    const savedQuizzes = JSON.parse(localStorage.getItem("myQuizzes")) || [];
    setMyQuizzes(savedQuizzes);
  }, []);

  return (
    <div className="my-quizzes-page">
      <h2>Hazırladığım Quizler</h2>
      <button onClick={onBack}>⏪ Ana Sayfaya Dön</button>

      {myQuizzes.length === 0 ? (
        <p>Henüz bir quiz oluşturmadın.</p>
      ) : (
        <ul>
          {myQuizzes.map((quiz, index) => (
            <li key={index} className="quiz-item">
              <strong>{quiz.title}</strong> – {quiz.questionType}
              <button onClick={() => onSolve(quiz)}>Çöz</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyQuizzesPage;
