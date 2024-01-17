import {
  auth,
  signInWithEmailAndPassword,
  doc,
  getDoc,
  setDoc,
  collection,
  firestore,
} from "./initialize.js";

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  return password.length >= 6;
}

document.addEventListener("DOMContentLoaded", function () {
  let loginFormBtn = document.getElementById("loginForm");
  let userData = null;
  loginFormBtn.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    const emailInput = document.getElementById("email").value;
    const passwordInput = document.getElementById("password").value;
  
    try {
      console.log("logging in");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailInput,
        passwordInput
      );
      console.log("login success ");
      const user = userCredential.user;
      const uid = user.uid;
  
      console.log(uid);
  
      const userRef = collection(firestore, "users");
      const userDocRef = doc(userRef, uid);
  
      const userSnapshot = await getDoc(userDocRef);
  
      if (userSnapshot.empty) {
        await setDoc(userDocRef, {
          email: emailInput,
          uid: uid,
          role: "ADMIN",
        });
      } else {
        await setDoc(userDocRef, {
          email: emailInput,
          uid: uid,
          role: "ADMIN",
        });
      }
      console.log("logged in", userCredential.user);
  
      // Show success toast
      const successToast = new bootstrap.Toast(document.getElementById('successToast'));
      successToast.show();
  
      window.location.href = "./adminprofile.html";
      document.getElementById("adminNav").style.display = "block";
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error: ${errorCode}`, errorMessage);
  
      // Show error toast
      const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));
      errorToast.show();
    }
  });
  
  function validateForm() {
    const emailInput = document.getElementById("email").value;
    const passwordInput = document.getElementById("password").value;

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    emailError.textContent = "";
    passwordError.textContent = "";

    if (!isValidEmail(emailInput)) {
      emailError.textContent = "Invalid email format";
      return false;
    }

    if (!isValidPassword(passwordInput)) {
      passwordError.textContent = "Password must be at least 6 characters long";
      return false;
    }

    return true;
  }
});
