import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAc_u8F8yIuVKyvPAlR1ltzotL4zC-G0-s",
  authDomain: "quizzy-e8e4c.firebaseapp.com",
  projectId: "quizzy-e8e4c",
  storageBucket: "quizzy-e8e4c.appspot.com",
  messagingSenderId: "1082051371794",
  appId: "1:1082051371794:web:b79002878049ea434049cb",
  measurementId: "G-GF9LFKM972"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
