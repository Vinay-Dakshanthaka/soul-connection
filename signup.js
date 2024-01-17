import { auth,createUserWithEmailAndPassword,collection,doc, firestore, getDoc,setDoc } from "./initialize"



const signUpFormBtn = document.getElementById('signUpForm')

signUpFormBtn.addEventListener('submit', async (e)=>{
    e.preventDefault()
    let nameInput = document.getElementById('name')
    let emailInput = document.getElementById('email')
    let phoneInput = document.getElementById('phone')
    let passwordInput = document.getElementById('password')

    try{
        const userCredential = await createUserWithEmailAndPassword(auth, emailInput, passwordInput)
        const user = userCredential.user
        const uid = user.uid
        console.log(uid)

        const userRef = collection(firestore,'users')
        const userDocRef = doc(userRef,uid)

        const userSanpshot = await getDoc(userDocRef)

        if(userSanpshot.empty){
            await setDoc(userDocRef,{
                name:nameInput,
                email:emailInput,
                phone : phoneInput
            })
        }else{
            await setDoc(userDocRef,{
                name:nameInput,
                email:emailInput,
                phone : phoneInput
            })
        }

    }catch(error){
        console.log('error in create accoung', error)
    }

})