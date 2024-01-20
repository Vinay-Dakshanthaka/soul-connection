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

function displayLoader() {
  const loaderContainer = document.getElementById('loader-container');
  loaderContainer.style.display = 'block'; // Show the loader
}
function hideLoader() {
  const loaderContainer = document.getElementById('loader-container');
  loaderContainer.style.display = 'none'; // Show the loader
}

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
    saveChangesBtn.addEventListener('click', () => {
      if (validateForm()) {
          updateProfile(user.uid);
      }
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
      showToast("", "Logout Successful", "toast-success");
      setTimeout(() => {
        window.location.href = "./login.html";
      }, 2000);
    })
    .catch((error) => {
      showToast("", "Error while Sign out", "toast-error");
      console.error("Error in sign out", error);
    });
});

// Function to fetch user data
function fetchUserData(uid) {
  displayLoader()
  onSnapshot(doc(firestore, "users", uid), (doc) => {
    userData = doc.data();
    displayUserData();
    hideLoader()
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

  saveChangesBtn.disabled=true
  saveChangesBtn.innerText = 'Updating...'
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
                "",
                "Profile Updated Successfully",
                "toast-success"
              );
              console.log("Profile updated successfully");
              // Fetch and display the updated image
              fetchUserData(uid);
            })
            .catch((error) => {
              showToast("", "Something went wrong", "toast-error");
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
                "",
                "Profile Updated Successfully",
                "toast-success"
              );
              saveChangesBtn.disabled=false
              saveChangesBtn.innerText = 'Save Changes'
              console.log("Profile saved successfully");
              // Fetch and display the updated image
              fetchUserData(uid);
            })
            .catch((error) => {
              saveChangesBtn.disabled=false
              saveChangesBtn.innerText = 'Save Changes'
              showToast("", "Something went wrong", "toast-error");
              console.error("Error updating profile:", error);
            });
        }
      })
      .catch((error) => {
        showToast("", "Error uploading image", "toast-error");
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
        showToast("", "Profile Updated Successfully", "toast-success");
        console.log("Profile updated successfully");
        saveChangesBtn.disabled=false
        saveChangesBtn.innerText = 'Save Changes'
        // Fetch and display the updated image
        fetchUserData(uid);
      })
      .catch((error) => {
        showToast("", "Something went wrong", "toast-error");
        console.error("Error updating profile:", error);
        saveChangesBtn.disabled=false
        saveChangesBtn.innerText = 'Save Changes'
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
      showToast("",
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
      showToast("",
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
          showToast("","Password updated successfully!", "");
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
          showToast("",
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
      showToast("",
        "Error reauthenticating user. Please check your current password.",
        "danger"
      );
      document.querySelector("#changePasswordBtn").disabled = false;
      document.querySelector("#changePasswordBtn").textContent =
        "Change Password";
    });
}

function showToast(header, body, styleClass) {
  const toastContainer = document.querySelector(".toast-container");
  toastContainer.style.zIndex = "10500"

  if (toastContainer) {
    // Create a new toast element
    const dynamicToast = document.createElement("div");
    dynamicToast.classList.add("toast", styleClass);
    dynamicToast.setAttribute("role", "alert");
    dynamicToast.setAttribute("aria-live", "assertive");
    dynamicToast.setAttribute("aria-atomic", "true");

    // Create a toast header
    const toastHeader = document.createElement("div");
    toastHeader.classList.add("toast-header");

    // Create a strong element for the header
    const strong = document.createElement("strong");
    strong.classList.add("me-auto");
    strong.innerText = header;

    // Create a button for closing the toast
    const closeButton = document.createElement("button");
    closeButton.classList.add("btn-close");
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("data-bs-dismiss", "toast");
    closeButton.setAttribute("aria-label", "Close");

    // Create a div for the toast body
    const toastBody = document.createElement("div");
    toastBody.classList.add("toast-body");
    toastBody.innerText = body;

    // Assemble the toast elements
    toastHeader.appendChild(strong);
    toastHeader.appendChild(closeButton);
    dynamicToast.appendChild(toastHeader);
    dynamicToast.appendChild(toastBody);

    // Append the toast to the container
    toastContainer.appendChild(dynamicToast);

    // Initialize the Bootstrap toast and show it
    const bsToast = new bootstrap.Toast(dynamicToast);
    bsToast.show();

    // Remove the toast after it's closed
    dynamicToast.addEventListener("hidden.bs.toast", function () {
      dynamicToast.remove();
    });
  } else {
    console.error("Toast container not found in the DOM");
  }
}


function validateForm() {
  // Get form elements
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');

  // Reset previous errors
  nameError.textContent = '';
  phoneError.textContent = '';

  // Validate name
  if (nameInput.value.length <= 3) {
      nameError.textContent = 'Name must be more than 3 characters.';
      return false;  // Validation failed
  }

  // Validate phone number
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phoneInput.value)) {
      phoneError.textContent = 'Phone number must be exactly 10 digits.';
      return false;  // Validation failed
  }

  // Validation successful
  return true;
}