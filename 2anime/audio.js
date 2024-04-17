// Add event listeners to table rows
const tableRows = document.querySelectorAll('tbody tr');
let clickedRow = null; // Track the clicked row
let currentAudio = null; // Track the currently playing audio

tableRows.forEach(row => {
    row.addEventListener('click', handleRowClick);
});

function handleRowClick(event) {
    const newClickedRow = event.currentTarget;
    let title = newClickedRow.querySelectorAll('td')[3].textContent.trim();
    title = title.replace(/ /gi, "_").replace(".", "").replace("something_happened..", "something_happened").replace("(", "").replace(")", "").replace("!", "").replace("?", "").replace(/'/gi, "").replace("&", "and").replace(":", "").replace(/~/gi, "").replace(",", "_").replace("・", "_").replace("__", "_");
    let album = newClickedRow.querySelectorAll('td')[4].textContent.trim();

    if (album == "Unreleased" || !title) {
        return;
    }


    // KEEP IN MIND THAT OPENINGS AND ENDINGS DONT HAVE AN ALBUM. 
    // SO REPLCAE THE NAME OF THE TITLES OF OPENINGS/ENDINGS WITH "openings"/"endings".
    album = album
    .replace(/ /gi, "_").replace(".", "").replace("something_happened..", "something_happened").replace("(", "").replace(")", "").replace("!", "").replace("?", "").replace(/'/gi, "").replace("&", "and").replace(":", "").replace(/~/gi, "").replace(",", "_").replace("・", "_").replace("__", "_")
    .replace("Detective_Conan_Original_Soundtrack_1", "OST1")
    .replace("Detective_Conan_Original_Soundtrack_2", "OST2")
    .replace("Detective_Conan_Original_Soundtrack_3", "OST3")
    .replace("Detective_Conan_Original_Soundtrack_4_Isoge_Shōnen_Tanteidan", "OST4")
    .replace("Detective_Conan_Original_Soundtrack_Super_Best", "super_best")
    .replace("Detective_Conan_Original_Soundtrack_Super_Best_2", "super_best_2")
    .replace("Mune_ga_Dokidoki", "openings")
    .replace("Feel_Your_Heart", "openings")
    .replace( "Nazo", "openings")
    .replace("Unmei_no_Roulette_Mawashite", "openings")
    .replace("TRUTH_A_Great_Detective_of_Love", "openings")
    .replace("Girigiri_chop", "openings");



    



    console.log(album, title);

    // Check if the clicked row is the same as the previously clicked row
    if (clickedRow === newClickedRow) {
        // If it is, remove the audio
        if (currentAudio) {
            currentAudio.parentNode.parentNode.parentNode.parentNode.removeChild(currentAudio.parentNode.parentNode.parentNode);
            currentAudio = null;
        }
        clickedRow = null; // Reset clickedRow
    } else {
        // If it's a new row, remove any previously generated audio
        if (currentAudio) {
            currentAudio.parentNode.parentNode.parentNode.parentNode.removeChild(currentAudio.parentNode.parentNode.parentNode);
        }

        // Create a new audio element with matched title
        const audioSrc = `./0tracks/${album}/${title}.mp3`;
        console.log(audioSrc);
        // Create the audio player HTML
        const audioPlayerHTML = `
            <tr class="audio-player-row">
              <td colspan="${newClickedRow.cells.length}">

                <div class="audio-player-container">

                  <audio autoplay loop>
                    <source src="${audioSrc}" type="audio/mpeg">
                  </audio>

                  <div class="custom-controls">
                    <img src="../00images/pause.png"  class="play-pause-icon">
                    
                    <span class="timestamp">00:00</span>
                    <div class="seek bar">
                        <input type="range" class="seek-slider" min="0" max="100" step="0.01" value="0">
                        <div class="bar2"></div>
                        <div class="dot"></div>
                        <span class="tooltip">00:00</span>
                    </div>
                    <span class="total-time">00:00</span>

                    <img src="../00images/volume-high.svg"  class="volume-icon">

                    <div class="vol bar">
                        <input type="range" class="volume-slider" min="0" max="1" step="0.01" value="1">
                        <div class="bar2"></div>
                        <div class="dot"></div>

                    </div>
                    <img src="../00images/download.png"  class="download-icon">
                  </div>
                </div>
              </td>
            </tr>
          `;

        // Convert the HTML string to DOM elements and insert after the clicked row
        newClickedRow.insertAdjacentHTML('afterend', audioPlayerHTML);

        // Set the currentAudio and clickedRow to the newly created audio element and clicked row
        currentAudio = newClickedRow.nextElementSibling.querySelector('audio');
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



        // Functionality for play/pause button
        const playPauseBtn = newClickedRow.nextElementSibling.querySelector('.play-pause-icon');
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
        

        // Update timestamp and seek slider on playback events
        currentAudio.addEventListener('timeupdate', () => {
            updateTimestamp(currentAudio.currentTime, currentAudio.duration);
            updateSeekSlider(currentAudio.currentTime, currentAudio.duration);
        });

        // Functionality for volume slider
        const volumeSlider = document.querySelector('.volume-slider', currentAudio.parentNode);
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

        // Functionality for seek slider
        const seekSlider = document.querySelector('.seek-slider', currentAudio.parentNode);
        seekSlider.addEventListener('input', () => {
            const seekTo = currentAudio.duration * (seekSlider.value / 100);
            currentAudio.currentTime = seekTo;
            playPauseBtn.src = "../00images/pause.png";

        });

        // Apply styles to seek slider and volume slider
        const seekSliders = document.querySelectorAll('.seek-slider', currentAudio.parentNode.parentNode);
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
            seek.addEventListener('touchstart', () => {
                currentAudio.pause();
            });

            seek.addEventListener('mouseup', () => {
                const seekTo = currentAudio.duration * (seek.value / 100);
                currentAudio.currentTime = seekTo;
                currentAudio.play();
            });
            seek.addEventListener('touchend', () => {
                const seekTo = currentAudio.duration * (seek.value / 100);
                currentAudio.currentTime = seekTo;
                currentAudio.play();
            });
        });

        const volumeSliders = document.querySelectorAll('.volume-slider', currentAudio.parentNode.parentNode);
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
    const timestamp = document.querySelector('.timestamp', currentAudio.parentNode);
    timestamp.textContent = formatTime(currentTime);

    const totalTime = document.querySelector('.total-time', currentAudio.parentNode);
    // // Check if duration is a valid number. fixes the problem of "NaN:NaN" appearing at the very beginning when a new audio is being played.
    // if (!isNaN(duration) && isFinite(duration)) {
    //     totalTime.textContent = formatTime(duration);
    // } else {
    //     totalTime.textContent = '00:00';
    // }
    totalTime.textContent = formatTime(duration);


    // Get the tooltip element
    const tooltip = document.querySelector('.tooltip', currentAudio.parentNode);
    
    // Calculate the position for the tooltip
    const seekSlider = document.querySelector('.seek-slider', currentAudio.parentNode);
    const seekBar = seekSlider.getBoundingClientRect();
    const xPos = (currentTime / duration) * seekBar.width;
    
    // Set the tooltip text
    tooltip.textContent = formatTime(currentTime);
    
    // Set the tooltip position
    tooltip.style.left = `${xPos}px`;
}


function updateSeekSlider(currentTime, duration) {
    const seekSlider = document.querySelector('.seek-slider', currentAudio.parentNode);
    seekSlider.value = (currentTime / duration) * 100;

    // Update the custom seek bar
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


