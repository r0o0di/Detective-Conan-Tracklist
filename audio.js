import FromDatabase from "../public/login.js";
FromDatabase.displayProfilePic();





const tbodys = document.querySelectorAll('tbody');
let clickedRow = null;
let audioElement = null;


if (tbodys) {
    tbodys.forEach(tbody => {
        tbody.addEventListener('click', (event) => {
            // Check if the clicked element is a table row
            const row = event.target.closest('tr');
            if (row) {
                handleRowClick(row);
            }
        });
    })
}


export function handleRowClick(newClickedRow) {


    const timeOrNum = newClickedRow.querySelectorAll('td')[0].textContent.trim();
    const jpnTitle = newClickedRow.querySelectorAll('td')[1].textContent.trim();
    const rmjTitle = newClickedRow.querySelectorAll('td')[2].textContent.trim();
    let title = newClickedRow.querySelectorAll('td')[3].textContent.trim();
    const unchangedTitle = title;
    title = filterTitle(title);

    let album = newClickedRow.querySelectorAll('td')[4].textContent.trim();
    const currentTable = newClickedRow.closest("table");
    let caption = currentTable.querySelector("caption").textContent.trim();
    const firstChar = caption.charAt(0);
    let unchangedAlbum;
    if (isNaN(firstChar) && caption !== "Saved Audios") {
        unchangedAlbum = caption;
        album = filterAlbum(caption);
    } else {
        unchangedAlbum = album;
        album = filterAlbum(album);
    }

    if (album === "Unreleased" || !album || !title) {
        navigator.vibrate(100);
        return;
    }

    newClickedRow.id = "clicked-row";

    if (clickedRow && clickedRow !== newClickedRow) {
        clickedRow.removeAttribute("id");
    }

    if (clickedRow === newClickedRow) {
        newClickedRow.removeAttribute("id");

        if (audioElement) {
            audioElement.parentNode.parentNode.parentNode.removeChild(audioElement.parentNode.parentNode);
            audioElement = null;
        }
        clickedRow = null;
    } else {
        if (audioElement) {
            audioElement.parentNode.parentNode.parentNode.removeChild(audioElement.parentNode.parentNode);
        }

        clickedRow = newClickedRow;

        // getting the audio files from github is slower. only do it when theres not other choice
        // const audioSrc = `https://github.com/r0o0di/Detective-Conan-Tracklist/raw/main/0tracks/${album}/${title}.mp3`;
        const audioSrc = `../0tracks/${album}/${title}.mp3`;
        console.log(audioSrc);

        const audioPlayerHTML = `
                    <div class="audio-player-row">
                       <!-- <div class="hr-container">
                            <hr id="hr">
                        </div>
                        -->
                        <div id="error-container"></div>
                        <div class="audio-player-container">
                            <audio autoplay preload="metadata">
                                <source src="${audioSrc}" type="audio/mpeg">
                            </audio>
                            <div id="audio-info">
                                <div class="title-album-container">
                                    <span id="title">${unchangedTitle}</span>
                                    <span id="album">${unchangedAlbum}</span>
                                </div>
                            </div>
                            <div class="custom-controls">
                                <div class="loading-animation-container">
                                    <div class="loading-animation"></div>
                                </div>
                                <img src="../00images/pause.png" class="play-pause-icon noSelect" alt="pause/play">              
                                <img src="../00images/heart.png" class="heart-icon noSelect" alt="add">
                                <img src="../00images/download.png" class="download-icon noSelect" alt="download">
                            </div>
                            <div class="bar-container">
                                <div class="bar"></div>
                                <input type="range" class="seek-slider noSelect" min="0" max="100" step="0.01" value="0">
                                <span class="tooltip">00:00</span>
                                <div id="time">
                                    <span class="timestamp">0:00</span>    
                                    <span class="total-time">0:00</span>  
                                </div>
                            </div>
                        </div>
                    </div>
                `;

        const episodesList = document.querySelector(".episodes-list");
        if (episodesList) {
            episodesList.insertAdjacentHTML('beforebegin', audioPlayerHTML);
        }

        audioElement = document.querySelector('audio');



        const audioRow = document.querySelector('.audio-player-row');
        const downloadIcons = document.querySelectorAll(".download-icon");
        const loadingAnimationContainer = document.querySelector('.loading-animation-container');
        const errorContainer = document.getElementById("error-container");
        const audioContainer = document.querySelector('.audio-player-container');
        const sourceElement = document.querySelector('source');
        const heartIcon = document.querySelector(".heart-icon");
        const playPauseBtn = document.querySelector('.play-pause-icon');
        const seekSlider = document.querySelector('.seek-slider');
        const titleAlbumContainer = document.querySelector(".title-album-container");
        const bar = document.querySelector(".bar");
        const time = document.getElementById("time");

        mediaMetadata(audioElement, album, unchangedAlbum, unchangedTitle, playPauseBtn)




        seekSlider.addEventListener("mousedown", () => {
            time.style.display = "flex";

        })
        seekSlider.addEventListener("mouseup", () => {
            time.style.display = "none";

        })

        // albumElement.addEventListener("click", () => {
        //     unchangedAlbum = unchangedAlbum.replace(/ /gi, "_");
        //     window.location.href = `../1soundtracks/1soundtracks.html#${unchangedAlbum}`
        // })


        // while the audio is loading, display a loading animation
        audioElement.addEventListener('loadstart', () => {
            // normally, at the start of an audio playing, there is a bug which sets the width of those bars to 50% (or sometimes 100%) for a split second.
            // setting the width to 0 fixes the issue
            bar.style.width = "0px";
            audioContainer.style.display = "block";
            playPauseBtn.style.display = "none";
        });

        // as soon as it starts playing, remove the loading animation and display the audio controls
        audioElement.addEventListener('playing', () => {
            loadingAnimationContainer.style.display = 'none';
            playPauseBtn.style.display = "block";


        });

        // download audio when clicked
        // iterate over each downloadIcon
        downloadIcons.forEach(downloadIcon => {
            downloadIcon.addEventListener("click", () => {
                const fileName = `${title}.mp3`;
                const downloadLink = document.createElement("a");
                downloadLink.href = audioSrc;
                downloadLink.download = fileName;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                downloadIcon.src = "../00images/download-active.png";
            });
        });

        // if the audio can't be played, display an error
        sourceElement.addEventListener('error', () => {
            audioContainer.style.display = "none";

            const errorMessage = document.createElement('h2');
            errorMessage.innerHTML = `Audio couldn't be played. <button>Report</button>`;
            errorMessage.classList.add('error-message');

            errorContainer.append(errorMessage);
            audioRow.classList.add("audio-player-row-error");
        });


        FromDatabase.checkIfAudioIsSaved(unchangedTitle, unchangedAlbum, heartIcon);
        heartIcon.addEventListener("click", () => {
            const notActive = "../00images/heart.png";
            const active = "../00images/heart-active.png";
            if (heartIcon.src.endsWith("heart.png")) {
                heartIcon.src = active;
                FromDatabase.saveAudio(unchangedTitle, unchangedAlbum, heartIcon, timeOrNum, jpnTitle, rmjTitle);
                // use the below function to do the same as saveAudio(), in addition to also uploading the audio file to firebase storage
                // FromDatabase.fetchAndSaveAudio(`../0tracks/${album}/${title}.mp3`, unchangedTitle, unchangedAlbum, title, album, heartIcon, timeOrNum, jpnTitle, rmjTitle);
            } else {
                heartIcon.src = notActive;
                FromDatabase.removeAudio(unchangedTitle, unchangedAlbum);
            }
        });

        // play-pause the audio when the icons are clicked
        playPauseBtn.addEventListener('click', () => {
            if (audioElement.paused) {
                audioElement.play();
                playPauseBtn.src = "../00images/pause.png";
            } else {
                audioElement.pause();
                playPauseBtn.src = "../00images/play.png";
            }
        });


        // also play-pause the audio, but when the space bar is pressed
        document.addEventListener('keydown', (event) => {
            if (event.key === ' ') {
                if (audioElement) {
                    if (audioElement.paused) {
                        audioElement.play();
                        playPauseBtn.src = "../00images/pause.png";
                    } else {
                        audioElement.pause();
                        playPauseBtn.src = "../00images/play.png";
                    }
                }
                event.preventDefault(); // prevents the default behaviour of scrolling
            }
        });

        // go to next song when audio finishes
        audioElement.addEventListener('ended', () => playNextSong());

        audioElement.addEventListener('timeupdate', () => {
            updateTimestamp(audioElement.currentTime, audioElement.duration);
            updateSeekSlider(audioElement.currentTime, audioElement.duration);
        });

        seekSlider.addEventListener('input', () => {
            const seekTo = audioElement.duration * (seekSlider.value / 100);
            audioElement.currentTime = seekTo;
            playPauseBtn.src = "../00images/pause.png";
        });

        seekSlider.addEventListener('mousedown', () => {
            audioElement.pause();
        });

        seekSlider.addEventListener('touchstart', () => {
            audioElement.pause();
        });

        seekSlider.addEventListener('mouseup', () => {
            audioElement.play();
        });

        seekSlider.addEventListener('touchend', () => {
            audioElement.play();
        });


        let startX = 0;
        let endX = 0;
        let isSwiping = false;

        titleAlbumContainer.addEventListener('touchstart', e => {
            startX = e.changedTouches[0].screenX;
            isSwiping = true;
        });

        titleAlbumContainer.addEventListener('touchmove', e => {
            if (isSwiping) {
                const currentX = e.changedTouches[0].screenX;
                const deltaX = currentX - startX;
                const opacity = Math.max(1 - Math.abs(deltaX) / 100, 0);
                titleAlbumContainer.style.transform = `translateX(${deltaX / 2}px)`;
                titleAlbumContainer.style.opacity = opacity;
            }
        });

        titleAlbumContainer.addEventListener('touchend', e => {
            isSwiping = false;
            const deltaX = e.changedTouches[0].screenX - startX;
            titleAlbumContainer.style.transform = '';
            titleAlbumContainer.style.opacity = '';
            swipe(deltaX, titleAlbumContainer);
        });


        titleAlbumContainer.addEventListener('mousedown', e => {
            startX = e.clientX;
            isSwiping = true;
        });

        titleAlbumContainer.addEventListener('mousemove', e => {
            if (isSwiping) {
                const currentX = e.clientX;
                const deltaX = currentX - startX;
                const opacity = Math.max(1 - Math.abs(deltaX) / 100, 0);
                titleAlbumContainer.style.transform = `translateX(${deltaX / 2}px)`;
                titleAlbumContainer.style.opacity = opacity;
            }
        });

        titleAlbumContainer.addEventListener('mouseup', e => {
            isSwiping = false;
            const deltaX = e.clientX - startX;
            titleAlbumContainer.style.transform = '';
            titleAlbumContainer.style.opacity = '';
            swipe(deltaX, titleAlbumContainer);
        });
    }


    function swipe(deltaX, titleAlbumContainer) {
        const swipeThreshold = 50;

        if (Math.abs(deltaX) >= swipeThreshold) {
            if (deltaX < 0) {
                // swipe left: play next song
                playNextSong();
                titleAlbumContainer.classList.add("left-fade-in");

                setTimeout(() => {
                    titleAlbumContainer.classList.remove("left-fade-in");
                }, 300);
            } else {
                // swipe right: play previous song
                playPreviousSong();
                titleAlbumContainer.classList.add("right-fade-in");
                setTimeout(() => {
                    titleAlbumContainer.classList.remove("right-fade-in");

                }, 300);
            }
        }
    };


};
function playPreviousSong() {
    const clickedRowID = document.getElementById("clicked-row");
    if (clickedRowID) {
        clickedRowID.scrollIntoView({ behavior: "smooth" });
    }

    if (clickedRow) {
        const previousRow = clickedRow.previousElementSibling;
        if (previousRow && previousRow.tagName === 'TR') {
            previousRow.click();
        } else {
            // If no previous row, go to the previous table and click the last row
            const previousTable = clickedRow.closest('table').previousElementSibling;
            if (previousTable && previousTable.tagName === 'TABLE') {
                const lastRow = previousTable.querySelector('tbody tr:last-child');
                if (lastRow) {
                    lastRow.click();
                }
            }
        }
    }
};

