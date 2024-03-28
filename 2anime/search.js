import allData from './0data/dc-all-anime-data.js';


const icon = document.querySelector(".icon");
const search = document.querySelector(".search");
const clearButton = document.querySelector(".clear");
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
let animationInProgress = false;

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
document.addEventListener('click', (event) => {
    if (!search.contains(event.target) && search !== event.target) {
        search.classList.remove("active");
        searchInput.value = '';
        resultsContainer.innerHTML = '';
    }
});

// compare the search input with episode titles or numbers. display results if there is a match
// 
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
            const link = document.createElement('a');
            link.href = `#${result.id}`;
            link.textContent = result.title;
            link.classList.add('results');
            resultsContainer.appendChild(link);

            if (index < totalResults - 1) {
                const line = document.createElement("hr");
                resultsContainer.appendChild(line);
            }
        });
    }
}
