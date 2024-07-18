import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, getDocs, getDoc, setDoc, doc, serverTimestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";;




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
const storage = getStorage(app);



const logInBtn = document.getElementById("logIn");
const logOutBtn = document.getElementById("logOut");

  logInBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        // console.log(user.reloadUserInfo)
        // IdP data available using getAdditionalUserInfo(result)
        if (user) {
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


let User; // store user in variable instead of using onAuthStateChanged() 
// in every function in the FromDatabase object below 
onAuthStateChanged(auth, async (user) => {
  if (user) {
    User = user;
      logInBtn.style.display = "none";
      logOutBtn.style.display = "block";
  } else {
      logInBtn.style.display = "block";
      logOutBtn.style.display = "none";
  }
});


const Utilities = {
  async saveAudio(title, album, heartIcon, timeOrNum, jpnTitle, rmjTitle) { // when heart icon is clicked
    if (User) {
      await setDoc(doc(database, "users", User.uid, "saved audios", `${title} ${album}`), {
        timeOrNum: timeOrNum,
        jpnTitle: jpnTitle,
        rmjTitle: rmjTitle,
        title: title,
        album: album,
        date: serverTimestamp()
      });
    } else {
      alert("you need to log in to save audios");
      heartIcon.src = "../00images/heart.png";
    }
  },
  async removeAudio(title, album) { // when heart icon is clicked again
    if (User) {
      await deleteDoc(doc(database, "users", User.uid, "saved audios", `${title} ${album}`));
    } else {
    }
  },
  async checkIfAudioIsSaved(title, album, heartIcon) { // if the audio is stored in the database, change the img src of the heart icon to active
    if (User) {
      const audioRef = doc(database, "users", User.uid, "saved audios", `${title} ${album}`);
      const audioSnap = await getDoc(audioRef);
      if (audioSnap.exists()) {
        if (heartIcon) {
          heartIcon.src = "../00images/heart-active.png"
        }
      } else {
        heartIcon.src = "../00images/heart.png"
      }
    } else {
    }
  },
  displayPlaylist() { // goes through the saved audios in the user's database and displays them
    let unsubscribe;  // Declare unsubscribe outside the function

    function displaySongs(songs) {
      const playlist = document.getElementById("playlist");  // Assuming your div has an ID or class
      playlist.innerHTML = "";  // Clear existing content before adding new songs
      console.table(songs)
      songs.forEach((song) => {
        if (song.title && song.album) {
          const songDiv = document.createElement("div");
          songDiv.id = "audio";
          songDiv.textContent = `${song.title} - ${song.album}`;
          Utilities.stylePlaylist(song.timeOrNum, song.jpnTitle, song.rmjTitle, song.title, song.album);
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
      if (user && profilePic) {
        profilePic.src = user.reloadUserInfo.photoUrl;
      } else {
      }
    });

  },
  stylePlaylist(timeOrNum, jpnTitle, rmjTitle, title, album) {
    const playlist = document.getElementById("playlist");
    const audio = `
        <tr>
            <td></td>
            <td>${jpnTitle}</td>
            <td>${rmjTitle}</td>
            <td>${title}</td>
            <td>${album}</td>
        </tr>
    `;
    playlist.insertAdjacentHTML("beforeend", audio);
  },
  navigation(navElement, homeIconImgSrc, heartIconImgSrc) {
    const nav = `
            <div class="home-saved-container">
                <a href="../index.html"><img src="../00images/${homeIconImgSrc}.png" alt="home" class="nav-home"></a>
                <a href="../savedAudios/savedAudios.html"><img src="../00images/${heartIconImgSrc}.png" alt="saved audios" class="nav-heart"></a>
            </div>         
`;
    navElement.insertAdjacentHTML("afterbegin", nav);
  }

}
export default Utilities;












// USE THEESE 3 FUNCTIONS BELOW TO DO THE SAME AS THE FromDatabase.saveAudio(), 
// IN ADDITION TO ALSO UPLOADING THE MP3 FILE TO THE FIREBASE STORAGE. 
// WHEN USING THESE FUNCTIONS, REMOVE THE ALREADY EXISTING FromDatabase.saveAudio()

// async uploadAudio(blobOrFile, title, album) {
//   const storageRef = ref(storage, `audios/${User.uid}/${album}/${title}.mp3`);
    
//   try {
//     const snapshot = await uploadBytes(storageRef, blobOrFile);
//     const downloadURL = await getDownloadURL(snapshot.ref);
//     return downloadURL;
//   } catch (error) {
//     console.error("Error uploading audio file:", error);
//     throw error;
//   }
// },
// async fetchAndSaveAudio(url, unchangedTitle, unchangedAlbum, title, album, heartIcon, timeOrNum, jpnTitle, rmjTitle) {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch audio file: ${response.statusText}`);
//     }
//     const blob = await response.blob();
//     this.saveAudio(unchangedTitle, unchangedAlbum, title, album, heartIcon, timeOrNum, jpnTitle, rmjTitle, blob);
//   } catch (error) {
//     console.error("Error fetching and saving audio:", error);
//     alert("An error occurred while fetching and saving the audio.");
//     heartIcon.src = "../00images/heart.png";
//   }
// },
// async saveAudio(unchangedTitle, unchangedAlbum, title, album, heartIcon, timeOrNum, jpnTitle, rmjTitle, blobOrFile) {
//   if (User) {
//     try {
//       const downloadURL = await this.uploadAudio(blobOrFile, title, album);
    
//       await setDoc(doc(database, "users", User.uid, "saved audios", `${unchangedTitle} ${unchangedAlbum}`), {
//         timeOrNum: timeOrNum,
//         jpnTitle: jpnTitle,
//         rmjTitle: rmjTitle,
//         title: unchangedTitle,
//         album: unchangedAlbum,
//         downloadURL: downloadURL,
//         date: serverTimestamp()
//       });
//     } catch (error) {
//       console.error("Error saving audio:", error);
//       alert("An error occurred while saving the audio.");
//       heartIcon.src = "../00images/heart.png";
//     }
//   } else {
//     alert("You need to log in to save audios");
//     heartIcon.src = "../00images/heart.png";
//   }
// }      









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
