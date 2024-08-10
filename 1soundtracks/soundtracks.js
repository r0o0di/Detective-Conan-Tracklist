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
        let album = table.querySelector("caption").textContent;
        const fileName = `${album}.zip`;
        const downloadLink = document.createElement("a");
        // eventually google drive will have to be used because mediafire only allows 25 files
        // downloadLink.href = `https://drive.google.com/uc?export?download&id=${GoogleDrivefileID}`;
        const fileLink = getFileLink(album);
        downloadLink.href = fileLink;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });

});



function getFileLink(album) {
    album = album
        .replace("Detective Conan Original Soundtrack 1", "https://www.mediafire.com/file/wczayrrincab83f/TVOST1.zip")
        .replace("Detective Conan Original Soundtrack 2", "https://www.mediafire.com/file/6svgsbmi9zayir9/TVOST2.zip")
        .replace("Detective Conan Original Soundtrack 3", "https://www.mediafire.com/file/qoj1kruro7khjet/TVOST3.zip")
        .replace("Detective Conan Original Soundtrack 4 Isoge Shōnen Tanteidan", "https://www.mediafire.com/file/i4p58grpuwpm46e/TVOST4.zip")
        .replace("Detective Conan Original Soundtrack Super Best 2", "https://www.mediafire.com/file/ajnl9yy7tabgg6w/TVOSTSuperBest2.zip")
        .replace("Detective Conan Original Soundtrack Super Best", "https://www.mediafire.com/file/xnippcserpbhvhy/TVOSTSuperBest.zip")
        .replace("Detective Conan TV Original Soundtrack Selection Best", "https://www.mediafire.com/file/oayifdqd53u5zf1/TVOSTSelectionBest.zip")
    
        /*movie OSTs*/
        .replace("Detective Conan 'The Time-Bombed Skyscraper' Original Soundtrack", "https://www.mediafire.com/file/813wvdhqpt4tszj/Movie1OST.zip")
        .replace("Detective Conan 'The Fourteenth Target' Original Soundtrack", "https://www.mediafire.com/file/tb4tsy1ky0ra4tm/Movie2OST.zip")
        .replace("Detective Conan 'The Last Wizard of the Century' Original Soundtrack", "https://www.mediafire.com/file/nwttn5dkkfs4ouo/Movie3OST.zip")
        .replace("Detective Conan 'Captured in Her Eyes' Original Soundtrack", "https://www.mediafire.com/file/9n2z6df6qthfe4p/Movie4OST.zip")
        .replace("Detective Conan 'Countdown to Heaven' Original Soundtrack", "https://www.mediafire.com/file/dwuj1w2sk87gxyu/Movie5OST.zip")
        .replace("Detective Conan 'The Phantom of Baker Street' Original Soundtrack", "https://www.mediafire.com/file/nvtmttg0ot8p3af/Movie6OST.zip")
        
        
        .replace("Boku ga Iru TV Anime Detective Conan Image Song Album", "https://www.mediafire.com/file/xxiy1jenmffyapf/Boku_ga_Iru_%257E_TV_Anime_%2527Detective_Conan%2527_Image_Song_Album.zip")
        .replace("Detective Conan Character Song Collection Teitan Shougakkou ni Zenin Shuugou", "https://www.mediafire.com/file/34lrd5tswo2e19y/Detective_Conan_Character_Song_Collection_-_Teitan_Shougakkou_ni_Zenin_Shuugou%2521%2521.zip");
        return album;
}