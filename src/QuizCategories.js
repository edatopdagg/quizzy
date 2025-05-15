import React from "react";
import "./QuizCategories.css";

const categories = [
  "Genel Kültür",
  "Spor",
  "Dünya Tarihi",
  "Türk Tarihi",
  "Dizi Film"
];

function QuizCategories({ onSelectCategory }) {
  return (
<div className="quiz-categories-wrapper">
  <h2 className="category-title">Kategori Seç</h2>
  <div className="category-grid">
    {categories.map((cat, i) => (
      <div className="category-card" key={i} onClick={() => onSelectCategory(cat.toLowerCase().replace(/ /g, "_"))}>
        {cat}
      </div>
    ))}
  </div>
</div>
  );
}

export default QuizCategories;
