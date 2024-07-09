import FromDatabase from "../public/login.js";
FromDatabase.displayPlaylist();
FromDatabase.displayProfilePic();

import { navigation } from "../saved audios/utils.js";


const navContainer = document.querySelector(".container");
navigation(navContainer, "home", "heart-active");
