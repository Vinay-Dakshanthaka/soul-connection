import {
  auth,
  signInWithEmailAndPassword,
  doc,
  getDoc,
  setDoc,
  collection,
  firestore,
} from "./initialize.js";

// Function to check if the email is in a valid format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to check if the password meets the required criteria
function isValidPassword(password) {
  return password.length >= 6;
}

document.addEventListener("DOMContentLoaded", function () {
  const loginFormBtn = document.getElementById("loginForm");
  const dynamicToast = document.getElementById("dynamicToast");
  const toastBody = document.getElementById("toastBody");
  const signInBtn = document.getElementById("signInBtn");

  loginFormBtn.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      console.log("Logging in...");
      // Disable the Sign In button during the authentication process
      toggleSignInButton(true);

      const emailInput = document.getElementById("email").value;
      const passwordInput = document.getElementById("password").value;

      // Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailInput,
        passwordInput
      );

      const user = userCredential.user;
      const uid = user.uid;

      console.log("Logged in", userCredential.user);
      showToast("Success", "Login Successful", "toast-success");

      // Redirect to the admin profile page after successful login
      setTimeout(() => {
        window.location.href = "./adminprofile.html";
        document.getElementById("adminNav").style.display = "block";
      }, 2000);
    } catch (error) {
      handleSignInError(error);
    } finally {
      // Enable the Sign In button after the authentication process
      toggleSignInButton(false);
    }
  });

  // Function to toggle the state of the Sign In button
  function toggleSignInButton(disabled) {
    signInBtn.innerText = disabled ? "Signing in" : "Sign in";
    signInBtn.disabled = disabled;
  }

  // Function to handle errors during the sign-in process
  function handleSignInError(error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(`Error: ${errorCode}`, errorMessage);

    showToast("Error", "Invalid Credentials", "toast-error");
  }

  // Function to validate the email and password in the login form
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

  // Function to display toast messages
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
