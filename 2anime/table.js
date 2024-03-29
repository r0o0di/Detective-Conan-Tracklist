import allData from './0data/dc-all-anime-data.js';


function captionUpdate() {
    const caption = document.querySelectorAll("caption");
    caption.forEach(caption => {
        const captionClass = caption.classList[0];
        const epId = allData.find(episode => episode.id === captionClass);

        if (epId) {
            const newTitle = document.createElement("h2");
            newTitle.textContent = epId.title;
            caption.innerHTML = "";
            caption.appendChild(newTitle);
        }
    });
}

captionUpdate();

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
    }
}

function generateEpisodeTable(episodeNumber) {
    const episode = allData[episodeNumber];

    if (episode) {
        const table = document.createElement("table");
        table.id = episode.id;
        table.dataset.id = episode.id; // Add data-id attribute
        table.classList.add("lazy-load");

        const tableHeaders = ["Timestamp", "JP Title", "RMJ Title", "EN Title", "OST"];
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
        caption.classList.add(episode.i);
        const epId = allData.find(ep => ep.id === episode.id);

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
    allData.forEach((episode, index) => {
        generateEpisodeTable(index);
    });
}

generateAllTables();




// Get all elements you want to lazy load
const lazyElements = document.querySelectorAll('.lazy-load');

// Function to check if the element is in the viewport
function lazyLoadContent() {
    lazyElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0 && rect.left < window.innerWidth && rect.right >= 0) {
            // If the element is in the viewport, load its content
            element.classList.add('visible');
        }
    });
}

// Run the lazy load function on page load and scroll
document.addEventListener('DOMContentLoaded', lazyLoadContent);
window.addEventListener('scroll', lazyLoadContent);
