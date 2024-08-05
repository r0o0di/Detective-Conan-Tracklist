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

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../cache/service-worker.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, error => {
            console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
  
let User; // store user in variable instead of using onAuthStateChanged() 
// in every function in the Utilities object below 
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
  displaySavedAudios() { // goes through the saved audios in the user's database and displays them
    let unsubscribe;  // Declare unsubscribe outside the function

    function accessSavedAudios(songs) {
      const playlist = document.getElementById("playlist");  // Assuming your div has an ID or class
      playlist.innerHTML = "";  // Clear existing content before adding new songs
      console.table(songs)
      songs.forEach((song) => {
        if (song.title && song.album) {
          const songDiv = document.createElement("div");
          songDiv.id = "audio";
          songDiv.textContent = `${song.title} - ${song.album}`;
          Utilities.generateSavedAudios(song.timeOrNum, song.jpnTitle, song.rmjTitle, song.title, song.album);
        }
      });
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(database, "users", user.uid);
        const savedAudios = collection(userRef, "saved audios");

        unsubscribe = onSnapshot(savedAudios, (querySnapshot) => {
          const songs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          accessSavedAudios(songs);
        });
      } else {
        unsubscribe();  // Call unsubscribe to detach the listener
        unsubscribe = null;  // Reset unsubscribe for next login

      }
    });
  },
  generateSavedAudios(timeOrNum, jpnTitle, rmjTitle, title, album) {
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
                <a href="../index.html"><img src="../00images/${homeIconImgSrc}.png" alt="home" class="nav-home noSelect"></a>
                <a href="../savedAudios/savedAudios.html"><img src="../00images/${heartIconImgSrc}.png" alt="saved audios" class="nav-heart noSelect"></a>
            </div>         
`;
    navElement.insertAdjacentHTML("afterbegin", nav);
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
  filterTitle(title) {
    title = title.replace("♥", "").replace("☆", "_").replace("...", "").replace(/-/gi, "_").replace(/ /gi, "_").replace(".", "").replace("(", "").replace(")", "").replace("(", "").replace(")", "").replace("!", "").replace("?", "").replace(/'/gi, "").replace("&", "and").replace(/:/gi, "").replace(/~/gi, "").replace(/～/gi, "").replace(/,/gi, "_").replace(/・/gi, "_").replace("/", "_").replace("/", "_").replace("/", "_").replace("__", "_").replace("__", "_").replace("__", "_").replace("__", "_").replace("__", "_").replace("__", "_");
    return title;
  },
  filterAlbum(album) {


    album = album
        .replace("♥", "")
        .replace("☆", "_")
        .replace("...", "")
        .replace(/-/gi, "_")
        .replace(/ /gi, "_").replace(".", "").replace("(", "").replace(")", "").replace("!", "").replace("?", "").replace(/'/gi, "").replace("&", "and").replace(":", "").replace(/~/gi, "").replace(/～/gi, "").replace(/,/gi, "_").replace("・", "_").replace("__", "_").replace("__", "_")
        .replace("Detective_Conan_Original_Soundtrack_1", "OST1")
        .replace("Detective_Conan_Original_Soundtrack_2", "OST2")
        .replace("Detective_Conan_Original_Soundtrack_3", "OST3")
        .replace("Detective_Conan_Original_Soundtrack_4_Isoge_Shōnen_Tanteidan", "OST4")
        .replace("Detective_Conan_Original_Soundtrack_Super_Best", "super_best")
        .replace("Detective_Conan_Original_Soundtrack_Super_Best_2", "super_best_2")

        /*movie OSTs*/
        .replace("Detective_Conan_The_Time_Bombed_Skyscraper_Original_Soundtrack", "movie1")
        .replace("Detective_Conan_The_Fourteenth_Target_Original_Soundtrack", "movie2")
        .replace("Detective_Conan_The_Last_Wizard_of_the_Century_Original_Soundtrack", "movie3")
        .replace("Detective_Conan_Captured_in_Her_Eyes_Original_Soundtrack", "movie4")
        .replace("Detective_Conan_Countdown_to_Heaven_Original_Soundtrack", "movie5")
        .replace("Detective_Conan_The_Phantom_of_Baker_Street_Original_Soundtrack", "movie6")
        .replace("Detective_Conan_Crossroad_in_the_Ancient_Capital_Original_Soundtrack", "movie7")
        .replace("Detective_Conan_Magician_of_the_Silver_Sky_Original_Soundtrack", "movie8")
        .replace("Detective_Conan_Strategy_Above_the_Depths_Original_Soundtrack", "movie9")
        .replace("Detective_Conan_The_Private_Eyes_Requiem_Original_Soundtrack", "movie10")
        .replace("Detective_Conan_Jolly_Roger_in_the_Deep_Azure_Original_Soundtrack", "movie11")
        .replace("Detective_Conan_Full_Score_of_Fear_Original_Soundtrack", "movie12")
        .replace("Detective_Conan_The_Raven_Chaser_Original_Soundtrack", "movie13")
        .replace("Detective_Conan_The_Lost_Ship_in_the_Sky_Original_Soundtrack", "movie14")
        .replace("Detective_Conan_Quarter_of_Silence_Original_Soundtrack", "movie15")
        .replace("Detective_Conan_The_Eleventh_Striker_Original_Soundtrack", "movie16")
        .replace("Detective_Conan_Private_Eye_in_the_Distant_Sea_Original_Soundtrack", "movie17")
        .replace("Detective_Conan_Dimensional_Sniper_Original_Soundtrack", "movie18")
        .replace("Detective_Conan_Sunflowers_of_Inferno_Original_Soundtrack", "movie19");


            /*openings*/            album = album.replace(/(?:Mune_ga_Dokidoki|Feel_Your_Heart|Nazo|Unmei_no_Roulette_Mawashite|TRUTH_A_Great_Detective_of_Love|Girigiri_chop|Mysterious_Eyes|Koi_wa_Thrill_Shock_Suspense|destiny|Winter_Bells|I_cant_stop_my_love_for_you|Kaze_no_Lalala|Kimi_to_Yakusoku_Shita_Yasashii_Ano_Basho_Made|START|Hoshi_no_Kagayaki_yo|Growing_of_my_heart|Shōdō)/gi, "openings");
            /*endings*/             album = album.replace(/(?:STEP_BY_STEP|Meikyū_no_Lovers|Hikari_to_Kage_no_Roman|Kimi_ga_Inai_Natsu|Negai_Goto_Hitotsu_Dake|Kōri_no_Ue_ni_Tatsu_Yō_ni|Still_for_your_love|Free_Magic|Secret_of_my_heart|Natsu_no_Maboroshi|Start_in_my_life|always|Aoi_Aoi_Kono_Hoshi_ni|Yume_Mita_Ato_de|Mushoku|Overture|Ashita_o_Yume_Mite|Kimi_to_Iu_Hikari|Nemuru_Kimi_no_Yokogao_ni_Hohoemi_o|Wasurezaki|June_Bride_Anata_Shika_Mienai|Sekai_Tomete|Thank_You_For_Everything|Kanashii_Hodo_Anata_ga_Suki)/gi, "endings");
            /*image song albums*/   album = album.replace(/(?:Boku_ga_Iru_TV_Anime_Detective_Conan_Image_Song_Album|Detective_Conan_Character_Song_Collection_Teitan_Shougakkou_ni_Zenin_Shuugou)/gi, "image_song_albums");
            /*other*/               album = album.replace(/(?:Happy_End|Utakata_no_Yume|↑THE_HIGH_LOWS↓|Dont_Stop_Dreaming|Kimi_ga_Ireba|LIVING_DAYLIGHTS|Haru_yo_Koi)/gi, "other");

    return album
  },
  async cacheSiteFiles() {
    if ('caches' in window) {
      try {
        const cache = await caches.open('site');
        const filesToCache = [
          '../1soundtracks/0data/soundtracks-data.js',
          '../1soundtracks/1soundtracks.html',
          '../1soundtracks/search.js',
          '../1soundtracks/soundtracks.js',
          '../2anime/0data/dc-all-bgm-data.js',
          '../2anime/anime.css',
          '../2anime/anime.html',
          '../2anime/anime.js',
          '../2anime/audio.css',
          '../2anime/audio.js',
          '../2anime/search.css',
          '../2anime/search.js',
          '../2anime/table.css',
          '../2anime/table.js',
          '../savedAudios/savedAudios.html',
          '../utilities/utils.js',
          '../index.html',
          '../nav.css',
          '../style.css',
          'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js',
          'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js',
          'https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js',
          'https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js',
          'https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.min.js'
        ];
  
        for (const file of filesToCache) {
          const response = await caches.match(file);
          if (!response) {
            await cache.add(file);
            console.log(`successfully cached ${file}`);
          } else {
            console.log(`${file} is already cached`);
          }
        }
      } catch (error) {
        console.error('Failed to cache files:', error);
      }
    }
  },
  async cacheImages() {
    if ('caches' in window) {
      try {
        const cache = await caches.open('images');
        const imagesToCache = [
          '../00images/anime.jpg',
          '../00images/download-active.png',
          '../00images/download.png',
          '../00images/endings.jpg',
          '../00images/heart-active.png',
          '../00images/heart.png',
          '../00images/home-active.png',
          '../00images/home.png',
          '../00images/icon.png',
          '../00images/openings.jpg',
          '../00images/OST1.png',
          '../00images/ova.jpg',
          '../00images/pause.png',
          '../00images/play.png',
          '../00images/short_stories.jpg'
        ];
  
        for (const image of imagesToCache) {
          const response = await caches.match(image);
          if (!response) {
            await cache.add(image);
            console.log(`successfully cached ${image}`);
          } else {
            console.log(`${image} is already cached`);
          }
        }
      } catch (error) {
        console.error('Failed to cache images:', error);
      }
    }
  },
  async cacheAudio(audioUrl) {
    if ('caches' in window) {
      try {
        const cache = await caches.open('audios');
        const response = await caches.match(audioUrl);
        if (!response) {
          await cache.add(audioUrl);
          console.log('successfully cached', audioUrl);
        } else {
          console.log(audioUrl, 'is already cached');
        }
      } catch (error) {
        console.error('Failed to cache audio file:', error);
      }
    }
  }
  

}
export default Utilities;








// USE THEESE 3 FUNCTIONS BELOW TO DO THE SAME AS THE Utilities.saveAudio(), but with the
// ADDITION TO ALSO UPLOADING THE MP3 FILE TO THE FIREBASE STORAGE. 
// WHEN USING THESE FUNCTIONS, REMOVE THE ALREADY EXISTING Utilities.saveAudio()

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
