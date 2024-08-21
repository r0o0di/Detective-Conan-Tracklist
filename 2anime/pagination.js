// Retrieve the saved page number from localStorage or default to 1
let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
const totalPages = 12;

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

// Show the saved or default page when the page loads
showPage(currentPage);

document.getElementById('next').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        switchToPage(currentPage);
    }
});

document.getElementById('prev').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        switchToPage(currentPage);
    }
});