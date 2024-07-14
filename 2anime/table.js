import allBgmData from './0data/dc-all-bgm-data.js';

function getPageNumber(episodeId) {
    if (episodeId >= 1 && episodeId < 100) {
        return 1;
    } else if (episodeId >= 100 && episodeId < 200) {
        return 2;
    } else if (episodeId >= 200 && episodeId < 300) {
        return 3;
    } else if (episodeId >= 300 && episodeId < 400) {
        return 4;
    } else if (episodeId >= 400 && episodeId < 500) {
        return 5;
    } else if (episodeId >= 500 && episodeId < 600) {
        return 6;
    } else if (episodeId >= 600 && episodeId < 700) {
        return 7;
    } else if (episodeId >= 700 && episodeId < 800) {
        return 8;
    } else if (episodeId >= 800 && episodeId < 900) {
        return 9;
    } else if (episodeId >= 900 && episodeId < 1000) {
        return 10;
    } else if (episodeId >= 1000 && episodeId < 1100) {
        return 11;
    } else if (episodeId >= 1100 && episodeId < 1200) {
        return 12;
    }
}

function generateEpisodeTable(episodeNumber) {
    const episode = allBgmData[episodeNumber];

    if (episode) {
        const table = document.createElement("table");
        table.id = episode.id;
        table.dataset.id = episode.id; // Add data-id attribute
        table.classList.add("lazy-load");

        const firstTables = [1, 2, 100, 101, 200, 201, 300, 301, 400, 401, 500, 501, 
            600, 601, 700, 701, 800, 801, 900, 901, 1000, 1001, 1100, 1101, 1200, 1201,
            1300, 1301, 1400, 1401, 1500, 1501];
        if (firstTables.includes(Number(table.id))) {
            table.classList.remove("lazy-load");
        }

        const tableHeaders = ["Timestamp", "JP Title", "RMJ Title", "EN Title", "Source"];
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        tableHeaders.forEach(headerText => {
            const th = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        episode.BGM.forEach(rowData => {
            const row = document.createElement("tr");
            rowData.forEach(cellData => {
                const td = document.createElement("td");
                td.textContent = cellData;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        const caption = document.createElement("caption");
        // caption.classList.add(episode.id);
        const epId = allBgmData.find(ep => ep.id === episode.id);

        if (epId) {
            const newTitle = document.createElement("h2");
            newTitle.textContent = epId.title;
            caption.appendChild(newTitle);
        }

        table.appendChild(caption);

        const pageNumber = getPageNumber(Number(episode.id));
        const tableContainer = document.getElementById(`page${pageNumber}`);
        if (tableContainer) {
            tableContainer.querySelector('.table-container').appendChild(table);
        }
    }
}

function generateAllTables() {
    allBgmData.forEach((episode, index) => {
        generateEpisodeTable(index);
    });
}

generateAllTables();

const lazyTables = document.querySelectorAll('.lazy-load');

// check if the element is in the viewport
function lazyLoadTable() {
    lazyTables.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0 && rect.left < window.innerWidth && rect.right >= 0) {
            element.classList.add('visible');
        }
    });
}

// call function on page load and scroll
document.addEventListener('DOMContentLoaded', lazyLoadTable);
window.addEventListener('scroll', lazyLoadTable);
