import React, { useState, useEffect } from "react"; 
import "./App.css";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
    onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import AppPage from "./AppPage";

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

    // ✅ Kullanıcı değişimini dinle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // kullanıcı varsa true yap
    });

    return () => unsubscribe(); // bileşen unmount olursa listener kaldır
  }, []);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      setLoginError("");
      setIsLoggedIn(true);
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const surname = e.target.surname.value.trim();
    const birthdate = e.target.birthdate.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name,
        surname,
        birthdate,
        email,
      });
      alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      setIsRegistering(false);
      setRegisterError("");
    } catch (error) {
      setRegisterError(error.message);
    }
  };

  const handlePasswordReset = () => {
    const email = prompt("Şifrenizi sıfırlamak için e-postanızı girin:");
    if (email) {
      sendPasswordResetEmail(auth, email)
        .then(() => alert("Şifre sıfırlama e-postası gönderildi."))
        .catch((err) => alert(err.message));
    }
  };

  if (isLoggedIn) {
    return <AppPage />;
  }

  return (
    <div className="container">
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

      {!isRegistering ? (
        <form id="login-box" className="login-box" onSubmit={handleLogin}>
          <h1 className="title">Quizzy</h1>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Şifre" required />
          <button type="submit">Giriş Yap</button>
          <div className="links">
            <a href="#" onClick={(e) => { e.preventDefault(); setIsRegistering(true); }}>
              Kayıt Ol
            </a> |{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); handlePasswordReset(); }}>
              Şifremi Unuttum
            </a>
          </div>
          <p id="error-message">{loginError}</p>
        </form>
      ) : (
        <form id="register-form" className="register-form" onSubmit={handleRegister}>
          <h1 className="title">Kayıt Ol</h1>
          <input type="text" name="name" placeholder="Adınız" required />
          <input type="text" name="surname" placeholder="Soyadınız" required />
          <input type="date" name="birthdate" placeholder="Doğum Tarihiniz" required />
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Şifre" required />
          <div className="button-group">
            <button type="submit">Kayıt Ol</button>
            <button type="button" className="cancel-btn" onClick={() => setIsRegistering(false)}>Vazgeç</button>
          </div>
          <p id="register-error-message">{registerError}</p>
        </form>
      )}
    </div>
  );
}

export default App;
