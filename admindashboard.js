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
  collection
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




const pdfContentForm = document.getElementById("pdfContentUploadForm");

pdfContentForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const thumbnailFileInput = document.getElementById("thumbnail");
  const pdfFileInput = document.getElementById("pdfFile");
  const contentInput = document.getElementById("content");
  const issuePriceInput = document.getElementById("issuePrice");
  const pdfSubmitBtn = document.getElementById('pdfSubmitBtn')

  pdfSubmitBtn.textContent = "Uploading..."
  pdfSubmitBtn.disabled=true
  // Ensure that required fields are not empty
  if (!contentInput.value || !issuePriceInput.value || !thumbnailFileInput.files[0] || !pdfFileInput.files[0]) {
      alert("Please fill out all required fields and select both PDF file and thumbnail image.");
      return;
  }

  // Generate a unique ID for the document
  const documentId = doc(collection(firestore, "pdfContents")).id;

  // Upload thumbnail image to Storage
  const thumbnailFile = thumbnailFileInput.files[0];
  const thumbnailStorageRef = ref(storage, `thumbnails/${documentId}-${thumbnailFile.name}`);
  const thumbnailSnapshot = await uploadBytes(thumbnailStorageRef, thumbnailFile);
  const thumbnailUrl = await getDownloadURL(thumbnailSnapshot.ref);

  // Upload PDF file to Storage
  const pdfFile = pdfFileInput.files[0];
  const pdfStorageRef = ref(storage, `pdfs/${documentId}-${pdfFile.name}`);
  const pdfSnapshot = await uploadBytes(pdfStorageRef, pdfFile);
  const pdfUrl = await getDownloadURL(pdfSnapshot.ref);

  try {
      // Save data to Firestore
      await setDoc(doc(firestore, "pdfContents", documentId), {
          content: contentInput.value,
          issuePrice: issuePriceInput.value,
          thumbnailUrl,
          pdfUrl,
      });

      // Reset the form after successful submission
      pdfContentForm.reset();

      // Update thumbnail container with the uploaded thumbnail
      const thumbnailContainer = document.getElementById("thumbnail-container");
      thumbnailContainer.innerHTML = `<img src="${thumbnailUrl}" style="width: 100%; height: 100%;" alt="Thumbnail">`;

      // Show success toast
      showToast("Success", "PDF content uploaded successfully!", "toast-success");
      thumbnailContainer.innerHTML = '';
      pdfSubmitBtn.textContent = "Submit"
      pdfSubmitBtn.disabled=false

  } catch (error) {
      console.error("Error uploading PDF content:", error);
      pdfSubmitBtn.textContent = "Submit"
      pdfSubmitBtn.disabled=false
      // Show error toast
      showToast("Error", "An error occurred while uploading PDF content. Please try again.", "toast-error");
  }
});

function showToast(header, body, styleClass) {
  const toastContainer = document.querySelector(".toast-container");
  
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

