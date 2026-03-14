import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

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

// Set persistence to session only (clears when browser/tab is closed)
setPersistence(auth, browserSessionPersistence).catch((err) => {
  console.error("Auth persistence error:", err);
});

export const db = getFirestore(app);

// Enable persistence once globaly
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence enabled in only one.');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser does not support persistence.');
  }
});
