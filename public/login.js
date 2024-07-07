import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, getDocs, getDoc, setDoc, doc, serverTimestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
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
        window.location.href = "../2anime/anime.html";
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
      location.reload()
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      alert(errorMessage);
    });
  });
}


let User; // store user in variable instead of using onAuthStateChanged() 
// in every function in the test object below 
onAuthStateChanged(auth, async (user) => {
  if (user) {
    User = user;
  } else {
  }
});


const test = {
  async checkIfAudioIsSaved(title, album, heartIcon) { // if the audio is stored in the database, change the img src of the heart icon to active
    if (User) {
      const audioRef = doc(database, "users", User.uid, "saved audios", `${title} ${album}`);
      const audioSnap = await getDoc(audioRef);
      if (audioSnap.exists()) {
        if (heartIcon) {
          console.log("Audio saved");
          heartIcon.src = "../00images/heart-active.png"
        }
      } else {
        console.log("Audio not saved.");
        heartIcon.src = "../00images/heart.png"
      }
    } else {
    }
  },
  async saveAudio(title, album) { // when heart icon is clicked
    if (User) {
      await setDoc(doc(database, "users", User.uid, "saved audios", `${title} ${album}`), {
        title: title,
        album: album,
        date: serverTimestamp()
      });
    } else {
      alert("you need to log in to save audios");
    }
  },
  async removeAudio(title, album) { // when heart icon is clicked
    if (User) {
      await deleteDoc(doc(database, "users", User.uid, "saved audios", `${title} ${album}`));
    } else {
    }
  },
  displayPlaylist() {
    let unsubscribe;  // Declare unsubscribe outside the function

    function displaySongs(songs) {
      const playlist = document.getElementById("playlist");  // Assuming your div has an ID or class
      playlist.innerHTML = "";  // Clear existing content before adding new songs

      songs.forEach((song) => {
        if (song.title && song.album) {
          const songDiv = document.createElement("div");
          songDiv.textContent = `${song.title} - ${song.album}`;
          playlist.appendChild(songDiv);
        }
      });
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(database, "users", user.uid);
        const savedAudios = collection(userRef, "saved audios");  // Moved declaration here

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
  },
  displayProfilePic() {
    const profilePic = document.getElementById("profilePic");
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        profilePic.src = user.reloadUserInfo.photoUrl;
      } else {
      }
    });

  }
}
export default test;






      // // addDoc
      // const docRef = await addDoc(collection(database, "users", user.uid, "saved audios"), {
      //   title: "audio title",
      //   album: "audio album"

      // });
      // console.log("Document written with ID: ", docRef.id);


      // // getDoc
      // const querySnapshot = await getDocs(collection(database, "savedAudios"));
      // querySnapshot.forEach((doc) => {
      //   console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      // });


      // onAuthStateChanged(auth, async (user) => {
      //   if (user) {

      //   } else {
      //   }
      // });

