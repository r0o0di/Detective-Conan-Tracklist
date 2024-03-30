const resultsContainer = document.getElementById('results');
const searchInput = document.getElementById('search-input');

let currentPage = 1;
const totalPages = 12;

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
    } else if (episodeId >= 1000 && episodeId < 1200) {
        return 12;
    }
}
