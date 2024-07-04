// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
    apiKey: "AIzaSyC-CSH_18h-ju2i71IJi0jUvvrtqoqY0hs",
    authDomain: "detective-conan-tracklist.firebaseapp.com",
    projectId: "detective-conan-tracklist",
    storageBucket: "detective-conan-tracklist.appspot.com",
    messagingSenderId: "757169947256",
    appId: "1:757169947256:web:e0bee4495b6309bb35638d",
    measurementId: "G-Y4KQ24CL6V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);
// const firestore = getFirestore(app);

// submit
const submit = document.getElementById("submit");
submit.addEventListener("click", function (event) {
    event.preventDefault(); // prevenets the default behaviour of refreshing the page when clicked.

    // inputs
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            alert("Account Created");
            window.location.href = "../index.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
            // ..
        });
})



// socials 
const google = document.getElementById("google");
google.addEventListener("click", () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            alert("signed in with gooogle")
            window.location.href = "../index.html";

            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            alert(errorMessage);
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
})

