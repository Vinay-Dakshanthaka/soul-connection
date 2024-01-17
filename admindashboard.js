import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  app,
  signOut,
  doc,
  firestore,
  getDoc,
  setDoc,
  onSnapshot,
} from "./initialize.js";

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const adminNav = document.getElementById("adminNav");

onAuthStateChanged(auth, (user) => {
  console.log("inside auth");
  if (user) {
    console.log("if");
    console.log(user);
    console.log(user.role);
    adminNav.style.display = "block";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    console.log("else");
    document.getElementById("loginBtn").style.display = "block";
    document.getElementById("logoutBtn").style.display = "none";
  }
});

logoutBtn.addEventListener("click", () => {
  alert("logout button");
  console.log("logout button clicked");
  signOut(auth)
    .then(() => {
      alert("signout successful");
      console.log("signout successful");
      window.location.href = "./login.html";
    })
    .catch((error) => {
      alert("signout error");
      console.error("Error in sign out", error);
    });
});
