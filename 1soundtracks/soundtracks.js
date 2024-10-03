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



    const soundtracksContainer = document.querySelector(".tables-container");
    const tableContainer = document.createElement("div");
    tableContainer.classList.add("table-container");
    tableContainer.appendChild(table);
    // display on the webpage
    soundtracksContainer.appendChild(tableContainer);
});





const downloadIcons = document.querySelectorAll(".thead-download-icon");
downloadIcons.forEach(downloadIcon => {
    downloadIcon.addEventListener("click", () => {
        const table = downloadIcon.closest("table");
        let album = table.querySelector("caption").textContent;
        const fileName = `${album}.zip`;
        const downloadLink = document.createElement("a");
        // eventually google drive might be required
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
        // tv
        .replace("Detective Conan Original Soundtrack 1", "https://www.mediafire.com/file/wczayrrincab83f/TV_OST_1.zip")
        .replace("Detective Conan Original Soundtrack 2", "https://www.mediafire.com/file/6svgsbmi9zayir9/TV_OST_2.zip")
        .replace("Detective Conan Original Soundtrack 3", "https://www.mediafire.com/file/qoj1kruro7khjet/TV_OST_3.zip")
        .replace("Detective Conan Original Soundtrack 4 Isoge Shōnen Tanteidan", "https://www.mediafire.com/file/i4p58grpuwpm46e/TV_OST_4.zip")
        .replace("Detective Conan Original Soundtrack Super Best 2", "https://www.mediafire.com/file/ajnl9yy7tabgg6w/TV_OST_Super_Best_2.zip")
        .replace("Detective Conan Original Soundtrack Super Best", "https://www.mediafire.com/file/xnippcserpbhvhy/TV_OST_Super_Best.zip")
        .replace("Detective Conan TV Original Soundtrack Selection Best", "https://www.mediafire.com/file/q8aq0oyvce24g0v/TV_OST_Selection_Best.zip")

        // movies
        .replace("Detective Conan 'The Time-Bombed Skyscraper' Original Soundtrack", "https://www.mediafire.com/file/813wvdhqpt4tszj/Movie_1_OST.zip")
        .replace("Detective Conan 'The Fourteenth Target' Original Soundtrack", "https://www.mediafire.com/file/tb4tsy1ky0ra4tm/Movie_2_OST.zip")
        .replace("Detective Conan 'The Last Wizard of the Century' Original Soundtrack", "https://www.mediafire.com/file/nwttn5dkkfs4ouo/Movie_3_OST.zip")
        .replace("Detective Conan 'Captured in Her Eyes' Original Soundtrack", "https://www.mediafire.com/file/9n2z6df6qthfe4p/Movie_4_OST.zip")
        .replace("Detective Conan 'Countdown to Heaven' Original Soundtrack", "https://www.mediafire.com/file/dwuj1w2sk87gxyu/Movie_5_OST.zip")
        .replace("Detective Conan 'The Phantom of Baker Street' Original Soundtrack", "https://www.mediafire.com/file/850v6m8tyhemn00/Movie_6_OST.zip")
        .replace("Detective Conan 'Crossroad in the Ancient Capital' Original Soundtrack", "https://www.mediafire.com/file/g1e7yc7lfstsjjh/Movie_7_OST.zip")
        .replace("Detective Conan 'Magician of the Silver Sky' Original Soundtrack", "https://www.mediafire.com/file/wrhmrurczv8rexm/Movie_8_OST.zip")
        .replace("Detective Conan 'Strategy Above the Depths' Original Soundtrack", "https://www.mediafire.com/file/7o9lbvzbzilx8dw/Movie_9_OST.zip")
        .replace("Detective Conan 'The Private Eyes Requiem' Original Soundtrack", "https://www.mediafire.com/file/59gkto67thumu3t/Movie_10_OST.zip")
        .replace("Detective Conan 'Jolly Roger in the Deep Azure' Original Soundtrack", "https://www.mediafire.com/file/73s6lcymxlwm0rw/Movie_11_OST.zip")
        .replace("Detective Conan 'Full Score of Fear' Original Soundtrack", "https://www.mediafire.com/file/nqwutjzngtcc6j5/Movie_12_OST.zip")
        .replace("Detective Conan 'The Raven Chaser' Original Soundtrack", "https://www.mediafire.com/file/5d76mujz6gydzdv/Movie_13_OST.zip")
        .replace("Detective Conan 'The Lost Ship in the Sky' Original Soundtrack", "https://www.mediafire.com/file/ebzoxcy8astvb5b/Movie_14_OST.zip")
        .replace("Detective Conan 'Quarter of Silence' Original Soundtrack", "https://www.mediafire.com/file/lftrhqm5ipeuyzm/Movie_15_OST.zip")
        .replace("Detective Conan 'The Eleventh Striker' Original Soundtrack", "https://www.mediafire.com/file/g49efegr7ygksqo/Movie_16_OST.zip")
        .replace("Detective Conan 'Private Eye in the Distant Sea' Original Soundtrack", "https://www.mediafire.com/file/1y8a2pxkqfhxfb5/Movie_17_OST.zip")
        .replace("Detective Conan 'Dimensional Sniper' Original Soundtrack", "https://www.mediafire.com/file/h2irm4g7hivwlir/Movie_18_OST.zip")
        .replace("Detective Conan 'Sunflowers of Inferno' Original Soundtrack", "https://www.mediafire.com/file/tyhsf129iukt8nr/Movie_19_OST.zip")
        .replace("Detective Conan 'The Darkest Nightmare' Original Soundtrack", "https://www.mediafire.com/file/tgnud6yy7pdrl8u/Movie_20_OST.zip")
        .replace("Detective Conan 'The Crimson Love Letter' Original Soundtrack", "https://www.mediafire.com/file/o5wh9wfc3vt915e/Movie_21_OST.zip")
        .replace("Detective Conan 'Zero the Enforcer' Original Soundtrack", "https://www.mediafire.com/file/8j4dw0siivk67q2/Movie_22_OST.zip")
        .replace("Detective Conan 'The Fist of Blue Sapphire' Original Soundtrack", "https://www.mediafire.com/file/33u0kg6zpe2ryz2/Movie_23_OST.zip")
        .replace("Detective Conan 'The Scarlet Bullet' Original Soundtrack", "https://www.mediafire.com/file/ter3556sg5kcus9/Movie_24_OST.zip")
        .replace("Detective Conan 'The Bride of Halloween' Original Soundtrack", "https://www.mediafire.com/file/h529v9lhyn59rdq/Movie_25_OST.zip")
        .replace("Detective Conan 'Black Iron Submarine' Original Soundtrack", "https://www.mediafire.com/file/9sogrbtuqy30zf1/Movie_26_OST.zip")
        .replace("Detective Conan 'The Million-dollar Pentagram' Original Soundtrack", "")
        
        // image song albums
        .replace("Boku ga Iru TV Anime Detective Conan Image Song Album", "https://www.mediafire.com/file/xxiy1jenmffyapf/Boku_ga_Iru_%257E_TV_Anime_%2527Detective_Conan%2527_Image_Song_Album.zip")
        .replace("Detective Conan Character Song Collection Teitan Shougakkou ni Zenin Shuugou", "https://www.mediafire.com/file/34lrd5tswo2e19y/Detective_Conan_Character_Song_Collection_-_Teitan_Shougakkou_ni_Zenin_Shuugou%2521%2521.zip")
        
        // CD singles
        .replace("Kimi ga Ireba", "https://www.mediafire.com/file/tm5n6ekis64p0f8/Kimi_ga_Ireba.zip")
        .replace("Boku ga Iru ~ Conan's Theme", "https://www.mediafire.com/file/jh6x0aj3kz2yadp/Boku_ga_Iru_%257E_Conan%2527s_Theme.zip")
        .replace("Kitto Ieru", "https://www.mediafire.com/file/tnr4xccb1107zrf/Kitto_Ieru.zip")
        .replace("Omoidetachi ~Omoide~", "https://www.mediafire.com/file/t3hu15v5jjbbdix/Omoidetachi_%257EOmoide%257E.zip")

        // magic kaito
        .replace("Magic Kaito 1412 Character Song ~ Magical Surprise Pallet", "https://www.mediafire.com/file/89bj8840olxvww4/MK_1412_Character_Song_%257E_Magical_Surprise_Pallet.zip")
        .replace("Magic Kaito 1412 Original Soundtrack", "https://www.mediafire.com/file/clbsjrpqvzg1fqt/MK_1412_OST.zip");
        return album;
}