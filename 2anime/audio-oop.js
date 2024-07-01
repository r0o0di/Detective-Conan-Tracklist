
const AudioPlayer = {

    tableRows: document.querySelectorAll('tbody tr'),
    clickedRow: null,
    audioElement: null,

    init() {
        this.tableRows.forEach(row => {
            row.addEventListener('click', (event) => this.handleRowClick(event));
        });
    },


    handleRowClick(event) {
        const newClickedRow = event.currentTarget;

        let title = newClickedRow.querySelectorAll('td')[3].textContent.trim();
        const unchangedTitle = title;
        title = this.filterTitle(title);

        let album = newClickedRow.querySelectorAll('td')[4].textContent.trim();
        const currentTable = newClickedRow.closest("table");
        let caption = currentTable.querySelector("caption").textContent.trim();
        const firstChar = caption.charAt(0);
        let unchangedAlbum;
        if (isNaN(firstChar)) {
            unchangedAlbum = caption;
            album = this.filterAlbum(caption);
        } else {
            unchangedAlbum = album;
            album = this.filterAlbum(album);
        }

        if (album === "Unreleased" || !album || !title) {
            navigator.vibrate(100);
            return;
        }

        newClickedRow.id = "clicked-row";

        if (this.clickedRow && this.clickedRow !== newClickedRow) {
            this.clickedRow.removeAttribute("id");
        }

        if (this.clickedRow === newClickedRow) {
            newClickedRow.removeAttribute("id");

            if (this.audioElement) {
                this.audioElement.parentNode.parentNode.parentNode.removeChild(this.audioElement.parentNode.parentNode);
                this.audioElement = null;
            }
            this.clickedRow = null;
        } else {
            if (this.audioElement) {
                this.audioElement.parentNode.parentNode.parentNode.removeChild(this.audioElement.parentNode.parentNode);
            }

            this.clickedRow = newClickedRow;

            const audioSrc = `../0tracks/${album}/${title}.mp3`;
            console.log(audioSrc);

            const audioPlayerHTML = `
                    <div class="audio-player-row">
                        <img src="../00images/info.png" class="ep-info-icon" alt="about">
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
                                <img src="../00images/pause.png" class="play-pause-icon" alt="pause/play">              
                                <img src="../00images/download.png" class="download-icon" alt="download">
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
                                    <img src="../00images/loop.png" class="loop-icon" alt="loop">
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

            const episodesList = document.querySelector(".episodes-list");
            if (episodesList) {
                episodesList.insertAdjacentHTML('afterend', audioPlayerHTML);
            }

            const soundtracksContainer = document.getElementById("soundtracks-container");
            if (soundtracksContainer) {
                soundtracksContainer.insertAdjacentHTML('afterend', audioPlayerHTML);
            }
            this.audioElement = document.querySelector('audio');

            this.initUIElements();
            this.addEventListeners(audioSrc, title);
            this.mediaMetadata(unchangedAlbum, unchangedTitle);
        }
    },

    initUIElements() {
        this.audioRow = document.querySelector('.audio-player-row');
        this.epInfo = document.querySelector(".ep-info-icon");
        this.hrContainer = document.querySelector(".hr-container");
        this.downloadIcons = document.querySelectorAll(".download-icon");
        this.loadingAnimationContainer1 = document.querySelector('.loading-animation-container1');
        this.loadingAnimationContainer2 = document.querySelector('.loading-animation-container2');
        this.errorContainer = document.getElementById("error-container");
        this.audioContainer = document.querySelector('.audio-player-container');
        this.sourceElement = document.querySelector('source');
        this.addIcon = document.querySelector(".add-icon");
        this.secondRow = document.getElementById("second-row");
        this.loopIcon = document.querySelector(".loop-icon");
        this.backIcon = document.querySelector(".back-icon");
        this.playPauseBtns = document.querySelectorAll('.play-pause-icon');
        this.playPauseBtn1 = this.playPauseBtns[0];
        this.playPauseBtn2 = this.playPauseBtns[1];
        this.nextIcon = document.querySelector(".next-icon");
        this.seekSliders = document.querySelectorAll('.seek-slider');
        this.titleAlbumContainer = document.querySelector(".title-album-container");
        this.bar22 = document.querySelector(".bar22");
        this.bar2 = document.querySelector(".bar2");

        this.startX = 0;
        this.endX = 0;
        this.swipeThreshold = 50;
    },

    addEventListeners(audioSrc, title) {
        // expand the audio player row when the hr container is clicked
        this.hrContainer.addEventListener("click", () => {
            this.audioRow.classList.toggle("expanded");
        });

        // while the audio is loading, display a loading animation
        this.audioElement.addEventListener('loadstart', () => {
            this.audioContainer.style.display = "block";
            this.loadingAnimationContainer2.style.display = 'flex';
            this.playPauseBtn1.style.display = "none";
            this.secondRow.style.display = "none";
            this.bar22.style.display = "none";
            this.bar2.style.display = "none";
        });

        // as soon as it starts playing, remove the loading animation and display the audio controls
        this.audioElement.addEventListener('playing', () => {
            this.loadingAnimationContainer1.style.display = 'none';
            this.loadingAnimationContainer2.style.display = 'none';
            this.playPauseBtn1.style.display = "block";
            this.secondRow.style.display = "flex";

            setTimeout(() => {
                this.bar22.style.display = "block";
                this.bar2.style.display = "block";
            }, 1500);
            // normally, at the start of an audio playing, the there is a bug which sets the width of those bars to 50%.
            // setting a timeout fixes the issue
        });

        // download audio when clicked
        // iterate over each downloadIcon
        this.downloadIcons.forEach(downloadIcon => {
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
        this.sourceElement.addEventListener('error', () => {
            this.loadingAnimationContainer2.style.display = 'none';
            this.audioContainer.style.display = "none";
            this.epInfo.style.display = "none";

            const errorMessage = document.createElement('h2');
            errorMessage.innerHTML = `Audio couldn't be played. <button>Report</button>`;
            errorMessage.classList.add('error-message');

            this.errorContainer.append(errorMessage);
            this.audioRow.classList.add("audio-player-row-error");
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

        // click to loop audio
        this.loopIcon.addEventListener("click", () => {
            const isLooping = this.audioElement.hasAttribute("loop");
            this.audioElement[isLooping ? 'removeAttribute' : 'setAttribute']("loop", "");
            this.loopIcon.src = isLooping ? "../00images/loop.png" : "../00images/loop-active.png";
        });

        // play-pause the audio when the icons are clicked
        this.playPauseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.audioElement.paused) {
                    this.audioElement.play();
                    this.playPauseBtn1.src = "../00images/pause.png";
                    this.playPauseBtn2.src = "../00images/pause.png";
                } else {
                    this.audioElement.pause();
                    this.playPauseBtn1.src = "../00images/play.png";
                    this.playPauseBtn2.src = "../00images/play.png";
                }
            });
        });


        // also play-pause the audio, but when the space bar is pressed
        document.addEventListener('keydown', (event) => {
            if (event.key === ' ') {
                if (this.audioElement) {
                    if (this.audioElement.paused) {
                        this.audioElement.play();
                        this.playPauseBtn1.src = "../00images/pause.png";
                        this.playPauseBtn2.src = "../00images/pause.png";
                    } else {
                        this.audioElement.pause();
                        this.playPauseBtn1.src = "../00images/play.png";
                        this.playPauseBtn2.src = "../00images/play.png";
                    }
                }
                event.preventDefault(); // prevents the default behaviour of scrolling
            }
        });


        this.backIcon.addEventListener('click', () => this.playPreviousSong());
        this.nextIcon.addEventListener('click', () => this.playNextSong());
        this.audioElement.addEventListener('ended', () => this.playNextSong());

        this.audioElement.addEventListener('timeupdate', () => {
            this.updateTimestamp(this.audioElement.currentTime, this.audioElement.duration);
            this.updateSeekSlider(this.audioElement.currentTime, this.audioElement.duration);
        });

        this.seekSliders.forEach(seek => {
            seek.addEventListener('input', () => {
                const seekTo = this.audioElement.duration * (seek.value / 100);
                this.audioElement.currentTime = seekTo;
                this.playPauseBtn1.src = "../00images/pause.png";
            });

            seek.addEventListener('input', () => {
                const progressBar = parseInt((this.audioElement.currentTime / this.audioElement.duration) * 100);
                seek.value = progressBar;
                const bar2 = seek.nextElementSibling;
                const dot = seek.nextElementSibling.nextElementSibling;
                bar2.style.width = `${progressBar}%`;
                dot.style.left = `${progressBar}%`;
            });

            seek.addEventListener('mousedown', () => {
                this.audioElement.pause();
            });

            seek.addEventListener('touchstart', () => {
                this.audioElement.pause();
            });

            seek.addEventListener('mouseup', () => {
                this.audioElement.play();
            });

            seek.addEventListener('touchend', () => {
                this.audioElement.play();
            });
        });

        this.titleAlbumContainer.addEventListener("click", () => {
            this.audioRow.classList.toggle("expanded");

            if (this.audioRow.classList.contains("expanded")) {
                // Add state to history when expanded
                history.pushState({ expanded: true }, "");
            }
        });

        // Event listener for popstate to handle browser back button
        window.addEventListener("popstate", (event) => {
            if (event.state && event.state.expanded) {
                this.audioRow.classList.add("expanded");
            } else {
                this.audioRow.classList.remove("expanded");
            }
        });

        // swiping For touch events
        this.titleAlbumContainer.addEventListener('touchstart', e => {
            this.startX = e.changedTouches[0].screenX;
        });

        this.titleAlbumContainer.addEventListener('touchend', e => {
            this.endX = e.changedTouches[0].screenX;
            this.swipe();
        });

        // swiping For mouse events
        this.titleAlbumContainer.addEventListener('mousedown', e => {
            this.startX = e.clientX;
        });

        this.titleAlbumContainer.addEventListener('mouseup', e => {
            this.endX = e.clientX;
            this.swipe();
        });
    },

    swipe() {
        const deltaX = this.endX - this.startX;
        if (Math.abs(deltaX) >= this.swipeThreshold) {
            if (deltaX < 0) {
                // Swipe left: Play next song
                this.playNextSong();
            } else {
                // Swipe right: Play previous song
                this.playPreviousSong();

            }
        }
    },

    playPreviousSong() {
        const clickedRowID = document.getElementById("clicked-row");
        if (clickedRowID) {
            clickedRowID.scrollIntoView({ behavior: "smooth" });
        }

        if (this.clickedRow) {
            const previousRow = this.clickedRow.previousElementSibling;
            if (previousRow && previousRow.tagName === 'TR') {
                previousRow.click();
            } else {
                // If no previous row, go to the previous table and click the last row
                const previousTable = this.clickedRow.closest('table').previousElementSibling;
                if (previousTable && previousTable.tagName === 'TABLE') {
                    const lastRow = previousTable.querySelector('tbody tr:last-child');
                    if (lastRow) {
                        lastRow.click();
                    }
                }
            }
        }
    },

    playNextSong() {
        const clickedRowID = document.getElementById("clicked-row");
        if (clickedRowID) {
            clickedRowID.scrollIntoView({ behavior: "smooth" });
        }

        if (this.clickedRow) {
            const nextRow = this.clickedRow.nextElementSibling;
            if (nextRow && nextRow.tagName === 'TR') {
                nextRow.click();
            } else {
                // If no next row, go to the next table and click the first row
                const nextTable = this.clickedRow.closest('table').nextElementSibling;
                if (nextTable && nextTable.tagName === 'TABLE') {
                    const firstRow = nextTable.querySelector('tbody tr:first-child');
                    if (firstRow) {
                        firstRow.click();
                    }
                }
            }
        }
    },

    playMusic() {
        this.audioElement.play();
        this.playPauseBtn1.src = "../00images/pause.png";
        this.playPauseBtn2.src = "../00images/pause.png";

    },

    pauseMusic() {
        this.audioElement.pause();
        this.playPauseBtn1.src = "../00images/play.png";
        this.playPauseBtn2.src = "../00images/play.png";
    },

    updateTimestamp(currentTime, duration) {
        const timestamp = document.querySelector('.timestamp');
        timestamp.textContent = this.formatTime(currentTime);

        const totalTime = document.querySelector('.total-time');
        if (!isNaN(duration) && isFinite(duration)) {
            totalTime.textContent = this.formatTime(duration);
        } else {
            totalTime.textContent = '0:00';
        }

        const tooltip = document.querySelector('.tooltip');
        const seekSlider = document.querySelector('.seek-slider');
        const seekBar = seekSlider.getBoundingClientRect();
        const xPos = (currentTime / duration) * seekBar.width;
        tooltip.textContent = this.formatTime(currentTime);
        tooltip.style.left = `${xPos}px`;
    },

    updateSeekSlider(currentTime, duration) {
        const seekSlider = document.querySelector('.seek-slider');
        seekSlider.value = (currentTime / duration) * 100;

        const seekBar = seekSlider.value;
        const bar2 = seekSlider.nextElementSibling;
        const dot = seekSlider.nextElementSibling.nextElementSibling;
        bar2.style.width = `${seekBar}%`;
        dot.style.left = `${seekBar}%`;
        this.bar22.style.width = `${seekBar}%`;
    },

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },

    mediaMetadata(unchangedAlbum, unchangedTitle) {
        // Setting up media metadata
        navigator.mediaSession.metadata = new MediaMetadata({
            title: unchangedTitle,
            artist: unchangedAlbum,
            album: unchangedAlbum,
            artwork: [
                { src: '../00images/icon.png', sizes: '96x96', type: 'image/png' },
                { src: '../00images/icon.png', sizes: '128x128', type: 'image/png' },
                { src: '../00images/icon.png', sizes: '192x192', type: 'image/png' },
                { src: '../00images/icon.png', sizes: '256x256', type: 'image/png' },
                { src: '../00images/icon.png', sizes: '384x384', type: 'image/png' },
                { src: '../00images/icon.png', sizes: '512x512', type: 'image/png' }
            ]
        });

        navigator.mediaSession.setActionHandler('play', () => {
            this.playMusic();
            navigator.mediaSession.playbackState = 'playing';

        });

        navigator.mediaSession.setActionHandler('pause', () => {
            this.pauseMusic();
            navigator.mediaSession.playbackState = 'paused';

        });

        navigator.mediaSession.setActionHandler('previoustrack', () => {
            this.playPreviousSong();
            navigator.mediaSession.playbackState = 'playing';

        });

        navigator.mediaSession.setActionHandler('nexttrack', () => {
            this.playNextSong();
            navigator.mediaSession.playbackState = 'playing';

        });





        // Initial state when the page loads
        navigator.mediaSession.playbackState = 'none';

    },

    filterTitle(title) {
        title = title.replace("☆", "_").replace("...", "").replace(/-/gi, "_").replace(/ /gi, "_").replace(".", "").replace("(", "").replace(")", "").replace("(", "").replace(")", "").replace("!", "").replace("?", "").replace(/'/gi, "").replace("&", "and").replace(/:/gi, "").replace(/~/gi, "").replace(/～/gi, "").replace(",", "_").replace(/・/gi, "_").replace("/", "_").replace("/", "_").replace("/", "_").replace("__", "_").replace("__", "_").replace("__", "_").replace("__", "_").replace("__", "_").replace("__", "_");
        return title;
    },

    filterAlbum(album) {


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











            /*openings*/            album = album.replace(/(?:Mune_ga_Dokidoki|Feel_Your_Heart|Nazo|Unmei_no_Roulette_Mawashite|TRUTH_A_Great_Detective_of_Love|Girigiri_chop|Mysterious_Eyes)/gi, "openings");
            /*endings*/             album = album.replace(/(?:STEP_BY_STEP|Meikyū_no_Lovers|Hikari_to_Kage_no_Roman|Kimi_ga_Inai_Natsu|Negai_Goto_Hitotsu_Dake|Kōri_no_Ue_ni_Tatsu_Yō_ni|Still_for_your_love|Free_Magic|Secret_of_my_heart)/gi, "endings");
            /*image song albums*/   album = album.replace(/(?:Boku_ga_Iru_TV_Anime_Detective_Conan_Image_Song_Album|Detective_Conan_Character_Song_Collection_Teitan_Shougakkou_ni_Zenin_Shuugou)/gi, "image_song_albums");
            /*other*/               album = album.replace(/(?:Happy_End|Utakata_no_Yume|↑THE_HIGH_LOWS↓|Dont_Stop_Dreaming|Kimi_ga_Ireba|LIVING_DAYLIGHTS)/gi, "other");

        return album
    }

};


AudioPlayer.init();