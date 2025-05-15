import React, { useState, useRef, useEffect } from "react";
import "./AppPage.css";
import QuizCreatePage from "./QuizCreatePage";
import QuizCategories from "./QuizCategories";
import QuizPage from "./QuizPage";
import MyQuizzesPage from "./MyQuizzesPage";
import QuizSolvePage from "./QuizSolvePage";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

function AppPage() {
  const [showModal, setShowModal] = useState(false);
  const [quizMode, setQuizMode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userName, setUserName] = useState("Kullanıcı");
  const [quizSetup, setQuizSetup] = useState(null);
  const [quizToSolve, setQuizToSolve] = useState(null); // <-- EKLENDİ

  const profileMenuRef = useRef(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserName(userData.name || "Kullanıcı");
          }
        }
      } catch (error) {
        console.error("Kullanıcı adı alınamadı:", error);
      }
    };

    fetchUserName();
  }, []);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSetupSubmit = (e) => {
    e.preventDefault();
    const questionCount = parseInt(e.target.soruSayisi.value);
    const type = e.target.soruTipi.value;
    if (!questionCount || !type) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    setQuizSetup({ count: questionCount, type });
    setQuizMode("create");
  };

  const handleQuizSolveClick = () => {
    setQuizMode("solve");
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToHome = () => {
    setQuizMode(null);
    setSelectedCategory(null);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert("Çıkış yapıldı.");
      setShowProfileMenu(false);
    } catch (error) {
      alert("Çıkış sırasında bir hata oluştu: " + error.message);
    }
  };

  const handleViewMyQuizzes = () => {
    setQuizMode("myquizzes"); // <-- GÜNCELLENDİ
    setShowProfileMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="container">
      <nav className="navbar">
        <div className="logo">Quizzy</div>
        <ul className="nav-links">
          <button onClick={handleBackToHome}>Ana Sayfa</button>
          <div className="profile-wrapper" ref={profileMenuRef}>
            <button onClick={toggleProfileMenu}>Profil</button>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <button onClick={handleViewMyQuizzes}>Hazırladığım Quizler</button>
                <button onClick={handleLogout}>Çıkış Yap</button>
              </div>
            )}
          </div>
        </ul>
      </nav>

      <div className="background-images">
        <img src="images/resim1.png" className="floating" alt="" style={{ top: "10%", left: "5%" }} />
        <img src="images/resim2.png" className="floating" alt="" style={{ top: "20%", left: "80%" }} />
        <img src="images/resim3.png" className="floating" alt="" style={{ top: "70%", left: "10%" }} />
        <img src="images/resim4.png" className="floating" alt="" style={{ top: "80%", left: "70%" }} />
        <img src="images/quizzy1.png" className="floating" alt="" style={{ top: "20%", left: "20%" }} />
        <img src="images/quizzy2.png" className="floating" alt="" style={{ top: "40%", left: "70%" }} />
        <img src="images/quizzy3.png" className="floating" alt="" style={{ top: "60%", left: "80%" }} />
        <img src="images/quizzy4.png" className="floating" alt="" style={{ top: "40%", left: "10%" }} />
      </div>

      {quizMode === "create" && quizSetup ? (
        <QuizCreatePage
          count={quizSetup.count}
          type={quizSetup.type}
          onBack={handleBackToHome}
        />
      ) : quizMode === "solve" ? (
        selectedCategory ? (
          <QuizPage category={selectedCategory} onBack={handleBackToHome} />
        ) : (
          <QuizCategories onSelectCategory={handleCategorySelect} />
        )
      ) : quizMode === "myquizzes" ? (
        <MyQuizzesPage
          onBack={handleBackToHome}
          onSolve={(quiz) => {
            setQuizToSolve(quiz);
            setQuizMode("solveCustom");
          }}
        />
      ) : quizMode === "solveCustom" ? (
        <QuizSolvePage
          quiz={quizToSolve}
          onBack={() => setQuizMode("myquizzes")}
        />
      ) : (
        <main>
          <h1>Quizzy'e Hoş Geldin <strong>{userName}</strong>!</h1>
          <div className="button-container">
            <button onClick={handleOpenModal} className="btn quiz-create">Quiz Hazırlama</button>
            <button onClick={handleQuizSolveClick} className="btn quiz-take">Quiz Çözme</button>
          </div>
        </main>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Quiz Oluştur</h2>
            <form onSubmit={handleSetupSubmit} className="quiz-form">
              <label>Soru Sayısı:</label>
              <input type="number" name="soruSayisi" min="1" max="50" required />
              <label>Soru Tipi:</label>
              <select name="soruTipi" required>
                <option value="">Seçiniz</option>
                <option value="çoktan-seçmeli">Çoktan Seçmeli</option>
                <option value="doğru-yanlış">Doğru / Yanlış</option>
                <option value="bosluk-doldurma">Boşluk Doldurma</option>
                <option value="karisik">Karışık</option>
              </select>
              <button type="submit" className="btn submit-btn">Devam Et</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppPage;
