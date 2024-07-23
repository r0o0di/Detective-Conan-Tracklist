import soundtracks from './0data/soundtracks-data.js';
import Utilities from "../Utilities/utils.js";


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
    const tableHeaders = ["Track #", "JP Title", "RMJ Title", "EN Title", "Duration"];
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    tableHeaders.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
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
        // const downlaodCell = row.insertCell();
        // const img = document.createElement("img");
        // img.classList.add("download-icon");
        // img.src = "../00images/download.png";
        // downlaodCell.append(img);
    });
    table.appendChild(tbody);





    const soundtracksContainer = document.querySelector(".table-container");
    // display on the webpage
    soundtracksContainer.appendChild(table);
});
