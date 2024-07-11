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
                        <img src="../00images/info.png" class="ep-info-icon noSelect" alt="about">
                        <div class="hr-container">
                            <hr id="hr">
                        </div>
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
                                <div class="loading-animation-container1">
                                    <div class="loading-animation1"></div>
                                </div>
                                <img src="../00images/pause.png" class="play-pause-icon noSelect" alt="pause/play">              
                                <img src="../00images/heart.png" class="heart-icon noSelect" alt="add">
                                <img src="../00images/download.png" class="download-icon noSelect" alt="download">
                            </div>
                            <div class="bar22-container">
                                <div class="bar22"></div>
                            </div>

                            <div class="expanded-custom-controls">
                                <div id="first-row">
                                    <div id="expanded-audio-info">
                                        <span id="title">${unchangedTitle}</span>
                                        <span id="album">${unchangedAlbum}</span>
                                    </div>
                                </div>
                                <div class="loading-animation-container2">
                                    <div class="loading-animation2"></div>
                                </div>
                                <div id="second-row">
                                    <div class="seek bar">
                                        <input type="range" class="seek-slider noSelect" min="0" max="100" step="0.01" value="0">
                                        <div class="bar2"></div>
                                        <span class="tooltip">00:00</span>
                                    </div>
                                    <div id="time">
                                        <span class="timestamp">0:00</span>    
                                        <span class="total-time">0:00</span>  
                                    </div>
                                </div>
                                <div id="third-row">
                                    <img src="../00images/loop.png" class="loop-icon noSelect" alt="loop">
                                    <div id="back-play-next">
                                        <img src="../00images/back.png" class="back-icon noSelect" alt="back">
                                        <img src="../00images/pause.png" class="play-pause-icon noSelect" alt="play/pause">
                                        <img src="../00images/next.png" class="next-icon noSelect" alt="next">
                                    </div>
                                    <img src="../00images/download.png" class="download-icon noSelect" alt="download">
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

        mediaMetadata(album, unchangedAlbum, unchangedTitle)
    

    const audioRow = document.querySelector('.audio-player-row');
    const epInfo = document.querySelector(".ep-info-icon");
    const hrContainer = document.querySelector(".hr-container");
    const downloadIcons = document.querySelectorAll(".download-icon");
    const loadingAnimationContainer1 = document.querySelector('.loading-animation-container1');
    const loadingAnimationContainer2 = document.querySelector('.loading-animation-container2');
    const errorContainer = document.getElementById("error-container");
    const audioContainer = document.querySelector('.audio-player-container');
    const sourceElement = document.querySelector('source');
    const heartIcon = document.querySelector(".heart-icon");
    const secondRow = document.getElementById("second-row");
    const loopIcon = document.querySelector(".loop-icon");
    const backIcon = document.querySelector(".back-icon");
    const playPauseBtns = document.querySelectorAll('.play-pause-icon');
    const playPauseBtn1 = playPauseBtns[0];
    const playPauseBtn2 = playPauseBtns[1];
    const nextIcon = document.querySelector(".next-icon");
    const seekSliders = document.querySelectorAll('.seek-slider');
    const titleAlbumContainer = document.querySelector(".title-album-container");
    const bar22 = document.querySelector(".bar22");
    const bar2 = document.querySelector(".bar2");


    // expand the audio player row when the hr container is clicked
    if (hrContainer || audioElement) {
        hrContainer.addEventListener("click", () => {
            audioRow.classList.toggle("expanded");
        });
    }
        // while the audio is loading, display a loading animation
        audioElement.addEventListener('loadstart', () => {
            // normally, at the start of an audio playing, there is a bug which sets the width of those bars to 50% (or sometimes 100%) for a split second.
            // setting the width to 0 fixes the issue
            bar22.style.width = "0px";
            bar2.style.width = "0px";
            audioContainer.style.display = "block";
            loadingAnimationContainer2.style.display = 'flex';
            playPauseBtn1.style.display = "none";
            secondRow.style.display = "none";
        });

        // as soon as it starts playing, remove the loading animation and display the audio controls
        audioElement.addEventListener('playing', () => {
            loadingAnimationContainer1.style.display = 'none';
            loadingAnimationContainer2.style.display = 'none';
            playPauseBtn1.style.display = "block";
            secondRow.style.display = "flex";


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
            loadingAnimationContainer2.style.display = 'none';
            audioContainer.style.display = "none";
            epInfo.style.display = "none";

            const errorMessage = document.createElement('h2');
            errorMessage.innerHTML = `Audio couldn't be played. <button>Report</button>`;
            errorMessage.classList.add('error-message');

            errorContainer.append(errorMessage);
            audioRow.classList.add("audio-player-row-error");
        });

        // change audio speed
        // audioSpeed.addEventListener("click", () => {
        //     if (audioElement.playbackRate === 1) {
        //         audioElement.playbackRate = 1.25;
        //         audioSpeed.textContent = "1.25x";
        //     } else if (audioElement.playbackRate === 1.25) {
        //         audioElement.playbackRate = 1.5;
        //         audioSpeed.textContent = "1.5x";
        //     } else if (audioElement.playbackRate === 1.5) {
        //         audioElement.playbackRate = 1.75;
        //         audioSpeed.textContent = "1.75x";
        //     } else if (audioElement.playbackRate === 1.75) {
        //         audioElement.playbackRate = 2;
        //         audioSpeed.textContent = "2x";
        //     } else if (audioElement.playbackRate === 2) {
        //         audioElement.playbackRate = 0.5;
        //         audioSpeed.textContent = "0.5x";
        //     } else if (audioElement.playbackRate === 0.5) {
        //         audioElement.playbackRate = 0.75;
        //         audioSpeed.textContent = "0.75x";
        //     } else if (audioElement.playbackRate === 0.75) {
        //         audioElement.playbackRate = 1;
        //         audioSpeed.textContent = "1x";
        //     }
        // });

        FromDatabase.checkIfAudioIsSaved(unchangedTitle, unchangedAlbum, heartIcon);
        heartIcon.addEventListener("click", () => {
            const notActive = "../00images/heart.png";
            const active = "../00images/heart-active.png";
            if (heartIcon.src.endsWith("heart.png")) {
                heartIcon.src = active;
                FromDatabase.saveAudio(unchangedTitle, unchangedAlbum, heartIcon, timeOrNum, jpnTitle, rmjTitle);
            } else {
                heartIcon.src = notActive;
                FromDatabase.removeAudio(unchangedTitle, unchangedAlbum);
            }

        });


        // click to loop audio
        loopIcon.addEventListener("click", () => {
            const isLooping = audioElement.hasAttribute("loop");
            audioElement[isLooping ? 'removeAttribute' : 'setAttribute']("loop", "");
            loopIcon.src = isLooping ? "../00images/loop.png" : "../00images/loop-active.png";
        });

        // play-pause the audio when the icons are clicked
        playPauseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (audioElement.paused) {
                    audioElement.play();
                    playPauseBtn1.src = "../00images/pause.png";
                    playPauseBtn2.src = "../00images/pause.png";
                } else {
                    audioElement.pause();
                    playPauseBtn1.src = "../00images/play.png";
                    playPauseBtn2.src = "../00images/play.png";
                }
            });
        });


        // also play-pause the audio, but when the space bar is pressed
        document.addEventListener('keydown', (event) => {
            if (event.key === ' ') {
                if (audioElement) {
                    if (audioElement.paused) {
                        audioElement.play();
                        playPauseBtn1.src = "../00images/pause.png";
                        playPauseBtn2.src = "../00images/pause.png";
                    } else {
                        audioElement.pause();
                        playPauseBtn1.src = "../00images/play.png";
                        playPauseBtn2.src = "../00images/play.png";
                    }
                }
                event.preventDefault(); // prevents the default behaviour of scrolling
            }
        });

        // play next/previous song
        backIcon.addEventListener('click', () => playPreviousSong());
        nextIcon.addEventListener('click', () => playNextSong());
        audioElement.addEventListener('ended', () => playNextSong());

        audioElement.addEventListener('timeupdate', () => {
            updateTimestamp(audioElement.currentTime, audioElement.duration);
            updateSeekSlider(audioElement.currentTime, audioElement.duration);
        });

        seekSliders.forEach(seek => {
            seek.addEventListener('input', () => {
                const seekTo = audioElement.duration * (seek.value / 100);
                audioElement.currentTime = seekTo;
                playPauseBtn1.src = "../00images/pause.png";
            });

            seek.addEventListener('input', () => {
                const progressBar = parseInt((audioElement.currentTime / audioElement.duration) * 100);
                seek.value = progressBar;
                const bar2 = seek.nextElementSibling;
                bar2.style.width = `${progressBar}%`;
            });

            seek.addEventListener('mousedown', () => {
                audioElement.pause();
            });

            seek.addEventListener('touchstart', () => {
                audioElement.pause();
            });

            seek.addEventListener('mouseup', () => {
                audioElement.play();
            });

            seek.addEventListener('touchend', () => {
                audioElement.play();
            });
        });

        titleAlbumContainer.addEventListener("click", () => {
            audioRow.classList.toggle("expanded");

            // if (audioRow.classList.contains("expanded")) {
            //     // Add state to history when expanded
            //     history.pushState({ expanded: true }, "");
            // }
        });

        // // Event listener for popstate to handle browser back button
        // window.addEventListener("popstate", (event) => {
        //     if (event.state && event.state.expanded) {
        //         audioRow.classList.add("expanded");
        //     } else {
        //         audioRow.classList.remove("expanded");
        //     }
        // });


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

