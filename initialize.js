import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore,collection,doc,getDoc,setDoc,onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth,signInWithEmailAndPassword,onAuthStateChanged,signOut,createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-d-hMT6zpHCi3AikyXdTRYNka3l6zgTo",
  authDomain: "soulconnection-f224f.firebaseapp.com",
  projectId: "soulconnection-f224f",
  storageBucket: "soulconnection-f224f.appspot.com",
  messagingSenderId: "301458203898",
  appId: "1:301458203898:web:2b6994b1c98f769cf35543",
  measurementId: "G-25GJYYXFYF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, firestore, auth, getAuth,getFirestore,signInWithEmailAndPassword,onAuthStateChanged,signOut,createUserWithEmailAndPassword,
collection,doc,getDoc,setDoc,onSnapshot
};
