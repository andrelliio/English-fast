import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
export const db = getFirestore(app);

console.log("Говорю свободно Init: v1.0.7 - Persistence Auto");

// We don't need top-level await for setPersistence because 
// browserLocalPersistence is the default and it can be handled 
// asynchronously without blocking the entire app's import tree.
setPersistence(auth, browserLocalPersistence).catch(err => {
  console.error("Auth persistence error:", err);
});
