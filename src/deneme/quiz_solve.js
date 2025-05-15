// 🟠 Global değişkenler
let category;
let questions = [];
let currentQuestionIndex = 0;
let correct = 0;
let wrong = 0;

// 🟢 Kategori seçimi (index.html'den)
function selectCategory(categoryName) {
  const param = encodeURIComponent(categoryName.toLowerCase().replace(/ /g, "_"));
  window.location.href = `quiz.html?category=${param}`;
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("quiz.html")) {
    // ⬇️ Bu kodlar sadece quiz.html sayfasında çalışır
    const params = new URLSearchParams(window.location.search);
    category = params.get("category");

    if (!category) {
      alert("Kategori bulunamadı.");
      return;
    }

    // Başlık yazısını düzgün göstermek için "_" -> " " ve tümünü büyük harf yap
    document.getElementById("category-title").textContent = category.replace(/_/g, " ").toUpperCase();

    document.getElementById("start-btn").addEventListener("click", () => {
      fetch("quiz.json")
        .then((res) => res.json())
        .then((data) => {
          if (!data.quiz || !data.quiz[category]) {
            alert("Bu kategoriye ait soru bulunamadı.");
            return;
          }

          questions = data.quiz[category];

          if (questions.length === 0) {
            alert("Bu kategoriye ait soru bulunamadı.");
            return;
          }

          document.getElementById("start-btn").style.display = "none";
          document.getElementById("quiz-area").style.display = "block";
          showQuestion();
        })
        .catch((err) => {
          console.error("JSON yükleme hatası:", err);
          alert("Veri yüklenirken hata oluştu.");
        });
    });
  }
});

// 🟣 Soru gösterme fonksiyonu
function showQuestion() {
  const soru = questions[currentQuestionIndex];
  document.getElementById("soru-text").textContent = soru.soru;

  const seceneklerDiv = document.getElementById("secenekler-container");
  seceneklerDiv.innerHTML = "";

  soru.secenekler.forEach((secenek) => {
    const btn = document.createElement("button");
    btn.textContent = secenek;
    btn.classList.add("btn", "btn-outline-primary", "m-1", "w-100");
    btn.onclick = () => checkAnswer(secenek);
    seceneklerDiv.appendChild(btn);
  });
}

// 🟡 Cevap kontrolü
function checkAnswer(secim) {
  const dogruCevap = questions[currentQuestionIndex].dogru_cevap;
  if (secim === dogruCevap) {
    alert("✅ Doğru!");
    correct++;
  } else {
    alert("❌ Yanlış! Doğru cevap: " + dogruCevap);
    wrong++;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// 🔴 Quiz sonucu
function showResult() {
  document.getElementById("quiz-area").style.display = "none";
  const sonuc = document.getElementById("sonuc");
  sonuc.style.display = "block";
  sonuc.innerHTML = `<h3>Quiz Bitti!</h3><p>✅ Doğru: ${correct} | ❌ Yanlış: ${wrong}</p><br>
  <a href="index.html" class="btn btn-success">Ana Sayfaya Dön</a>`;
}
