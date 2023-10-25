const icon = document.querySelector(".icon");
const search = document.querySelector(".search");
const clearButton = document.querySelector(".clear");
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');

icon.onclick = function open() {
    search.classList.toggle("active");
}

clearButton.onclick = function clearInput() {
    if (searchInput.value === '') {
        search.classList.remove("active");
    } else {
        searchInput.value = '';
        searchInput.focus();
        resultsContainer.innerHTML = '';
    }
}

const episodes = [
    { id: '1', title: 'The Adventure Begins' },
    { id: '2', title: 'The Next Journey' },
];

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
    return episodes.filter(episode =>
        episode.title.toLowerCase().includes(query) ||
        episode.id.toLowerCase().includes(query)
    );
}

function displayResults(results) {
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = 'No matching episodes found.';
    } else {
        results.forEach(result => {
            const link = document.createElement('a');
            link.href = `#${result.id}`;
            link.textContent = result.title;
            link.addEventListener('click', () => scrollToEpisode(result.id));
            resultsContainer.appendChild(link);
        });
    }
}
