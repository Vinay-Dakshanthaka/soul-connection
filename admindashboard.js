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
  collection,
  uploadString,
  addDoc,
  getDocs
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
  const pdfSubmitBtn = document.getElementById("pdfSubmitBtn");

  pdfSubmitBtn.textContent = "Uploading...";
  pdfSubmitBtn.disabled = true;
  // Ensure that required fields are not empty
  if (
    !contentInput.value ||
    !issuePriceInput.value ||
    !thumbnailFileInput.files[0] ||
    !pdfFileInput.files[0]
  ) {
    alert(
      "Please fill out all required fields and select both PDF file and thumbnail image."
    );
    return;
  }

  // Generate a unique ID for the document
  const documentId = doc(collection(firestore, "pdfContents")).id;

  // Upload thumbnail image to Storage
  const thumbnailFile = thumbnailFileInput.files[0];
  const thumbnailStorageRef = ref(
    storage,
    `thumbnails/${documentId}-${thumbnailFile.name}`
  );
  const thumbnailSnapshot = await uploadBytes(
    thumbnailStorageRef,
    thumbnailFile
  );
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
    thumbnailContainer.innerHTML = "";
    pdfSubmitBtn.textContent = "Submit";
    pdfSubmitBtn.disabled = false;
  } catch (error) {
    console.error("Error uploading PDF content:", error);
    pdfSubmitBtn.textContent = "Submit";
    pdfSubmitBtn.disabled = false;
    // Show error toast
    showToast(
      "Error",
      "An error occurred while uploading PDF content. Please try again.",
      "toast-error"
    );
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

// Function to save form data to Firestore
async function saveFormData() {
  const issueVersion = document.getElementById("issueVersion").value;
  const contentIssuePrice = document.getElementById("contentIssuePrice").value;
  const thumbnailFile = document.getElementById("currentIssuethumbnail")
    .files[0];

  // Upload thumbnail image to Firebase Storage
  const storageRef = ref(
    storage,
    `contentIssueThumbnails/${thumbnailFile.name}`
  );
  const snapshot = await uploadBytes(storageRef, thumbnailFile);

  // Get the download URL of the uploaded image
  const thumbnailUrl = await getDownloadURL(snapshot.ref);

  // Save the form data to Firestore
  const docRef = await addDoc(collection(firestore, "issues"), {
    issueVersion,
    contentIssuePrice,
    thumbnailUrl,
    // Add other fields as needed
  });

  console.log("Document written with ID: ", docRef.id);
  await saveDynamicallyAddedRows(docRef.id); // Save dynamically added rows with the document ID
}

// Function to save dynamically added rows in an array
async function saveDynamicallyAddedRows(documentId) {
  const tableRows = document.querySelectorAll("#dataTable tbody tr");
  const rowsData = [];

  tableRows.forEach((row) => {
    const cells = row.getElementsByTagName("td");
    const rowData = {
      issueTopic: cells[0].innerText,
      authorName: cells[1].innerText,
      issueContent: cells[2].innerText,
    };
    rowsData.push(rowData);
  });

  // Update the document with the array of rows
  await updateDoc(doc(firestore, "issues", documentId), {
    contentIssuesArray: rowsData,
  });

  console.log("Dynamically added rows saved successfully.");
}

// Event listener for the Add button
document.getElementById("addButton").addEventListener("click", function () {
  document.getElementById("addButton").addEventListener("click", function () {
    var issueTopic = document.getElementById("issueTopic").value;
    var authorName = document.getElementById("authorName").value;
    var issueContent = document.getElementById("issueTopicContent").value;

    if (issueTopic && authorName && issueContent) {
      // Create a new table row
      var newRow = document.createElement("tr");
      newRow.innerHTML =
        `<td>${issueTopic}</td>` +
        `<td>${authorName}</td>` +
        `<td>${issueContent}</td>` +
        '<td><button class="btn btn-danger btn-sm deleteButton">Delete</button></td>';

      // Append the new row to the table body
      document
        .getElementById("dataTable")
        .getElementsByTagName("tbody")[0]
        .appendChild(newRow);

      // Show the table
      document.getElementById("dataTable").style.display = "table";

      // Clear input fields
      document.getElementById("issueTopic").value = "";
      document.getElementById("authorName").value = "";
      document.getElementById("issueTopicContent").value = "";
    } else {
      // alert("Please fill in all the fields.");
    }
  });

  // Delete button functionality
  document
    .getElementById("dataTable")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("deleteButton")) {
        event.target.closest("tr").remove();

        // Hide the table if there are no rows
        if (
          document
            .getElementById("dataTable")
            .getElementsByTagName("tbody")[0]
            .getElementsByTagName("tr").length === 0
        ) {
          document.getElementById("dataTable").style.display = "none";
        }
      }
    });
});

