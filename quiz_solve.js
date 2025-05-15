// src/quiz_solve.js
import React from 'react';
import './quiz_solve.css';

const categories = [
  'Genel Kültür',
  'Spor',
  'Dünya Tarihi',
  'Türk Tarihi',
  'Dizi/Film',
];

export default function QuizSolve() {
  return (
    <div className="quiz-container">
      {categories.map((category, index) => (
        <div key={index} className="category-card">
          {category}
        </div>
      ))}
    </div>
  );
}
