import allBgmData from './0data/dc-all-bgm-data.js';
import "https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.min.js";


const icon = document.querySelector(".icon");
const search = document.querySelector(".search");
const clearButton = document.querySelector(".clear");
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
let animationInProgress = false;
// Retrieve the saved page number from localStorage or default to 1
let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
const totalPages = 12;


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

searchInput.addEventListener("keydown", enter);
function enter(event) {
    switch (event.key) {
        case 'Enter':
            if (search.classList.contains("active")) {
                search.classList.remove("active");
                searchInput.value = "";
                resultsContainer.innerHTML = "";
            }

            break;

        default:
            break;
    }
}


resultsContainer.addEventListener("click", close);
function close() {

    if (search.classList.contains("active")) {
        search.classList.remove("active");
        searchInput.value = "";
        resultsContainer.innerHTML = "";
    }


}



// when the search bar is activated and user clicks anywhere on the screen, close the search bar
//document.addEventListener('click', (event) => {
//  if (!search.contains(event.target) && search !== event.target) {
//    search.classList.remove("active");
//  searchInput.value = '';
//resultsContainer.innerHTML = '';
//}
//});

// compare the search input with episode titles or numbers. display results if there is a match
// 
// searchInput.addEventListener('input', () => {
//     let query = searchInput.value.trim().toLowerCase();
//     if (query.length === 0) {
//         resultsContainer.innerHTML = '';
//     } else {
//         const filteredResults = filterEpisodes(query);
//         displayResults(filteredResults);
//     }
// });
// // showPage(currentPage);


// function filterEpisodes(query) {
//     return allBgmData.filter(episode =>
//         episode.title.toLowerCase().includes(query) ||
//         episode.id.toLowerCase().includes(query)
//     );
// }



// instead if the above code, use this below code for fuzzy search
// idk how it works though
const fuseOptions = {
    keys: ['title', 'id'],
    threshold: 0.3  // Adjust the threshold as needed (0.0 = exact match, 1.0 = match anything)
};
const fuse = new Fuse(allBgmData, fuseOptions);
searchInput.addEventListener('input', () => {
    let query = searchInput.value.trim().toLowerCase();
    if (query.length === 0) {
        resultsContainer.innerHTML = '';
    } else {
        const filteredResults = fuse.search(query).map(result => result.item);
        displayResults(filteredResults);
    }
});



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
            button.classList.add('results', "noSelect");
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
function handleClick(event) {
    handleResultClick(event.target);
}

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
            window.scrollTo({ top: targetScrollPosition - 52, behavior: 'smooth' }); // keep an additional 52 distance to take the nav bar into account
        }
    }
}


//
// resultsContainer.addEventListener('touchend', handleTouchEnd);
//function handleTouchEnd(event) {
//  event.preventDefault(); // Prevent the default touch event behavior
//handleResultClick(event.target);
//}

function getPageNumber(episodeId) {
    return Math.floor(episodeId / 100) + 1;
}
function switchToPage(pageNumber) {
    currentPage = pageNumber;
    localStorage.setItem('currentPage', currentPage); // Save the current page to localStorage
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
