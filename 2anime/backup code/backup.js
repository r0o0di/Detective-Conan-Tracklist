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

document.addEventListener('click', (event) => {
  if (!search.contains(event.target) && search !== event.target) {
    search.classList.remove("active");
    searchInput.value = '';
    resultsContainer.innerHTML = '';
  }
});

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

// resultsContainer.addEventListener('click', (event) => {
//   const clickedElement = event.target;
//   if (clickedElement.tagName === 'A' && clickedElement.classList.contains('results')) {
//     const episodeId = parseInt(clickedElement.getAttribute('href').replace('#', ''));
//     const pageNumber = getPageNumber(episodeId);
//     switchToPage(pageNumber);
//   }
// });


// resultsContainer.addEventListener('click', (event) => {
//   const clickedElement = event.target;
//   if (clickedElement.classList.contains('results')) {
//     const episodeId = clickedElement.dataset.id;
//     const targetTable = document.getElementById(episodeId);
//     const pageNumber = getPageNumber(episodeId);
//     switchToPage(pageNumber);
//     if (targetTable) {
//       targetTable.scrollIntoView({ behavior: 'smooth' });
//     }
//   }
// });


resultsContainer.addEventListener('click', handleClick);
resultsContainer.addEventListener('touchend', handleTouchEnd);

function handleClick(event) {
  handleResultClick(event.target);
}

function handleTouchEnd(event) {
  event.preventDefault(); // Prevent the default touch event behavior
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
      window.scrollTo({ top: targetScrollPosition, behavior: 'smooth' });
    }
  }
}


function lazyLoad() {
  const images = document.querySelectorAll("img");
  images.forEach(img => {
    img.setAttribute("loading", "lazy");
    document.body.appendChild(img);
  });
}

lazyLoad();


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



import bgmEngTitles from '../0data/bgm-en-titles.js';
// Add event listeners to table rows
const tableRows = document.querySelectorAll('tbody tr');
let clickedRow = null; // Track the clicked row
let currentAudio = null; // Track the currently playing audio

tableRows.forEach(row => {
    row.addEventListener('click', handleRowClick);
});

function handleRowClick(event) {
    const newClickedRow = event.currentTarget;
    const cells = newClickedRow.querySelectorAll('td');

    // Check if any cell in the clicked row matches with bgmEngTitles
    let matchedTitle = null;
    cells.forEach(cell => {
        const cellText = cell.textContent.trim();
        if (bgmEngTitles.includes(cellText)) {
            matchedTitle = cellText;
        }
    });

    if (matchedTitle) {
        // Check if the clicked row is the same as the previously clicked row
        if (clickedRow === newClickedRow) {
            // If it is, remove the audio
            if (currentAudio) {
                currentAudio.parentNode.parentNode.removeChild(currentAudio.parentNode);
                currentAudio = null;
            }
            clickedRow = null; // Reset clickedRow
        } else {
            // If it's a new row, remove any previously generated audio
            if (currentAudio) {
                currentAudio.parentNode.parentNode.removeChild(currentAudio.parentNode);
            }

            // Create a new audio element with matched title
            const audioSrc = `/songs/${matchedTitle.toLowerCase().replace(/ /gi, "-").replace(".", "").replace("something-happened..", "something-happened").replace("(", "").replace(")", "").replace("!", "").replace(/'/gi, "").replace("&", "and").replace(":", "").replace("~", "").replace(",", "-").replace("・", "-").replace("--", "-")}.mp3`;
            console.log(audioSrc);
            const audio = document.createElement('audio');
            audio.src = audioSrc;
            audio.controls = true;

            // Create a new table row for the audio player
            const audioRow = document.createElement('tr');
            const audioCell = document.createElement('td');
            audioCell.colSpan = newClickedRow.cells.length; // Span the entire row
            audioCell.appendChild(audio);
            audioRow.appendChild(audioCell);

            // Insert the audio row after the clicked row
            newClickedRow.insertAdjacentElement('afterend', audioRow);

            // Set the currentAudio and clickedRow to the newly created audio element and clicked row
            currentAudio = audio;
            clickedRow = newClickedRow;
        }
    }
}







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














