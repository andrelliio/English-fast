import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBrz0u4vEgTutg_nNPp2w6jlK7BHnP2q2Q",
  authDomain: "vocabflame.firebaseapp.com",
  projectId: "vocabflame",
  storageBucket: "vocabflame.firebasestorage.app",
  messagingSenderId: "342929096195",
  appId: "1:342929096195:web:6d20ffa1495e90bf2d5836"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