function playNextSong() {
    const clickedRowID = document.getElementById("clicked-row");
    if (clickedRowID) {
        clickedRowID.scrollIntoView({ behavior: "smooth" });
    }

    if (clickedRow) {
        const nextRow = clickedRow.nextElementSibling;
        if (nextRow && nextRow.tagName === 'TR') {
            nextRow.click();
        } else {
            // If no next row, go to the next table and click the first row
            const nextTable = clickedRow.closest('table').nextElementSibling;
            if (nextTable && nextTable.tagName === 'TABLE') {
                const firstRow = nextTable.querySelector('tbody tr:first-child');
                if (firstRow) {
                    firstRow.click();
                }
            }
        }
    }
};

function playMusic(audioElement, playPauseBtn) {
    audioElement.play();
    playPauseBtn.src = "../00images/pause.png";

};

function pauseMusic(audioElement, playPauseBtn) {
    audioElement.pause();
    playPauseBtn.src = "../00images/play.png";
};

function updateTimestamp(currentTime, duration) {
    const timestamp = document.querySelector('.timestamp');
    timestamp.textContent = formatTime(currentTime);

    const totalTime = document.querySelector('.total-time');
    if (!isNaN(duration) && isFinite(duration)) {
        totalTime.textContent = formatTime(duration);
    } else {
        totalTime.textContent = '0:00';
    }

    const tooltip = document.querySelector('.tooltip');
    const seekSlider = document.querySelector('.seek-slider');
    const seekBar = seekSlider.getBoundingClientRect();
    const xPos = (currentTime / duration) * seekBar.width;
    tooltip.textContent = formatTime(currentTime);
    tooltip.style.left = `${xPos}px`;
};

