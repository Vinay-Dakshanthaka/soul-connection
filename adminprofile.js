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
  getFirestore,
  ref,
  storage,
  uploadBytes,
  getDownloadURL,
  updateDoc,
  deleteObject,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "./initialize.js";

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const adminNav = document.getElementById("adminNav");
const saveChangesBtn = document.getElementById("saveChanges");

const dynamicToast = document.getElementById("dynamicToast");
const toastBody = document.getElementById("toastBody");

let userData = null;

// Check user authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    adminNav.style.display = "block";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";

    // Fetch user data
    fetchUserData(user.uid);

    // Event listener for saveChangesBtn
    saveChangesBtn.addEventListener("click", () => {
      updateProfile(user.uid);
    });
  } else {
    document.getElementById("loginBtn").style.display = "block";
    document.getElementById("logoutBtn").style.display = "none";
  }
});

// Event listener for logoutBtn
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

// Function to fetch user data
function fetchUserData(uid) {
  onSnapshot(doc(firestore, "users", uid), (doc) => {
    userData = doc.data();
    displayUserData();
  });
}

// Function to display user data
function displayUserData() {
  let phoneInput = document.getElementById("phone");
  let nameInput = document.getElementById("name");
  let emailInput = document.getElementById("email");
  let profileImg = document.getElementById("profileImg");

  phoneInput.value = userData.phone || "";
  nameInput.value = userData.name || "";
  emailInput.value = auth.currentUser.email || "";
  profileImg.src = userData.profilePicture || "default_profile_image.jpg";
}

// Function to update user profile
// Function to update user profile
function updateProfile(uid) {
  let phoneInput = document.getElementById("phone").value;
  let nameInput = document.getElementById("name").value;
  let emailInput = document.getElementById("email").value;
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  const docRef = doc(firestore, "users", uid);

  if (file) {
    const storageRef = ref(storage, `profile_pictures/${uid}/${file.name}`);
    // Upload and store the new image
    const uploadTask = uploadBytes(storageRef, file);

    uploadTask
      .then((snapshot) => {
        console.log("Image uploaded successfully:", snapshot.metadata.fullPath);
        // Remove previous profile picture
        if (userData.profilePicture) {
          const prevImageRef = ref(storage, userData.profilePicture);
          deleteObject(prevImageRef)
            .then(() => {
              // Get the download URL of the uploaded image
              return getDownloadURL(snapshot.ref);
            })
            .then((downloadURL) => {
              // Update the Firestore document with the new image URL and other fields
              return setDoc(docRef, {
                phone: phoneInput,
                name: nameInput,
                email: emailInput,
                profilePicture: downloadURL,
              });
            })
            .then(() => {
              showToast(
                "Success",
                "Profile Updated Successfully",
                "toast-success"
              );
              console.log("Profile updated successfully");
              // Fetch and display the updated image
              fetchUserData(uid);
            })
            .catch((error) => {
              showToast("Error", "Something went wrong", "toast-error");
              console.error("Error updating profile:", error);
            });
        } else {
          // If there was no previous profile picture, proceed with the update
          // Get the download URL of the uploaded image
          return getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              // Update the Firestore document with the new image URL and other fields
              return setDoc(docRef, {
                phone: phoneInput,
                name: nameInput,
                email: emailInput,
                profilePicture: downloadURL,
              });
            })
            .then(() => {
              showToast(
                "Success",
                "Profile Updated Successfully",
                "toast-success"
              );
              console.log("Profile updated successfully");
              // Fetch and display the updated image
              fetchUserData(uid);
            })
            .catch((error) => {
              showToast("Error", "Something went wrong", "toast-error");
              console.error("Error updating profile:", error);
            });
        }
      })
      .catch((error) => {
        showToast("Error", "Error uploading image", "toast-error");
        console.error("Error uploading image:", error);
      });
  } else {
    // If no new image is selected, update the Firestore document with other fields
    updateDoc(docRef, {
      phone: phoneInput,
      name: nameInput,
      email: emailInput,
    })
      .then(() => {
        showToast("Success", "Profile Updated Successfully", "toast-success");
        console.log("Profile updated successfully");
        // Fetch and display the updated image
        fetchUserData(uid);
      })
      .catch((error) => {
        showToast("Error", "Something went wrong", "toast-error");
        console.error("Error updating profile:", error);
      });
  }
}

