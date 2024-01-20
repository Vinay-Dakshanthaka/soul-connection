import {
    auth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    app,
    signOut,
    doc,
    firestore,
    getDoc,
    getDocs,
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

  function displayLoader() {
    const loaderContainer = document.getElementById('loader-container');
    loaderContainer.style.display = 'block'; // Show the loader
  }
  function hideLoader() {
    const loaderContainer = document.getElementById('loader-container');
    loaderContainer.style.display = 'none'; // Show the loader
  }
  const pdfCardsContainer = document.getElementById("pdfCardsContainer");

  const pdfContentsCollection = collection(firestore, 'pdfContents');
const querySnapshot = await getDocs(pdfContentsCollection);

querySnapshot.forEach((doc) => {
  
  const pdfData = doc.data();
  createPdfCard(pdfData);
  hideLoader()
});

// Function to create a card and append it to the container
function createPdfCard(pdfData) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("col-lg-6", "col-md-6", "col-12", "mb-4", "mb-lg-4");

  const customBlockFlex = document.createElement("div");
  customBlockFlex.classList.add("custom-block-flex", "d-flex", "h-100", "w-100");

  // Left side of the card with thumbnail
  const issueImg = document.createElement("div");
  issueImg.classList.add("issue_img", "w-50", "my-auto");
  const thumbnailCard = document.createElement("div");
  thumbnailCard.classList.add("card", "card-body");
  const thumbnailImg = document.createElement("img");
  thumbnailImg.src = pdfData.thumbnailUrl; 
  thumbnailImg.classList.add("custom-block-image");
  thumbnailCard.appendChild(thumbnailImg);
  issueImg.appendChild(thumbnailCard);

  // Right side of the card with text content
  const customBlock = document.createElement("div");
  customBlock.classList.add("custom-block", "w-50");
  const customBlockBody = document.createElement("div");
  customBlockBody.classList.add("custom-block-body");

  // Displaying PDF content and price
  const currentIssueText = document.createElement("div");
  currentIssueText.classList.add("current-issue-text");
  const h5 = document.createElement("h5");
  h5.classList.add("mb-3");
  h5.textContent = pdfData.content; 
  const p = document.createElement("p");
  p.textContent = `₹${pdfData.issuePrice}`; 
  currentIssueText.appendChild(h5);
  currentIssueText.appendChild(p);

  // View more button
  const currentBtns = document.createElement("div");
currentBtns.classList.add("current-btns", "d-flex");

const viewMoreBtn = document.createElement("a");
viewMoreBtn.href = pdfData.pdfUrl; 
viewMoreBtn.classList.add("current-btn", "btn");
viewMoreBtn.textContent = "Download"; 
viewMoreBtn.download = pdfData.pdfUrl; 
currentBtns.appendChild(viewMoreBtn);

  customBlockBody.appendChild(currentIssueText);
  customBlockBody.appendChild(currentBtns);
  customBlock.appendChild(customBlockBody);

  // Assembling the card
  customBlockFlex.appendChild(issueImg);
  customBlockFlex.appendChild(customBlock);
  cardContainer.appendChild(customBlockFlex);

  // Append the card to the container
  pdfCardsContainer.appendChild(cardContainer);
}


async function fetchDataAndRenderCards() {
    const pdfContentsCollection = collection(firestore, 'pdfContents');
    const querySnapshot = await getDocs(pdfContentsCollection);
  
    querySnapshot.forEach((doc) => {
      const pdfData = doc.data();
      createPdfCard(pdfData);
    });
  }
  
//   fetchDataAndRenderCards();
  

  