function updateSeekSlider(currentTime, duration) {
    const seekSlider = document.querySelector('.seek-slider');
    seekSlider.value = (currentTime / duration) * 100;

    const seekBar = seekSlider.value;
    const bar = document.querySelector(".bar");
    bar.style.width = `${seekBar}%`;

};

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

function mediaMetadata(audioElement, album, unchangedAlbum, unchangedTitle, playPauseBtn) {
    // Setting up media metadata
    navigator.mediaSession.metadata = new MediaMetadata({
        title: unchangedTitle,
        artist: unchangedAlbum,
        album: unchangedAlbum,
        artwork: [
            { src: `../00albumCovers/${album}.png`, sizes: '96x96', type: 'image/png' },
            { src: `../00albumCovers/${album}.png`, sizes: '128x128', type: 'image/png' },
            { src: `../00albumCovers/${album}.png`, sizes: '192x192', type: 'image/png' },
            { src: `../00albumCovers/${album}.png`, sizes: '256x256', type: 'image/png' },
            { src: `../00albumCovers/${album}.png`, sizes: '384x384', type: 'image/png' },
            { src: `../00albumCovers/${album}.png`, sizes: '512x512', type: 'image/png' }
        ]
    });

    navigator.mediaSession.setActionHandler('play', () => {
        playMusic(audioElement, playPauseBtn);
        navigator.mediaSession.playbackState = 'playing';

    });

    navigator.mediaSession.setActionHandler('pause', () => {
        pauseMusic(audioElement, playPauseBtn);
        navigator.mediaSession.playbackState = 'paused';

    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
        playPreviousSong();
        navigator.mediaSession.playbackState = 'playing';

    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
        playNextSong();
        navigator.mediaSession.playbackState = 'playing';

    });

    navigator.mediaSession.setActionHandler("seekbackward", (evt) => {
        const skipTime = evt.seekOffset || 10; // Skip 10 secs
        audioElement.currentTime = audioElement.currentTime - skipTime;
    });

    navigator.mediaSession.setActionHandler("seekforward", (evt) => {
        const skipTime = evt.seekOffset || 10; // Skip 10 secs
        audioElement.currentTime = audioElement.currentTime + skipTime;
    });

    navigator.mediaSession.setActionHandler("seekto", (evt) => {
        const seekTime = evt.seekTime;
        audioElement.currentTime = seekTime;
    });




    // Initial state when the page loads
    navigator.mediaSession.playbackState = 'none';

};

