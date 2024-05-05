const tableRows = document.querySelectorAll('tbody tr');
let clickedRow = null;
let audioElement = null;


tableRows.forEach(row => {
    row.addEventListener('click', handleRowClick);
});

function handleRowClick(event) {
    const newClickedRow = event.currentTarget;



    let title = newClickedRow.querySelectorAll('td')[3].textContent.trim();
    const unchangedTitle = title;
    title = title.replace("☆", "_").replace("...", "").replace(/-/gi, "_").replace(/ /gi, "_").replace(".", "").replace("(", "").replace(")", "").replace("(", "").replace(")", "").replace("!", "").replace("?", "").replace(/'/gi, "").replace("&", "and").replace(":", "").replace(/~/gi, "").replace(/～/gi, "").replace(",", "_").replace("・", "_").replace("__", "_");
    let album = newClickedRow.querySelectorAll('td')[4].textContent.trim();
    const unchangedAlbum = album;
    if (album == "Unreleased" || !album || !title) {
        navigator.vibrate(1000);
        return;
    }

    album = album
        .replace("☆", "_")
        .replace("...", "")
        .replace(/-/gi, "_")
        .replace(/ /gi, "_").replace(".", "").replace("(", "").replace(")", "").replace("!", "").replace("?", "").replace(/'/gi, "").replace("&", "and").replace(":", "").replace(/~/gi, "").replace(/～/gi, "").replace(",", "_").replace("・", "_").replace("__", "_").replace("__", "_")
        .replace("Detective_Conan_Original_Soundtrack_1", "OST1")
        .replace("Detective_Conan_Original_Soundtrack_2", "OST2")
        .replace("Detective_Conan_Original_Soundtrack_3", "OST3")
        .replace("Detective_Conan_Original_Soundtrack_4_Isoge_Shōnen_Tanteidan", "OST4")
        .replace("Detective_Conan_Original_Soundtrack_Super_Best", "super_best")
        .replace("Detective_Conan_Original_Soundtrack_Super_Best_2", "super_best_2")

        /*movies OSTs*/
        .replace("Detective_Conan_The_Time_Bombed_Skyscraper_Original_Soundtrack", "movie1")
        .replace("Detective_Conan_The_Fourteenth_Target_Original_Soundtrack", "movie2")
        .replace("Detective_Conan_The_Last_Wizard_of_the_Century_Original_Soundtrack", "movie3");


    /*openings*/ album = album.replace(/(?:Mune_ga_Dokidoki|Feel_Your_Heart|Nazo|Unmei_no_Roulette_Mawashite|TRUTH_A_Great_Detective_of_Love|Girigiri_chop)/gi, "openings");
    /*endings*/  album = album.replace(/(?:STEP_BY_STEP|Meikyū_no_Lovers|Hikari_to_Kage_no_Roman|Kimi_ga_Inai_Natsu|Negai_Goto_Hitotsu_Dake|Kōri_no_Ue_ni_Tatsu_Yō_ni|Still_for_your_love|Free_Magic)/gi, "endings");
    /*other*/    album = album.replace(/(?:Happy_End|Utakata_no_Yume)/gi, "other");





    newClickedRow.id = "clicked-row";
    // Remove border from previously clicked row, if any
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

        const audioSrc = `./0tracks/${album}/${title}.mp3`;
        console.log(audioSrc);

        const audioPlayerHTML = `
            <div class="audio-player-row">
            <img src="../00images/info.png" class="ep-info-icon" alt="about">

                <div class="hr-container">
                <hr id="hr">
                </div>


                
                <div id="error-container"></div>
                

                <div class="audio-player-container">
                    <audio autoplay loop preload="metadata">
                        <source src="${audioSrc}" type="audio/mpeg">
                    </audio>
                    


                    <div id="audio-info">
                        <div class="title-album-container">
                            <span id="title"> ${unchangedTitle}</span>
                            <span id="album"> ${unchangedAlbum}</span>
                        </div>
                    </div>
                    
                    
        
                    <div class="custom-controls">
                        <div class="loading-animation-container1">
                            <div class="loading-animation1"></div>
                        </div>
                        <img src="../00images/pause.png" class="play-pause-icon" alt="pause/play">              
                        <img src="../00images/download.png" class="download-icon" alt="download">
                    </div>


                    <div class="expanded-custom-controls">
                        <div class="img-container">
                            <img src="../00images/anime.jpg" alt="cover">
                        </div>
                        <div id="first-row">
                            <div id="expanded-audio-info">
                                <span id="title"> ${unchangedTitle}</span>
                                <span id="album"> ${unchangedAlbum}</span>
                            </div>
                            <img src="../00images/add.png" class="add-icon" alt="add">
                        </div>

                        <div class="loading-animation-container2">
                            <div class="loading-animation2"></div>
                        </div>

                        <div id="second-row">
                        
                            <div class="seek bar">
                                    <input type="range" class="seek-slider" min="0" max="100" step="0.01" value="0">
                                    <div class="bar2"></div>
                                    <div class="dot"></div>
                                    <span class="tooltip">00:00</span>
                            </div>
                        
                            <div id="time">
                            <span class="timestamp">0:00</span>    
                                <span class="total-time">0:00</span>  
                                </div>
                        </div>
                        
                        <div id="third-row">
                            <button id="speed">1x</button>
                            <div id="back-play-next">
                                <img src="../00images/back.png" class="back-icon" alt="back">
                                <img src="../00images/pause.png" class="play-pause-icon" alt="play/pause">
                                <img src="../00images/next.png" class="next-icon" alt="next">
                            </div>
                            <img src="../00images/download.png" class="download-icon" alt="download">
                        </div>





                        <img src="../00images/volume-high.svg" class="volume-icon">
                        <div class="vol bar">
                            <input type="range" class="volume-slider" min="0" max="1" step="0.01" value="1">
                            <div class="bar2"></div>
                            <div class="dot"></div>
                            </div>


                               
                    </div>
                </div>
            </div>
        `;

        const episodesList = document.querySelector(".episodes-list")

        episodesList.insertAdjacentHTML('afterend', audioPlayerHTML);

        const audioRow = document.querySelector('.audio-player-row'); // the entire thing
        const epInfo = document.querySelector(".ep-info-icon");
        const hrContainer = document.querySelector(".hr-container");
        const downloadIcons = document.querySelectorAll(".download-icon");
        const loadingAnimationContainer1 = document.querySelector('.loading-animation-container1');
        const loadingAnimationContainer2 = document.querySelector('.loading-animation-container2');
        const errorContainer = document.getElementById("error-container");
        const audioContainer = document.querySelector('.audio-player-container');
        audioElement = document.querySelector('audio');
        const sourceElement = document.querySelector('source');
        const secondRow = document.getElementById("second-row");
        const audioSpeed = document.getElementById("speed");
        const backIcon = document.querySelector(".back-icon");
        const playPauseBtns = document.querySelectorAll('.play-pause-icon');
        const playPauseBtn1 = document.querySelectorAll('.play-pause-icon')[0];
        const playPauseBtn2 = document.querySelectorAll('.play-pause-icon')[1];
        const nextIcon = document.querySelector(".next-icon");


        // expand the audio player row when the hr container is clicked
        hrContainer.addEventListener("click", () => {
            audioRow.classList.toggle("expanded");
        });

        // while the audio is loading, display a loading animation
        audioElement.addEventListener('loadstart', () => {
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
            // Attach click event listener to each downloadIcon
            downloadIcon.addEventListener("click", () => {

                const fileName = `${title}.mp3`;
                const downloadLink = document.createElement("a");
                downloadLink.href = audioSrc;
                downloadLink.download = fileName;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            });
        });


        // if the audio cant be played, display an error
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
        audioSpeed.addEventListener("click", () => {
            if (audioElement.playbackRate === 1) {
                audioElement.playbackRate = 1.25;
                audioSpeed.textContent = "1.25x";
            } else if (audioElement.playbackRate === 1.25) {
                audioElement.playbackRate = 1.5;
                audioSpeed.textContent = "1.5x";
            } else if (audioElement.playbackRate === 1.5) {
                audioElement.playbackRate = 1.75;
                audioSpeed.textContent = "1.75x";
            } else if (audioElement.playbackRate === 1.75) {
                audioElement.playbackRate = 2;
                audioSpeed.textContent = "2x";
            } else if (audioElement.playbackRate === 2) {
                audioElement.playbackRate = 0.5;
                audioSpeed.textContent = "0.5x";
            } else if (audioElement.playbackRate === 0.5) {
                audioElement.playbackRate = 0.75;
                audioSpeed.textContent = "0.75x";
            } else if (audioElement.playbackRate === 0.75) {
                audioElement.playbackRate = 1;
                audioSpeed.textContent = "1x";
            }
        });


        // play-pause the audio when the icons are clicked
        // iterate
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
        })


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


        backIcon.addEventListener('click', playPreviousSong);
        nextIcon.addEventListener('click', playNextSong);



        audioElement.addEventListener('timeupdate', () => {
            updateTimestamp(audioElement.currentTime, audioElement.duration);
            updateSeekSlider(audioElement.currentTime, audioElement.duration);
        });

        const volumeSlider = document.querySelector('.volume-slider');
        volumeSlider.addEventListener('input', () => {
            audioElement.volume = volumeSlider.value;
            let volume = audioElement.volume;
            const volumeIcon = document.querySelector(".volume-icon");
            if (volume === 0) {
                volumeIcon.src = "../00images/volume-muted.svg";
            } else if (volume > 0 && volume <= 0.33) {
                volumeIcon.src = "../00images/volume-low.svg";
            } else if (volume > 0.33 && volume <= 0.66) {
                volumeIcon.src = "../00images/volume-middle.svg";
            } else if (volume > 0.66) {
                volumeIcon.src = "../00images/volume-high.svg";
            }
        });

        const seekSlider = document.querySelector('.seek-slider');
        seekSlider.addEventListener('input', () => {
            const seekTo = audioElement.duration * (seekSlider.value / 100);
            audioElement.currentTime = seekTo;
            playPauseBtn1.src = "../00images/pause.png";
        });

        const seekSliders = document.querySelectorAll('.seek-slider');
        seekSliders.forEach(seek => {
            seek.addEventListener('input', () => {
                const progressBar = parseInt((audioElement.currentTime / audioElement.duration) * 100);
                seek.value = progressBar;
                const seekBar = seek.value;
                const bar2 = seek.nextElementSibling;
                const dot = seek.nextElementSibling.nextElementSibling;
                bar2.style.width = `${seekBar}%`;
                dot.style.left = `${seekBar}%`;
            });

            seek.addEventListener('mousedown', () => {
                audioElement.pause();
            });

            seek.addEventListener('mouseup', () => {
                const seekTo = audioElement.duration * (seek.value / 100);
                audioElement.currentTime = seekTo;
                audioElement.play();
            });
        });

        const volumeSliders = document.querySelectorAll('.volume-slider');
        volumeSliders.forEach(volume => {
            volume.addEventListener('input', () => {
                const bar2 = volume.nextElementSibling;
                const dot = volume.nextElementSibling.nextElementSibling;
                const volumeBar = volume.value * 100;
                bar2.style.width = `${volumeBar}%`;
                dot.style.left = `${volumeBar}%`;
            });
        });




        // this somehow fixes the problem of the expanded class being removed whenever the next/previous icons are clicked while expanded
        // but it instantly expands the audioplayer as soon as a table row is clicked
        // find a solution to keep the solution which doesnt remove the expanded class whenever the next/previous icons are clicked while expanded, while also not expanding the audio player right as the table row is clicked. instead, let the user decide whether he wants it to expand or not by clicking the hrContainer
        // if (event.target === hrContainer) {
        //     audioRow.classList.toggle("expanded");
        // } else {
        //     audioRow.classList.toggle("expanded");
        // }







        // Swipe detection for the audio-info element
        const titleAlbumContainer = document.querySelector(".title-album-container");
        titleAlbumContainer.addEventListener("click", () => {
            audioRow.classList.toggle("expanded");
        });

        // let touchstartX = 0
        // let touchendX = 0

        // function checkDirection() {
        //     if (touchendX < touchstartX) {
        //         playNextSong();
        //         touchendX = 0;
        //         touchstartX = 0
        //     }
        //     if (touchendX > touchstartX) {
        //         playPreviousSong();
        //         touchendX = 0;
        //         touchstartX = 0
        //     }
        // }

        // titleAlbumContainer.addEventListener('touchstart', e => {
        //     touchstartX = e.changedTouches[0].screenX
        // })

        // titleAlbumContainer.addEventListener('touchend', e => {
        //     touchendX = e.changedTouches[0].screenX
        //     checkDirection()
        // })


        
        let startX = 0;
        let endX = 0;
        
        const swipeThreshold = 50; 
        
        function checkDirection() {
            const deltaX = endX - startX;
            if (Math.abs(deltaX) >= swipeThreshold) {
                if (deltaX < 0) {
                    // Swipe left: Play next song
                    playNextSong();
                } else {
                    // Swipe right: Play previous song
                    playPreviousSong();
                }
            }
        }
        
        // For touch events
        titleAlbumContainer.addEventListener('touchstart', e => {
            startX = e.changedTouches[0].screenX;
        });
        
        titleAlbumContainer.addEventListener('touchend', e => {
            endX = e.changedTouches[0].screenX;
            checkDirection();
        });
        
        // For mouse events
        titleAlbumContainer.addEventListener('mousedown', e => {
            startX = e.clientX;
        });
        
        titleAlbumContainer.addEventListener('mouseup', e => {
            endX = e.clientX;
            checkDirection();
        });
        



        // Function to play the previous song
        function playPreviousSong() {
            const clickedRowID = document.getElementById("clicked-row");
            if (clickedRowID) {
                clickedRowID.scrollIntoView({ behavior: "smooth" });
            }
            if (clickedRow) {
                const previousRow = clickedRow.previousElementSibling;
                if (previousRow && previousRow.tagName === 'TR') {
                    previousRow.click();
                }
            }
        }

        // Function to play the next song
        function playNextSong() {
            const clickedRowID = document.getElementById("clicked-row");
            if (clickedRowID) {
                clickedRowID.scrollIntoView({ behavior: "smooth" });
            }
            if (clickedRow) {
                const nextRow = clickedRow.nextElementSibling;
                if (nextRow && nextRow.tagName === 'TR') {
                    nextRow.click();
                }
            }
        }
    }
}






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
}

