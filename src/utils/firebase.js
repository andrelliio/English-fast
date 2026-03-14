import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, inMemoryPersistence } from "firebase/auth";
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

console.log("Говорю свободно Init: v1.0.5 - Persistence.NONE");

// Use inMemoryPersistence so it clears on refresh/entry (requires re-login)
// Top-level await ensures this is set before App imports auth
try {
  await setPersistence(auth, inMemoryPersistence);
} catch (err) {
  console.error("Auth persistence error:", err);
}

export const db = getFirestore(app);
