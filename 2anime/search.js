import allData from './0data/dc-all-anime-data.js';

const icon = document.querySelector(".icon");
const search = document.querySelector(".search");
const clearButton = document.querySelector(".clear");
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
let animationInProgress = false;
let currentPage = 1;
const totalPages = 4;

// activate the search bar when clicking the search icon
icon.addEventListener("click", () => {
    if (!animationInProgress) {
        animationInProgress = true;
        setTimeout(() => {
            if (search.classList.contains("active")) {
                searchInput.value = "";
                resultsContainer.innerHTML = "";
                searchInput.blur();
            }

            search.classList.toggle("active");
            if (search.classList.contains("active")) {
                setTimeout(() => {
                    searchInput.focus();
                    animationInProgress = false;
                }, 500);
            } else {
                searchInput.blur();
                animationInProgress = false;
            }
        }, 0);
    }
});

// when the X symbol is clicked the first time, delete the text from the search bar. for the second time, deactivate/close the search bar
clearButton.addEventListener("click", () => {
    if (searchInput.value === '') {
        search.classList.remove("active");
    } else {
        searchInput.value = '';
        resultsContainer.innerHTML = '';
        searchInput.focus();
    }
});

// when the search bar is activated and user clicks the screen, close the search bar
document.addEventListener('click', closeSearch);
document.addEventListener('touchstart', closeSearch);

function closeSearch(event) {
    if (!search.contains(event.target) && search !== event.target) {
        search.classList.remove("active");
        searchInput.value = '';
        resultsContainer.innerHTML = '';
    }
}

// compare the search input with episode titles or numbers. display results if there is a match
searchInput.addEventListener('input', () => {
    let query = searchInput.value.trim().toLowerCase();
    if (query.length === 0) {
        resultsContainer.innerHTML = '';
    } else {
        const filteredResults = filterEpisodes(query);
        displayResults(filteredResults);
    }
});

function filterEpisodes(query) {
    return allData.filter(episode =>
        episode.title.toLowerCase().includes(query) ||
        episode.id.toLowerCase().includes(query)
    );
}

function displayResults(results) {
    resultsContainer.innerHTML = '';
    if (results.length === 0) {
        const noMatch = document.createElement("p");
        noMatch.textContent = "No matching episodes found";
        noMatch.classList.add('no-match');
        resultsContainer.appendChild(noMatch);
    } else {
        const totalResults = results.length;
        results.forEach((result, index) => {
            const button = document.createElement('button');
            button.textContent = result.title;
            button.classList.add('results');
            button.dataset.id = result.id; // Add data-id
            resultsContainer.appendChild(button);

            if (index < totalResults - 1) {
                const line = document.createElement("hr");
                resultsContainer.appendChild(line);
            }
        });
    }
}

resultsContainer.addEventListener('click', handleClick);
resultsContainer.addEventListener('touchend', handleTouchEnd);

function handleResultClick(clickedElement) {
    if (clickedElement.classList.contains('results')) {
        const episodeId = clickedElement.dataset.id;
        const targetTable = document.getElementById(episodeId);
        const pageNumber = getPageNumber(episodeId);
        switchToPage(pageNumber);
        if (targetTable) {
            // Calculate the scroll position of the target table
            const targetScrollPosition = targetTable.getBoundingClientRect().top + window.scrollY;
            // Smooth scroll to the target table
            window.scrollTo({ top: targetScrollPosition, behavior: 'smooth' });
        }
    }
}

function handleClick(event) {
    handleResultClick(event.target);
}

function handleTouchEnd(event) {
    event.preventDefault(); // Prevent the default touch event behavior
    handleResultClick(event.target);
}

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