// Event listener for file input change
const fileInput = document.getElementById("fileInput");
fileInput.addEventListener("change", () => {
  const profileImg = document.getElementById("profileImg");
  const file = fileInput.files[0];

  if (file) {
    // Display the selected image without updating it
    const reader = new FileReader();
    reader.onload = function (e) {
      profileImg.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("changePasswordBtn").addEventListener("click", () => {
  document.querySelector("#changePasswordBtn").disabled = true;
  document.querySelector("#changePasswordBtn").textContent =
    "Updating Password...";
  // Get the current user
  const user = auth.currentUser;
  if (user) {
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword =
      document.getElementById("confirmNewPassword").value;

    // Verify that the current password and new password match
    if (currentPassword === newPassword) {
      showToast(
        "Current password and new password should not be the same.",
        "danger"
      );
      document.querySelector("#changePasswordBtn").disabled = false;
      document.querySelector("#changePasswordBtn").textContent =
        "Change Password";
      return;
    }

    // Verify that the new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      showToast(
        "New password and confirm new password do not match.",
        "danger"
      );
      document.querySelector("#changePasswordBtn").disabled = false;
      document.querySelector("#changePasswordBtn").textContent =
        "Change Password";
      return;
    }

    // Change the user's password
    updatePasswordFn(user, currentPassword, newPassword);

    // Close the change password modal
    const changePasswordModal = new bootstrap.Modal(
      document.getElementById("changePasswordModalLabel")
    );
    changePasswordModal.hide();
  }
});

// Function to update the user's password
function updatePasswordFn(user, currentPassword, newPassword) {
  // Check new password validity, else return
  if (!isValidPassword(document.querySelector("#newPassword").value)) return;

  const credentials = EmailAuthProvider.credential(user.email, currentPassword);

  // Reauthenticate the user with their current password
  reauthenticateWithCredential(user, credentials)
    .then(() => {
      // Password reauthentication successful, now update the password
      updatePassword(user, newPassword)
        .then(() => {
          showToast("Password updated successfully!", "success");
          document.querySelector("#changePasswordBtn").disabled = false;
          document.querySelector("#changePasswordBtn").textContent =
            "Change Password";
          // Close the change password modal
          const changePasswordModal = new bootstrap.Modal(
            document.getElementById("changePasswordModalLabel")
          );
          changePasswordModal.hide();
        })
        .catch((error) => {
          console.error("Error updating password:", error);
          showToast(
            "Error updating password. Please try again.",
            "danger"
          );
          document.querySelector("#changePasswordBtn").disabled = false;
          document.querySelector("#changePasswordBtn").textContent =
            "Change Password";
        });
    })
    .catch((error) => {
      console.error("Error reauthenticating user:", error);
      showToast(
        "Error reauthenticating user. Please check your current password.",
        "danger"
      );
      document.querySelector("#changePasswordBtn").disabled = false;
      document.querySelector("#changePasswordBtn").textContent =
        "Change Password";
    });
}

function showToast(body, styleClass) {

  const toastContainer = document.querySelector(".toast-container");
  toastContainer.style.zIndex = 10500; 
  // Remove existing style classes and add the new one
  dynamicToast.classList.remove("toast-success", "toast-error");
  dynamicToast.classList.add(styleClass);

  // Update toast body content
  toastBody.textContent = body;

  const toastInstance = new bootstrap.Toast(dynamicToast);
  toastInstance.show();
}

function isValidPassword(password) {
  return password.length >= 6;
}
