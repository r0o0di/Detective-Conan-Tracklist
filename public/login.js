import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, setDoc, doc, serverTimestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";

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
const database = getFirestore(app);



const googleBtn = document.getElementById("google");
if (googleBtn) {

  googleBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

        console.log(user.reloadUserInfo)
        // IdP data available using getAdditionalUserInfo(result)
        window.location.href = "../index.html";
        if (user) {
          const profilePic = document.getElementById("profilePic");
          profilePic.src = user.reloadUserInfo.photoUrl;
          // Show other user-specific content here
        }
        // ...
      }).catch((error) => {
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
}



const logOutBtn = document.getElementById("logOut");
if (logOutBtn) {

  logOutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      console.log("signed out");
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      alert(errorMessage);
    });
  });
}




export function test() {
  const profilePic = document.getElementById("profilePic");
  let unsubscribe;  // Declare unsubscribe outside the function

  function displaySongs(songs) {
    const playlist = document.getElementById("playlist");  // Assuming your div has an ID or class
    playlist.innerHTML = "";  // Clear existing content before adding new songs

    songs.forEach((song) => {
      const songDiv = document.createElement("div");
      songDiv.textContent = `${song.title} - ${song.album}`;
      playlist.appendChild(songDiv);
    });
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      profilePic.src = user.reloadUserInfo.photoUrl;
      const userRef = doc(database, "users", user.uid);
      const savedAudios = collection(userRef, "savedAudios");  // Moved declaration here

      unsubscribe = onSnapshot(savedAudios, (querySnapshot) => {
        const songs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        displaySongs(songs);
      });
    } else {
        unsubscribe();  // Call unsubscribe to detach the listener
        unsubscribe = null;  // Reset unsubscribe for next login
      
    }
  });
}







