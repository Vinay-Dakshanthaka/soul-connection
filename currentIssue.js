import {
    app,
    firestore,
    auth,
    getAuth,
    getFirestore,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword,
    collection,
    doc,
    getDoc,
    setDoc,
    onSnapshot,
    getStorage,
    ref,
    storage,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    updateDoc,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    getDocs,
    uploadString,
    addDoc
} from "./initialize.js";

const cureentIssueContainer = document.getElementById("cureentIssueContainer");

const issuesCollection = collection(firestore, 'issues');
const querySnapshot = await getDocs(issuesCollection);

const issueCard = document.querySelector('.issueCard')

querySnapshot.forEach((doc) => {
const issueData = doc.data();
createIssueCard(issueData);
});

// Function to create a card and append it to the container
function createIssueCard(issueData) {
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
thumbnailImg.src = issueData.thumbnailUrl; 
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
h5.textContent = `${issueData.issueVersion}`; 
const p = document.createElement("p");
p.textContent = `₹ ${issueData.contentIssuePrice}`; 
currentIssueText.appendChild(h5);
currentIssueText.appendChild(p);

// View more button
const currentBtns = document.createElement("div");
currentBtns.classList.add("current-btns", "d-flex");


const viewMoreBtn = document.createElement("a");
viewMoreBtn.href = `issue-item.html?issueId=${issueData}`;
viewMoreBtn.classList.add("current-btn", "btn");
viewMoreBtn.textContent = "View More";
currentBtns.appendChild(viewMoreBtn);

viewMoreBtn.addEventListener("click", () => {
  // Redirect to info-item.html with the corresponding issueData id
  localStorage.setItem("issueData", JSON.stringify(issueData));
  window.location.href = `issue-item.html?issueId=${issueData}`;
});





customBlockBody.appendChild(currentIssueText);
customBlockBody.appendChild(currentBtns);
customBlock.appendChild(customBlockBody);

// Assembling the card
customBlockFlex.appendChild(issueImg);
customBlockFlex.appendChild(customBlock);
cardContainer.appendChild(customBlockFlex);

// Append the card to the container
cureentIssueContainer.appendChild(cardContainer);
}


async function fetchDataAndRenderCards() {
  const issuesCollection = collection(firestore, 'issues');
  const querySnapshot = await getDocs(issuesCollection);

  querySnapshot.forEach((doc) => {
    const issueData = doc.data();
    createIssueCard(issueData);
  });
}

