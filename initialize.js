import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  onSnapshot,
  updateDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  uploadString
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const storage = getStorage(app);

export {
  app,
  firestore,
  auth,
  getAuth,
  getFirestore,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  getStorage,
  ref,
  storage,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  updateDoc,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  getDocs,
  uploadString,
  addDoc
};
