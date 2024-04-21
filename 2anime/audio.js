const tableRows = document.querySelectorAll('tbody tr');
let clickedRow = null;
let currentAudio = null;

tableRows.forEach(row => {
    row.addEventListener('click', handleRowClick);
});

function handleRowClick(event) {
    const newClickedRow = event.currentTarget;


    let title = newClickedRow.querySelectorAll('td')[3].textContent.trim();
    title = title.replace("☆", "_").replace("...", "").replace(/-/gi, "_").replace(/ /gi, "_").replace(".", "").replace("(", "").replace(")", "").replace("!", "").replace("?", "").replace(/'/gi, "").replace("&", "and").replace(":", "").replace(/~/gi, "").replace(/～/gi, "").replace(",", "_").replace("・", "_").replace("__", "_");
    let album = newClickedRow.querySelectorAll('td')[4].textContent.trim();

    if (album == "Unreleased" || !album || !title) {
        return;
    }

    album = album
        .replace("☆", "_")
        .replace("...", "")
        .replace(/-/gi, "_")
        .replace(/ /gi, "_").replace(".", "").replace("(", "").replace(")", "").replace("!", "").replace("?", "").replace(/'/gi, "").replace("&", "and").replace(":", "").replace(/~/gi, "").replace(/～/gi, "").replace(",", "_").replace("・", "_").replace("__", "_")
        .replace("Detective_Conan_Original_Soundtrack_1", "OST1")
        .replace("Detective_Conan_Original_Soundtrack_2", "OST2")
        .replace("Detective_Conan_Original_Soundtrack_3", "OST3")
        .replace("Detective_Conan_Original_Soundtrack_4_Isoge_Shōnen_Tanteidan", "OST4")
        .replace("Detective_Conan_Original_Soundtrack_Super_Best", "super_best")
        .replace("Detective_Conan_Original_Soundtrack_Super_Best_2", "super_best_2");

    album = album.replace(/(?:Mune_ga_Dokidoki|Feel_Your_Heart|Nazo|Unmei_no_Roulette_Mawashite|TRUTH_A_Great_Detective_of_Love|Girigiri_chop)/gi, "openings");
    album = album.replace(/(?:STEP_BY_STEP|Meikyū_no_Lovers|Hikari_to_Kage_no_Roman|Kimi_ga_Inai_Natsu|Negai_Goto_Hitotsu_Dake|Kōri_no_Ue_ni_Tatsu_Yō_ni|Still_for_your_love|Free_Magic)/gi, "endings");






    newClickedRow.id = "clicked-row";
    // Remove border from previously clicked row, if any
    if (clickedRow && clickedRow !== newClickedRow) {
        clickedRow.removeAttribute("id");


    }

    if (clickedRow === newClickedRow) {
        newClickedRow.removeAttribute("id");


        if (currentAudio) {
            currentAudio.parentNode.parentNode.parentNode.removeChild(currentAudio.parentNode.parentNode);
            currentAudio = null;

        }
        clickedRow = null;
    } else {
        if (currentAudio) {
            currentAudio.parentNode.parentNode.parentNode.removeChild(currentAudio.parentNode.parentNode);
        }

        const audioSrc = `./0tracks/${album}/${title}.mp3`;

        const audioPlayerHTML = `
            <div class="audio-player-row">
                <div id="error-container"></div>
                <div class="loading-animation"></div>
                <div class="audio-player-container">
                    <audio autoplay loop preload="metadata">
                        <source src="${audioSrc}" type="audio/mpeg">
                    </audio>
                    <div class="custom-controls">
                        <img src="../00images/back.png" class="back-icon">
                        <img src="../00images/pause.png" class="play-pause-icon">
                        <img src="../00images/next.png" class="next-icon">

                        <span class="timestamp">0:00</span>
                        <div class="seek bar">
                            <input type="range" class="seek-slider" min="0" max="100" step="0.01" value="0">
                            <div class="bar2"></div>
                            <div class="dot"></div>
                            <span class="tooltip">00:00</span>
                        </div>
                        <span class="total-time">0:00</span>
                        <img src="../00images/volume-high.svg" class="volume-icon">
                        <div class="vol bar">
                            <input type="range" class="volume-slider" min="0" max="1" step="0.01" value="1">
                            <div class="bar2"></div>
                            <div class="dot"></div>
                        </div>
                        <img src="../00images/download.png" class="download-icon">
                    </div>
                </div>
            </div>
        `;

        const episodesList = document.querySelector(".episodes-list")

        episodesList.insertAdjacentHTML('beforeend', audioPlayerHTML);

        const loadingAnimation = document.querySelector('.loading-animation');
        const audioContainer = document.querySelector('.audio-player-container');
        const audioRow = document.querySelector('.audio-player-row');

        audioRow.addEventListener("click", () => {
            const clickedRow = document.getElementById("clicked-row");
            if (clickedRow) {
                clickedRow.scrollIntoView({ behavior: "smooth" })
            }
        });

        const audioElement = document.querySelector('audio');
        audioElement.addEventListener('loadstart', () => {
            loadingAnimation.style.display = 'block';
            audioContainer.style.display = "none";
        });
        audioElement.addEventListener('playing', () => {
            loadingAnimation.style.display = 'none';
            audioContainer.style.display = "block";
        });

        currentAudio = document.querySelector('audio');
        clickedRow = newClickedRow;

        const downloadIcon = document.querySelector(".download-icon");
        downloadIcon.addEventListener("click", () => {
            const audioSrc = currentAudio.querySelector('source').src;
            const fileName = audioSrc.substring(audioSrc.lastIndexOf("/") + 1);
            const downloadLink = document.createElement("a");
            downloadLink.href = audioSrc;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });

        const sourceElement = document.querySelector('source');
        const errorContainer = document.getElementById("error-container");
        sourceElement.addEventListener('error', () => {
            loadingAnimation.style.display = 'none';
            const errorMessage = document.createElement('h2');
            errorMessage.textContent = 'Audio not found';
            errorMessage.classList.add('error-message');
            errorContainer.append(errorMessage);
        });

        const playPauseBtn = document.querySelector('.play-pause-icon');
        playPauseBtn.addEventListener('click', () => {
            if (currentAudio.paused) {
                currentAudio.play();
                playPauseBtn.src = "../00images/pause.png";
            } else {
                currentAudio.pause();
                playPauseBtn.src = "../00images/play-button.png";
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                if (currentAudio) {
                    if (currentAudio.paused) {
                        currentAudio.play();
                        playPauseBtn.src = "../00images/pause.png";
                    } else {
                        currentAudio.pause();
                        playPauseBtn.src = "../00images/play-button.png";
                    }
                }
                event.preventDefault();
            }
        });

        const backIcon = document.querySelector(".back-icon");
        const nextIcon = document.querySelector(".next-icon");

        // Event listener for the back icon
        backIcon.addEventListener('click', () => {
            if (clickedRow) {
                const previousRow = clickedRow.previousElementSibling;
                if (previousRow && previousRow.tagName === 'TR') {
                    previousRow.click();
                }
            }
        });

        // Event listener for the next icon
        nextIcon.addEventListener('click', () => {
            if (clickedRow) {
                const nextRow = clickedRow.nextElementSibling;
                if (nextRow && nextRow.tagName === 'TR') {
                    nextRow.click();
                }
            }
        });


        nextIcon.addEventListener("click", () => {

        });


        currentAudio.addEventListener('timeupdate', () => {
            updateTimestamp(currentAudio.currentTime, currentAudio.duration);
            updateSeekSlider(currentAudio.currentTime, currentAudio.duration);
        });

        const volumeSlider = document.querySelector('.volume-slider');
        volumeSlider.addEventListener('input', () => {
            currentAudio.volume = volumeSlider.value;
            let volume = currentAudio.volume;
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
            const seekTo = currentAudio.duration * (seekSlider.value / 100);
            currentAudio.currentTime = seekTo;
            playPauseBtn.src = "../00images/pause.png";
        });

        const seekSliders = document.querySelectorAll('.seek-slider');
        seekSliders.forEach(seek => {
            seek.addEventListener('input', () => {
                const progressBar = parseInt((currentAudio.currentTime / currentAudio.duration) * 100);
                seek.value = progressBar;
                const seekBar = seek.value;
                const bar2 = seek.nextElementSibling;
                const dot = seek.nextElementSibling.nextElementSibling;
                bar2.style.width = `${seekBar}%`;
                dot.style.left = `${seekBar}%`;
            });

            seek.addEventListener('mousedown', () => {
                currentAudio.pause();
            });

            seek.addEventListener('mouseup', () => {
                const seekTo = currentAudio.duration * (seek.value / 100);
                currentAudio.currentTime = seekTo;
                currentAudio.play();
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
    }
}

function updateTimestamp(currentTime, duration) {
    const timestamp = document.querySelector('.timestamp');
    timestamp.textContent = formatTime(currentTime);

    const totalTime = document.querySelector('.total-time');
    if (!isNaN(duration) && isFinite(duration)) {
        totalTime.textContent = formatTime(duration);
    } else {
        totalTime.textContent = '00:00';
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
        if (currentAudio) {
            currentAudio.currentTime -= 5;
        }
    } else if (event.key === 'ArrowRight') {
        if (currentAudio) {
            currentAudio.currentTime += 5;
        }
    }
});
