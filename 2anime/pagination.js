const resultsContainer = document.getElementById('results');
const searchInput = document.getElementById('search-input');

let currentPage = 1;
const totalPages = 4;

function switchToPage(pageNumber) {
    currentPage = pageNumber;
    showPage(currentPage);
}

function showPage(pageNumber) {
    for (let i = 1; i <= totalPages; i++) {
        const page = document.getElementById('page' + i);
        if (i === pageNumber) {
            page.style.display = 'block';
        } else {
            page.style.display = 'none';
        }
    }
}

document.getElementById('next').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        showPage(currentPage);
    }
});

document.getElementById('prev').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
    }
});

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

resultsContainer.addEventListener('click', (event) => {
    const clickedElement = event.target;
    if (clickedElement.tagName === 'A' && clickedElement.classList.contains('results')) {
        const episodeId = parseInt(clickedElement.getAttribute('href').replace('#', ''));
        const pageNumber = getPageNumber(episodeId);
        switchToPage(pageNumber);
    }
});

function handleSearchInput() {
    let query = searchInput.value.trim().toLowerCase();
    if (query.length === 0) {
        resultsContainer.innerHTML = '';
        switchToPage(1);
    } else {
        const filteredResults = filterEpisodes(query);
        displayResults(filteredResults);
    }
}

searchInput.addEventListener('input', handleSearchInput);
showPage(currentPage);