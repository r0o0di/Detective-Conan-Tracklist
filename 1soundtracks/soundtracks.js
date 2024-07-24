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

    });
    table.appendChild(tbody);



    const soundtracksContainer = document.querySelector(".table-container");
    // display on the webpage
    soundtracksContainer.appendChild(table);
});





function downloadCurrentTable() {
    const downloadIcons = document.querySelectorAll(".thead-download-icon");
  
    downloadIcons.forEach(downloadIcon => {
      downloadIcon.addEventListener("click", async () => { // Use async/await for cleaner syntax
        const table = downloadIcon.closest("table");
        let album = Utilities.filterAlbum(table.querySelector("caption").textContent);
        const rows = table.querySelectorAll("tbody tr");
  
        for (const row of rows) {
          let title = Utilities.filterTitle(row.querySelectorAll('td')[3].textContent.trim());
  
          try {
            const fileName = `${title}.mp3`;
            const downloadUrl = `../0tracks/${album}/${title}.mp3`; // Assuming valid URL structure
  
            // Fetch the audio data
            const response = await fetch(downloadUrl);
  
            // Check for successful response
            if (!response.ok) {
              throw new Error(`Error fetching audio: ${response.statusText}`);
            }
  
            // Create a Blob object representing the audio data
            const blob = await response.blob();
  
            // Generate a unique object URL for the download
            const downloadLink = document.createElement("a");
            const objectURL = URL.createObjectURL(blob);
            downloadLink.href = objectURL;
            downloadLink.download = fileName;
  
            // Append the link to the body (temporary element for download)
            document.body.appendChild(downloadLink);
  
            // Trigger the download asynchronously and release the object URL
            await new Promise((resolve, reject) => {
              downloadLink.addEventListener("click", () => {
                downloadLink.click();
                resolve();
              });
              downloadLink.addEventListener("error", reject);
            });
  
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(objectURL); // Release memory after download
  
            // Wait for the current download to finish before proceeding
            await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust delay as needed
          } catch (error) {
            console.error("Download error:", error);
            // Handle download errors gracefully (e.g., display error message to user)
          }
        }
      });
    });
  }
  
  downloadCurrentTable();
  