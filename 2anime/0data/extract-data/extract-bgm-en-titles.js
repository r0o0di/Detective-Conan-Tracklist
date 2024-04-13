import episodesData from './dc-anime-ep-information-and-bgm-data.js';
import episodes from './dc-anime-ep-titles.js';

const mergeArrays = (episodes, episodesData) => {
    // Create an object to store episodesData elements based on id
    const mapEpisodesDataById = episodesData.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {});

    // Iterate through episodes and update corresponding elements in episodesData
    episodes.forEach(episode => {
        const id = episode.id;
        if (mapEpisodesDataById[id]) {
            mapEpisodesDataById[id].title = episode.title;
        }
    });

    // Create a new array with the merged and formatted data
    const mergedAndFormatted = episodesData.map(item => {
        // Check each property individually before including it in the template
        const BGM = item.hasOwnProperty('BGM') ? item.BGM : [];

        // Use a set to store unique titles
        const uniqueTitles = new Set();

        const formattedBGM = BGM.map((bg) => {
            const title = bg[3];
            if (!uniqueTitles.has(title)) {
                uniqueTitles.add(title);
                return `"${title}",<br>`;
            }
            return ''; // Return empty string for duplicates
        }).join('');

        return `<div> 
            ${formattedBGM}<br> 
        </div>`;
    });

    return mergedAndFormatted.join('');
};

const mergedData = mergeArrays(episodes, episodesData);

// Render the merged data on the webpage
const container = document.getElementById('episodesContainer');
container.innerHTML = mergedData;

// Create a button to copy the content of the container
const copyButton = document.getElementById("copy")
copyButton.textContent = 'Copy to Clipboard';
copyButton.addEventListener('click', function() {
    const range = document.createRange();
    range.selectNode(allContent);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    console.log('Copied to clipboard');
});