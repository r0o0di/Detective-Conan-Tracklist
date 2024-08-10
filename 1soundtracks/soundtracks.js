import soundtracks from './0data/soundtracks-data.js';
import Utilities from "../utilities/utils.js";
// import { filterTitle, filterAlbum } from '../2anime/audio.js';

const navContainer = document.querySelector(".container");
Utilities.navigation(navContainer, "home", "heart");
Utilities.cacheSiteFiles();
Utilities.cacheImages();


soundtracks.forEach(soundtrack => {
    // table & caption
    const table = document.createElement('table');
    const caption = document.createElement("caption");
    const h2 = document.createElement("h2");
    table.id = soundtrack.title.replace(/~/gi, "").replace(/ /gi, "_").replace(/'/gi, "").replace("-", "_");
    h2.textContent = soundtrack.title; // soundtrack/album title 
    caption.append(h2);
    table.append(caption);

    // thead
    const downloadIcon = document.createElement("img");
    downloadIcon.src = "../00images/download.png";
    downloadIcon.classList.add("thead-download-icon", "noSelect");
    const tableHeaders = ["#", "JP Title", "RMJ Title", "EN Title", "Duration", downloadIcon];
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    tableHeaders.forEach(headerText => {
        const th = document.createElement("th");
        if (headerText instanceof HTMLImageElement) {
            th.appendChild(headerText);
        } else {
            th.textContent = headerText;
        }
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // tbody
    const tbody = document.createElement("tbody");

    // tr
    soundtrack.tracks.forEach(track => {
        const row = tbody.insertRow();
        track.forEach(data => {
            const cell = row.insertCell();
            cell.textContent = data;
        });
        const downloadCell = row.insertCell();

    });
    table.appendChild(tbody);



    const soundtracksContainer = document.querySelector(".table-container");
    // display on the webpage
    soundtracksContainer.appendChild(table);
});





const downloadIcons = document.querySelectorAll(".thead-download-icon");
downloadIcons.forEach(downloadIcon => {
    downloadIcon.addEventListener("click", () => {
        const table = downloadIcon.closest("table");
        let album = Utilities.filterAlbum(table.querySelector("caption").textContent);
        const fileName = `${album}.zip`;
        const downloadLink = document.createElement("a");
        const fileID = getFileID(album);
        downloadLink.href = `https://drive.google.com/uc?export?download&id=${fileID}`;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });

});




function getFileID(album) {
    album = album
    .replace("OST1", "")
    .replace("OST2", "")
    .replace("OST3", "")
    .replace("OST4", "")
    .replace("super_best", "")
    .replace("super_best_2", "")

    /*movie OSTs*/
    .replace("movie1", "")
    .replace("movie2", "")
    .replace("movie3", "")
    .replace("movie4", "")
    .replace("movie5", "")
    .replace("movie6", "14Y-RgqMrROhTr3bxEADIZPNL4hq8ZV4C")
    .replace("movie7", "")
    .replace("movie8", "")
    .replace("movie9", "")
    .replace("movie10", "")
    .replace("movie11", "")
    .replace("movie12", "")
    .replace("movie13", "")
    .replace("movie14", "")
    .replace("movie15", "")
    .replace("movie16", "")
    .replace("movie17", "")
    .replace("movie18", "")
    .replace("movie19", "");
    return album;
};