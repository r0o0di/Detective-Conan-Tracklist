import allData from '../0data/dc-all-anime-data.js';


const icon = document.querySelector(".icon");
const search = document.querySelector(".search");
const clearButton = document.querySelector(".clear");
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
let animationInProgress = false;

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

clearButton.addEventListener("click", () => {
  if (searchInput.value === '') {
    search.classList.remove("active");
  } else {
    searchInput.value = '';
    resultsContainer.innerHTML = '';
    searchInput.focus();
  }
});

// document.addEventListener('click', (event) => {
//   if (!search.contains(event.target) && search !== event.target) {
//     search.classList.remove("active");
//     searchInput.value = '';
//     resultsContainer.innerHTML = '';
//   }
// });

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
      const div = document.createElement('div');
      div.textContent = result.title;
      div.classList.add('results');
      div.dataset.id = result.id; // Add data-id
      resultsContainer.appendChild(div);
      resultsContainer.focus();

      if (index < totalResults - 1) {
        const line = document.createElement("hr");
        resultsContainer.appendChild(line);
      }
    });
  }
}


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

// resultsContainer.addEventListener('click', (event) => {
//   const clickedElement = event.target;
//   if (clickedElement.tagName === 'A' && clickedElement.classList.contains('results')) {
//     const episodeId = parseInt(clickedElement.getAttribute('href').replace('#', ''));
//     const pageNumber = getPageNumber(episodeId);
//     switchToPage(pageNumber);
//   }
// });

resultsContainer.addEventListener('click', (event) => {
  const clickedElement = event.target;
  if (clickedElement.classList.contains('results')) {
    const episodeId = clickedElement.dataset.id;
    const targetTable = document.getElementById(episodeId);
    const pageNumber = getPageNumber(episodeId);
    switchToPage(pageNumber);
    if (targetTable) {
      targetTable.scrollIntoView({ behavior: 'smooth' });
    }
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

function lazyLoad() {
  const images = document.querySelectorAll("img");
  images.forEach(img => {
    img.setAttribute("loading", "lazy");
    document.body.appendChild(img);
  });
}

lazyLoad();

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
    caption.classList.add(episode.id);
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














