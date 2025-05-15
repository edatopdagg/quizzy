import './QuizCreatePage.css'
import React, { useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function QuizCreatePage({ count, type, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizTitle, setQuizTitle] = useState(""); // yeni eklendi
  const [questions, setQuestions] = useState(Array.from({ length: count }, () => ({
    question: "",
    options: ["", "", "", ""],
    answer: "",
  })));

  const handleInputChange = (field, value) => {
    const updatedQuestions = [...questions];
    if (field === "question" || field === "answer") {
      updatedQuestions[currentIndex][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].options[index] = value;
    setQuestions(updatedQuestions);
  };

  const handleSaveQuiz = async () => {
    try {
      const user = auth.currentUser;

      const newQuiz = {
        title: quizTitle || "Adsız Quiz",
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        questionType: type,
        questions: questions,
      };

      // 🔥 Firestore'a kayıt
      await addDoc(collection(db, "quizzes"), {
        ...newQuiz,
        createdAt: serverTimestamp(),
      });

      // 💾 localStorage'a kaydet
      const existing = JSON.parse(localStorage.getItem("myQuizzes")) || [];
      existing.push(newQuiz);
      localStorage.setItem("myQuizzes", JSON.stringify(existing));

      onBack(); // ana sayfaya dön
    } catch (err) {
      alert("Quiz kaydedilirken hata oluştu: " + err.message);
    }
  };

  return (
    <div className="quiz-create-page">
      <h2>{currentIndex + 1}. Soru</h2>

      {currentIndex === 0 && (
        <input
          placeholder="Quiz başlığı (isteğe bağlı)"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
        />
      )}

      <textarea
        placeholder="Soru metnini girin"
        value={questions[currentIndex].question}
        onChange={(e) => handleInputChange("question", e.target.value)}
      />

      {type === "çoktan-seçmeli" && (
        <div className="options">
          {questions[currentIndex].options.map((opt, i) => (
            <input
              key={i}
              placeholder={`${i + 1}. Şık`}
              value={opt}
              onChange={(e) => handleOptionChange(i, e.target.value)}
            />
          ))}
        </div>
      )}

      <input
        placeholder="Doğru cevabı girin"
        value={questions[currentIndex].answer}
        onChange={(e) => handleInputChange("answer", e.target.value)}
      />

      <div className="nav-buttons">
        <button onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}>Geri</button>
        <button onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, count - 1))}>İleri</button>
      </div>

      {currentIndex === count - 1 && (
        <button className="btn save-btn" onClick={handleSaveQuiz}>Quiz'i Kaydet</button>
      )}
    </div>
  );
}

export default QuizCreatePage;
