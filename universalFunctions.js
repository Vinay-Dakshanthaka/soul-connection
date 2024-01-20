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
  
  document.addEventListener("DOMContentLoaded", function () {
    onAuthStateChanged(auth, (user) => {
        console.log("inside auth");
        if (user) {
            console.log("if");
            console.log(user);
            // console.log(user.role);
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
        signOut(auth)
            .then(() => {
                showToast("Success", "Logout Successful", "toast-success");
                setTimeout(() => {
                    window.location.href = "./login.html";
                }, 2000);
            })
            .catch((error) => {
                showToast("Error", "Error while Sign out", "toast-error");
                console.error("Error in sign out", error);
            });
    });

    function showToast(body, styleClass) {
        const toastContainer = document.querySelector(".toast-container");
        if (toastContainer) {
            toastContainer.style.zIndex = 10500;
            // Remove existing style classes and add the new one
            dynamicToast.classList.remove("toast-success", "toast-error");
            dynamicToast.classList.add(styleClass);

            // Update toast body content
            toastBody.textContent = body;

            const toastInstance = new bootstrap.Toast(dynamicToast);
            toastInstance.show();
        } else {
            console.error("Toast container not found in the DOM");
        }
    }
});

  