function updateSeekSlider(currentTime, duration) {
    const seekSlider = document.querySelector('.seek-slider');
    seekSlider.value = (currentTime / duration) * 100;

    const seekBar = seekSlider.value;
    const bar2 = seekSlider.nextElementSibling;
    const dot = seekSlider.nextElementSibling.nextElementSibling;
    bar2.style.width = `${seekBar}%`;
    dot.style.left = `${seekBar}%`;
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        if (audioElement) {
            audioElement.currentTime -= 5;
        }
    } else if (event.key === 'ArrowRight') {
        if (audioElement) {
            audioElement.currentTime += 5;
        }
    }
});














// stimulate clicking all the rows of the first 10 tables to check if any errors occur
// async function checkAudioUrlsFirst10() {
//     const tables = document.querySelectorAll('table');

//     // Select only the first 10 tables
//     const selectedTables = Array.from(tables).slice(0, 1);

//     selectedTables.forEach(table => {
//         const rows = table.querySelectorAll('tbody tr');

//         rows.forEach(async row => {
//             try {
//                 // Simulate clicking on the row
//                 row.click();
//                 await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for audio to load (adjust timing as needed)

//                 // Check if any GET or 404 errors occurred
//                 const sourceElement = row.nextElementSibling.querySelector('source');
//                 if (sourceElement) {
//                     const audioSource = sourceElement.src;
//                     const response = await fetch(audioSource);
//                     if (!response.ok) {
//                         console.error(`Error loading audio: ${audioSource}`);
//                         // Handle error as needed
//                     }
//                     // Your existing code to check audio URLs for each row
//                 } else {
//                     console.error(`Error: Source element not found for row: ${row}`);
//                 }
//             } catch (error) {
//                 console.error(error);
//             }
//         });
//     });
// }

// checkAudioUrlsFirst10();
