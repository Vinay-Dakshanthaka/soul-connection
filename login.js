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
  const loginFormBtn = document.getElementById("loginForm");
  const dynamicToast = document.getElementById("dynamicToast");
  const toastBody = document.getElementById("toastBody");

  loginFormBtn.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const emailInput = document.getElementById("email").value;
    const passwordInput = document.getElementById("password").value;
    const signInBtn = document.getElementById('signInBtn')
    try {
      console.log("Logging in...");
      signInBtn.innerText = "Signing in"
      signInBtn.disabled = true
      const userCredential = await signInWithEmailAndPassword(auth, emailInput, passwordInput);

      const user = userCredential.user;
      const uid = user.uid;

      console.log(uid);

      const userRef = collection(firestore, "users");
      const userDocRef = doc(userRef, uid);
      const userSnapshot = await getDoc(userDocRef);
      console.log("Logged in", userCredential.user);
      showToast("Success", "Login Successful", "toast-success");
      setTimeout(() => {
        window.location.href = "./adminprofile.html";
        document.getElementById("adminNav").style.display = "block";
      }, 2000);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Error: ${errorCode}`, errorMessage);

      showToast("Error", "Invalid Credentials", "toast-error");
      signInBtn.innerText = "Sign in"
      signInBtn.disabled = false
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

  function showToast(header, body, styleClass) {
    // Remove existing style classes and add the new one
    dynamicToast.classList.remove("toast-success", "toast-error");
    dynamicToast.classList.add(styleClass);

    // Update toast body content
    toastBody.textContent = body;

    const toastInstance = new bootstrap.Toast(dynamicToast);
    toastInstance.show();
  }
});



