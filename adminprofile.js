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
  onSnapshot
} from "./initialize.js";

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const adminNav = document.getElementById("adminNav");
const saveChangesBtn = document.getElementById('saveChanges')

let userData = null;
let user = null;
onAuthStateChanged(auth, (user) => {
  getUserData()
  console.log("inside auth");
  if (user) {
    console.log("if");
    console.log(user);
    console.log(user.role);
    adminNav.style.display = "block";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";

    const docRef = doc(firestore, "users", user.uid);
    const docSnap = getDoc(docRef);
    docSnap.then(async (docSnapshot) => {
      if (docSnapshot.exists()) {
        userData = docSnapshot.data();
        console.log(userData.role);
        console.log(userData.email);
        document.getElementById("email").value = userData.email || '';
        document.getElementById('name').value = userData.name || '';
        document.getElementById('phone').value = userData.phone || '';
      }
    });
    getUserData()
    saveChangesBtn.addEventListener('click',()=>{
        updateProfile(user.uid)
    })
  } else {
    console.log("else");
    document.getElementById("loginBtn").style.display = "block";
    document.getElementById("logoutBtn").style.display = "none";
  }
});

logoutBtn.addEventListener("click", () => {
  alert("logout button");
  console.log("logout button clicked");
  signOut(auth)
    .then(() => {
      alert("signout successful");
      console.log("signout successful");
      window.location.href = "./login.html";
    })
    .catch((error) => {
      alert("signout error");
      console.error("Error in sign out", error);
    });
});

function getUserData(){
    onSnapshot(doc(firestore, 'users', auth.currentUser.uid), (doc) => {
        userData = doc.data();
        console.log("role name",userData.role)
            let phoneInput = document.getElementById('phone')
            let nameInput = document.getElementById('name')
            let emailInput = document.getElementById('email')
            phoneInput.value = userData.phone || ''
            nameInput.value = userData.name || ''
            emailInput.value = auth.currentUser.email || ''
    })
}

function updateProfile(uid) {
  let phoneInput = document.getElementById('phone').value;
  let nameInput = document.getElementById('name').value;
  let emailInput = document.getElementById('email').value
  const docRef = doc(firestore, 'users', uid);
  setDoc(docRef, {
    phone: phoneInput,
    name: nameInput,
    email: emailInput,
    role:"ADMIN"
  })
    .then(() => {
      console.log('Profile updated successfully');
    })
    .catch((error) => {
      console.error('Error updating profile', error);
    });
}


