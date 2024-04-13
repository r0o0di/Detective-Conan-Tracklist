import bgmEngTitles from './0data/bgm-en-titles.js';

// Add event listeners to table rows
const tableRows = document.querySelectorAll('tbody tr');
let clickedRow = null; // Track the clicked row
let currentAudio = null; // Track the currently playing audio

tableRows.forEach(row => {
    row.addEventListener('click', handleRowClick);
});

function handleRowClick(event) {
    const newClickedRow = event.currentTarget;
    const cells = newClickedRow.querySelectorAll('td');

    // Check if any cell in the clicked row matches with bgmEngTitles
    let matchedTitle = null;
    cells.forEach(cell => {
        const cellText = cell.textContent.trim();
        if (bgmEngTitles.includes(cellText)) {
            matchedTitle = cellText;
        }
    });

    if (matchedTitle) {
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
            const audioSrc = `./0tracks/${matchedTitle.replace(/ /gi, "-").replace(".", "").replace("something-happened..", "something-happened").replace("(", "").replace(")", "").replace("!", "").replace(/'/gi, "").replace("&", "and").replace(":", "").replace("~", "").replace(",", "-").replace("・", "-").replace("--", "-")}.mp3`;
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
                    <img src="../00images/pause.png" width="25px" height="25px" class="play-pause-icon">
                    
                    <span class="timestamp">00:00</span>
                    <div class="seek bar">
                        <input type="range" class="seek-slider" min="0" max="100" step=".000001" value="0">
                        <div class="bar2"></div>
                        <div class="dot"></div>
                    </div>
                    <span class="total-time">00:00</span>

                    <img src="../00images/volume-high.png" width="25px" height="25px" class="volume-icon">

                    <div class="vol bar">
                        <input type="range" class="volume-slider" min="0" max="1" step="0.000001" value="1">
                        <div class="bar2"></div>
                        <div class="dot"></div>

                    </div>
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

            // Functionality for play/pause button
            const playPauseBtn = document.querySelector('.play-pause-icon', currentAudio.parentNode);
            playPauseBtn.addEventListener('click', () => {
                if (currentAudio.paused) {
                    currentAudio.play();
                    playPauseBtn.src = "../00images/pause.png";
                } else {
                    currentAudio.pause();
                    playPauseBtn.src = "../00images/play-button.png";
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
                    volumeIcon.src = "../00images/volume-muted.png";
                } else if (volume > 0 && volume <= 0.33) {
                    volumeIcon.src = "../00images/volume-low.png";
                } else if (volume > 0.33 && volume <= 0.66) {
                    volumeIcon.src = "../00images/volume-middle.png";
                } else {
                    volumeIcon.src = "../00images/volume-high.png";
                }
            });
         
            // Functionality for seek slider
            const seekSlider = document.querySelector('.seek-slider', currentAudio.parentNode);
            seekSlider.addEventListener('input', () => {
                const seekTo = currentAudio.duration * (seekSlider.value / 100);
                currentAudio.currentTime = seekTo;
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

                seek.addEventListener('mouseup', () => {
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
}

function updateTimestamp(currentTime, duration) {
    const timestamp = document.querySelector('.timestamp', currentAudio.parentNode);
    timestamp.textContent = formatTime(currentTime);

    const totalTime = document.querySelector('.total-time', currentAudio.parentNode);
    totalTime.textContent = formatTime(duration);
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
