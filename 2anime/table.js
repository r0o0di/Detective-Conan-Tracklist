import allBgmData from './0data/dc-all-bgm-data.js';

function getPageNumber(episodeId) {
    return Math.floor(episodeId / 100) + 1;
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

        const tableHeaders = ["00:00", "JP Title", "RMJ Title", "EN Title", "Source"];
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
        const page = document.getElementById(`page${pageNumber}`);
        const tableContainer = document.createElement("div");
        tableContainer.classList.add("table-container");
        tableContainer.appendChild(table);
        page?.querySelector('.tables-container').appendChild(tableContainer);

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