function playMusic() {
    audioElement.play();
    playPauseBtn1.src = "../00images/pause.png";
    playPauseBtn2.src = "../00images/pause.png";

};

function pauseMusic() {
    audioElement.pause();
    playPauseBtn1.src = "../00images/play.png";
    playPauseBtn2.src = "../00images/play.png";
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
    const bar2 = seekSlider.nextElementSibling;
    const bar22 = document.querySelector(".bar22");

    bar2.style.width = `${seekBar}%`;
    bar22.style.width = `${seekBar}%`;

};

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

function mediaMetadata(album, unchangedAlbum, unchangedTitle) {
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
        playMusic();
        navigator.mediaSession.playbackState = 'playing';

    });

    navigator.mediaSession.setActionHandler('pause', () => {
        pauseMusic();
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





    // Initial state when the page loads
    navigator.mediaSession.playbackState = 'none';

};

function filterTitle(title) {
    title = title.replace("☆", "_").replace("...", "").replace(/-/gi, "_").replace(/ /gi, "_").replace(".", "").replace("(", "").replace(")", "").replace("(", "").replace(")", "").replace("!", "").replace("?", "").replace(/'/gi, "").replace("&", "and").replace(/:/gi, "").replace(/~/gi, "").replace(/～/gi, "").replace(/,/gi, "_").replace(/・/gi, "_").replace("/", "_").replace("/", "_").replace("/", "_").replace("__", "_").replace("__", "_").replace("__", "_").replace("__", "_").replace("__", "_").replace("__", "_");
    return title;
};

function filterAlbum(album) {


    album = album
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


            /*openings*/            album = album.replace(/(?:Mune_ga_Dokidoki|Feel_Your_Heart|Nazo|Unmei_no_Roulette_Mawashite|TRUTH_A_Great_Detective_of_Love|Girigiri_chop|Mysterious_Eyes|Koi_wa_Thrill_Shock_Suspense|destiny)/gi, "openings");
            /*endings*/             album = album.replace(/(?:STEP_BY_STEP|Meikyū_no_Lovers|Hikari_to_Kage_no_Roman|Kimi_ga_Inai_Natsu|Negai_Goto_Hitotsu_Dake|Kōri_no_Ue_ni_Tatsu_Yō_ni|Still_for_your_love|Free_Magic|Secret_of_my_heart|Natsu_no_Maboroshi|Start_in_my_life|always|Aoi_Aoi_Kono_Hoshi_ni)/gi, "endings");
            /*image song albums*/   album = album.replace(/(?:Boku_ga_Iru_TV_Anime_Detective_Conan_Image_Song_Album|Detective_Conan_Character_Song_Collection_Teitan_Shougakkou_ni_Zenin_Shuugou)/gi, "image_song_albums");
            /*other*/               album = album.replace(/(?:Happy_End|Utakata_no_Yume|↑THE_HIGH_LOWS↓|Dont_Stop_Dreaming|Kimi_ga_Ireba|LIVING_DAYLIGHTS|Haru_yo_Koi)/gi, "other");

    return album
};

