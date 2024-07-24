import soundtracks from './0data/soundtracks-data.js';
import Utilities from "../Utilities/utils.js";
// import { filterTitle, filterAlbum } from '../2anime/audio.js';

const navContainer = document.querySelector(".container");
Utilities.navigation(navContainer, "home", "heart");


soundtracks.forEach(soundtrack => {
    // table & caption
    const table = document.createElement('table');
    const caption = document.createElement("caption");
    const h2 = document.createElement("h2");
    table.id = soundtrack.title.replace(/~/gi, "").replace(/ /gi, "_");
    h2.textContent = soundtrack.title; // soundtrack/album title 
    caption.append(h2);
    table.append(caption);

    // thead
    const downloadIcon = document.createElement("img");
    downloadIcon.src = "../00images/download.png";
    downloadIcon.classList.add("thead-download-icon", "noSelect");
    const tableHeaders = ["Track #", "JP Title", "RMJ Title", "EN Title", "Duration", downloadIcon];
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
        downloadCell.textContent = "";

    });
    table.appendChild(tbody);



    const soundtracksContainer = document.querySelector(".table-container");
    // display on the webpage
    soundtracksContainer.appendChild(table);
});





function downloadCurrentTable() {
    const downloadIcons = document.querySelectorAll(".thead-download-icon");
    downloadIcons.forEach(downloadIcon => {
        downloadIcon.addEventListener("click", () => {
            const table = downloadIcon.closest("table");
            let album = Utilities.filterAlbum(table.querySelector("caption").textContent);
            const rows = table.querySelectorAll(`tbody tr`);
            rows.forEach(row => {
                let title = Utilities.filterTitle(row.querySelectorAll('td')[3].textContent.trim());
                startDownload(title, album)
            });
        });
        function startDownload(title, album) {
            const fileName = `${title}.mp3`;
            const downloadLink = document.createElement("a");
            downloadLink.href = `../0tracks/${album}/${title}.mp3`;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };
    });
};
downloadCurrentTable();
