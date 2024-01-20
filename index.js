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

hideLoader()

function hideLoader() {
    document.querySelector(".loader").style.display = "none";
}

const latestIssuesContainer = document.getElementById("latestIssues");

async function fetchDataAndRenderCards() {
  
  try {
    const issuesCollection = collection(firestore, 'issues');
    const querySnapshot = await getDocs(issuesCollection);

    querySnapshot.forEach((doc) => {
      const issueData = doc.data();
      createIssueCard(issueData);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
   
  }
}

// Call the function to fetch data and render cards
fetchDataAndRenderCards();


function createIssueCard(issueData) {
  // Create a new card element
  const card = document.createElement("div");
  card.className = "col-lg-3 col-md-6 col-12 my-4 mb-lg-0";
  card.innerHTML = `
    <div class="custom-block-wrap">
        <img src="${issueData.thumbnailUrl}" style="height:280px;object-position: top;" class="custom-block-image img-fluid" alt="">
        <div class="custom-block">
            <div class="custom-block-body">
                <h5 class="mb-3">${issueData.issueVersion}</h5>
                <div class="progress mt-4">
                    <div class="progress-bar w-100" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <div class="d-flex align-items-center justify-content-center my-2">
                    <p class="mb-0">
                        <strong>Price:</strong>
                        ₹ ${issueData.contentIssuePrice}/-
                    </p>
                </div>
            </div>
            <a href="buynow.html" class="custom-btn btn">Buy now</a>
        </div>
    </div>
  `;
  // Append the card to your container
  latestIssuesContainer.appendChild(card);
}

async function fetchDataAndDisplay() {
    const issuesCollection = collection(firestore, 'issues');
    const querySnapshot = await getDocs(issuesCollection);

    const tableBody = document.getElementById('tableBody');
    let slNo = 1;

    querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Check if the expected properties are present and contentIssueArray is an array
        if (data && Array.isArray(data.contentIssuesArray)) {
            data.contentIssuesArray.forEach((issue, index) => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${slNo}</td>
                    <td>${issue.issueTopic}</td>
                    <td>${issue.authorName}</td>
                    <td><button class="buy-now-button" data-index="${index}">Buy to Read</button></td>
                `;
                tableBody.appendChild(newRow);
                slNo++;
            });
        } else {
            console.error('Data structure is not as expected:', data);
        }
    });
}

// Call the function to fetch and display data
fetchDataAndDisplay();


const bannerImageCollectionRef = collection(firestore, "bannerImage");

// Fetch all documents in the collection
getDocs(bannerImageCollectionRef)
    .then((querySnapshot) => {
        // Check if there are any documents in the collection
        if (!querySnapshot.empty) {
            // Get the first document in the collection
            const firstDocument = querySnapshot.docs[0];
            
            // Get image URL and text from the document
            const imageUrl = firstDocument.data().imageUrl;
            const issueTopicBanner = firstDocument.data().issueTopicBanner;

            // Update HTML content with fetched data
            document.getElementById("bannerImage").src = imageUrl;
            document.getElementById("bannerText").textContent = issueTopicBanner;
        } else {
            console.log("No documents in the collection!");
        }
    })
    .catch((error) => {
        console.log("Error getting documents:", error);
    });