function filterTitle(title) {
    title = title.replace("♥", "").replace("☆", "_").replace("...", "").replace(/-/gi, "_").replace(/ /gi, "_").replace(".", "").replace("(", "").replace(")", "").replace("(", "").replace(")", "").replace("!", "").replace("?", "").replace(/'/gi, "").replace("&", "and").replace(/:/gi, "").replace(/~/gi, "").replace(/～/gi, "").replace(/,/gi, "_").replace(/・/gi, "_").replace("/", "_").replace("/", "_").replace("/", "_").replace("__", "_").replace("__", "_").replace("__", "_").replace("__", "_").replace("__", "_").replace("__", "_");
    return title;
};

function filterAlbum(album) {


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


            /*openings*/            album = album.replace(/(?:Mune_ga_Dokidoki|Feel_Your_Heart|Nazo|Unmei_no_Roulette_Mawashite|TRUTH_A_Great_Detective_of_Love|Girigiri_chop|Mysterious_Eyes|Koi_wa_Thrill_Shock_Suspense|destiny|Winter_Bells|I_cant_stop_my_love_for_you)/gi, "openings");
            /*endings*/             album = album.replace(/(?:STEP_BY_STEP|Meikyū_no_Lovers|Hikari_to_Kage_no_Roman|Kimi_ga_Inai_Natsu|Negai_Goto_Hitotsu_Dake|Kōri_no_Ue_ni_Tatsu_Yō_ni|Still_for_your_love|Free_Magic|Secret_of_my_heart|Natsu_no_Maboroshi|Start_in_my_life|always|Aoi_Aoi_Kono_Hoshi_ni|Yume_Mita_Ato_de|Mushoku|Overture)/gi, "endings");
            /*image song albums*/   album = album.replace(/(?:Boku_ga_Iru_TV_Anime_Detective_Conan_Image_Song_Album|Detective_Conan_Character_Song_Collection_Teitan_Shougakkou_ni_Zenin_Shuugou)/gi, "image_song_albums");
            /*other*/               album = album.replace(/(?:Happy_End|Utakata_no_Yume|↑THE_HIGH_LOWS↓|Dont_Stop_Dreaming|Kimi_ga_Ireba|LIVING_DAYLIGHTS|Haru_yo_Koi)/gi, "other");

    return album
};