// Event listener for the form submission
document.getElementById("currentIssueUploadForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the submit button element
    const submitBtn = document.getElementById("currentIssueSubmitBtn");

    const issueVersion = document.getElementById("issueVersion").value;
    const contentIssuePrice = document.getElementById("contentIssuePrice").value;

    if (!issueVersion || !contentIssuePrice || !issueTopic || !authorName || !issueTopicContent) {
      // Display an error toast if any of the fields are empty
      showToast("Error", "Please fill in all fields.", "toast-error");

      // Do not proceed with form submission
      return;
  }

    // Disable the submit button and change its text to "Uploading..."
    submitBtn.disabled = true;
    submitBtn.textContent = "Uploading...";

    try {
      // Call the function to save form data
      await saveFormData();
      document.getElementById("dataTable").style.display = "none";
      // If the function executes successfully, re-enable the submit button and change its text back to "Submit"
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
      showToast("", "Data Uploaded successfully!", "toast-success");
       document.getElementById("issueVersion").value="";
       document.getElementById("contentIssuePrice").value = "";
       const thumbnailContainer = document.getElementById("current-issue-thumbnail-container");
       thumbnailContainer.innerText = ""

    } catch (error) {
      console.error("Error:", error);

      // If there's an error, re-enable the submit button and change its text back to "Submit"
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
      showToast("Error", "An error occurred. Please try again.", "toast-error");
    }
  });

const bannerImageSubmitFormBtn = document.getElementById('bannerForm')

bannerImageSubmitFormBtn.addEventListener('submit',(e)=>{
  e.preventDefault()
  submitBannerForm()
})
function submitBannerForm() {
  const bannerThumbnailInput = document.getElementById('bannerThumbnail');
  const issueTopicBannerInput = document.getElementById('issueTopicBanner');

  // Validate form inputs (add your validation logic)

  // Check if a document is already present in Firestore
  const bannerImageCollectionRef = collection(firestore, 'bannerImage');

  // Upload image to Firebase Storage
  const storageRef = ref(storage, 'bannerImg/' + bannerThumbnailInput.files[0].name);
  const uploadTask = uploadBytes(storageRef, bannerThumbnailInput.files[0]);

  uploadTask.then((snapshot) => {
      console.log('Banner Image uploaded to Storage:', snapshot.metadata.fullPath);

      // Get the download URL of the uploaded image
      getDownloadURL(snapshot.ref).then((downloadURL) => {
          // Document data to be stored in Firestore
          const bannerImageData = {
              imageUrl: downloadURL,
              issueTopicBanner: issueTopicBannerInput.value,
          };

          // Check if a document exists in Firestore
          getDocs(bannerImageCollectionRef)
              .then((querySnapshot) => {
                  const updateOrCreate = querySnapshot.empty
                      ? addDoc(bannerImageCollectionRef, bannerImageData)
                      : updateDoc(querySnapshot.docs[0].ref, bannerImageData);

                  // Update or create document in Firestore
                  return updateOrCreate;
              })
              .then(() => {
                  console.log('Banner Image data updated/saved in Firestore.');
                  showToast("", "Image updated successfully!", "toast-success");
              })
              .catch((error) => {
                  console.error('Error updating/saving data to Firestore:', error);
                  showToast("", "Error while uploading Image", "toast-error");
              });
      });
  })
  .catch((error) => {
      console.error('Error uploading image to Storage:', error);
  });
}


