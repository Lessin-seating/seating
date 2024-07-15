function navigateToTheater(theater) {
    localStorage.setItem('theater', theater);
    window.location.href = 'theater.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const theaterTitle = localStorage.getItem('theater');
    if (theaterTitle) {
        document.getElementById('theater-name').textContent = theaterTitle;
        document.getElementById('theater-title').textContent = theaterTitle;
    }
    
    const hasBalconyCheckbox = document.getElementById('has-balcony');
    if (hasBalconyCheckbox) {
        hasBalconyCheckbox.addEventListener('change', toggleBalconySection);
    }
    
    const differentSeatsCheckbox = document.getElementById('different-seats-per-row');
    if (differentSeatsCheckbox) {
        differentSeatsCheckbox.addEventListener('change', toggleSeatsTable);
    }
});

function toggleBalconySection() {
    const balconySection = document.getElementById('balcony-section');
    balconySection.style.display = this.checked ? 'block' : 'none';
}

function toggleSeatsTable() {
    const seatsTable = document.getElementById('seats-table');
    seatsTable.style.display = this.checked ? 'block' : 'none';
    if (this.checked) {
        generateSeatsTable();
    }
}

function generateSeatsTable() {
    const rows = document.get
