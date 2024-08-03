document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('create-hall-btn')) {
        setupCreateHallPage();
    }

    if (document.getElementById('hall-title')) {
        setupHallPage();
    }

    if (document.getElementById('halls-list')) {
        setupTheaterPage();
    }
});

function setupTheaterPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const theater = urlParams.get('theater');
    const hallsList = document.getElementById('halls-list');

    loadHalls(theater, hallsList);

    document.getElementById('create-hall-btn').addEventListener('click', () => {
        location.href = `create-hall.html?theater=${encodeURIComponent(theater)}`;
    });
}

function loadHalls(theater, hallsList) {
    let halls = JSON.parse(localStorage.getItem(theater)) || [];

    hallsList.innerHTML = ''; // Clear the list before populating

    halls.forEach(hall => {
        let hallDiv = document.createElement('div');
        hallDiv.className = 'hall-item';

        let hallBtn = document.createElement('button');
        hallBtn.textContent = hall.name;
        hallBtn.addEventListener('click', () => {
            location.href = `hall-template.html?theater=${encodeURIComponent(theater)}&name=${encodeURIComponent(hall.name)}`;
        });

        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eraser';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
            deleteHall(theater, hall.name);
        });

        hallDiv.appendChild(hallBtn);
        hallDiv.appendChild(deleteBtn);
        hallsList.appendChild(hallDiv);
    });
}

function deleteHall(theater, hallName) {
    let halls = JSON.parse(localStorage.getItem(theater)) || [];
    halls = halls.filter(hall => hall.name !== hallName);
    localStorage.setItem(theater, JSON.stringify(halls));
    loadHalls(theater, document.getElementById('halls-list'));
}

function setupCreateHallPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const theater = urlParams.get('theater');
    document.getElementById('theater-name').value = theater;

    document.getElementById('has-gallery').addEventListener('change', function () {
        document.getElementById('gallery-section').style.display = this.checked ? 'block' : 'none';
    });

    document.getElementById('diff-seats-hall').addEventListener('change', function () {
        document.getElementById('hall-seats-table').style.display = this.checked ? 'block' : 'none';
        if (this.checked) {
            createSeatsTable('hall');
        } else {
            document.getElementById('hall-seats-table').innerHTML = '';
        }
    });

    document.getElementById('num-galleries').addEventListener('input', function () {
        createGallerySections(this.value);
    });

    document.getElementById('save-hall-btn').addEventListener('click', () => {
        saveHall(theater);
    });
}

function createSeatsTable(section) {
    const numRows = document.getElementById('num-rows').value;
    let table = document.createElement('table');
    for (let i = 0; i < numRows; i++) {
        let row = table.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerHTML = `Row ${i + 1}`;
        let input = document.createElement('input');
        input.type = 'number';
        cell2.appendChild(input);
    }
    document.getElementById(`${section}-seats-table`).appendChild(table);
}

function createGallerySections(numGalleries) {
    const galleriesDetails = document.getElementById('galleries-details');
    galleriesDetails.innerHTML = '';

    for (let i = 1; i <= numGalleries; i++) {
        const galleryDiv = document.createElement('div');
        galleryDiv.classList.add('gallery-section');

        const numRowsLabel = document.createElement('label');
        numRowsLabel.innerText = `Number of Rows in Gallery ${i}:`;
        const numRowsInput = document.createElement('input');
        numRowsInput.type = 'number';
        numRowsInput.id = `num-rows-gallery-${i}`;

        const seatsPerRowLabel = document.createElement('label');
        seatsPerRowLabel.innerText = `Number of Seats per Row in Gallery ${i}:`;
        const seatsPerRowInput = document.createElement('input');
        seatsPerRowInput.type = 'number';
        seatsPerRowInput.id = `seats-per-row-gallery-${i}`;

        const diffSeatsCheckbox = document.createElement('input');
        diffSeatsCheckbox.type = 'checkbox';
        diffSeatsCheckbox.id = `diff-seats-gallery-${i}`;
        const diffSeatsLabel = document.createElement('label');
        diffSeatsLabel.innerText = `Each row has a different number of seats`;

        const seatsTableDiv = document.createElement('div');
        seatsTableDiv.id = `gallery-seats-table-${i}`;
        seatsTableDiv.style.display = 'none';

        diffSeatsCheckbox.addEventListener('change', function () {
            seatsTableDiv.style.display = this.checked ? 'block' : 'none';
            if (this.checked) {
                createSeatsTableForGallery(i, numRowsInput.value);
            } else {
                seatsTableDiv.innerHTML = '';
            }
        });

        numRowsInput.addEventListener('input', function () {
            if (diffSeatsCheckbox.checked) {
                createSeatsTableForGallery(i, this.value);
            }
        });

        galleryDiv.appendChild(numRowsLabel);
        galleryDiv.appendChild(numRowsInput);
        galleryDiv.appendChild(seatsPerRowLabel);
        galleryDiv.appendChild(seatsPerRowInput);
        galleryDiv.appendChild(diffSeatsCheckbox);
        galleryDiv.appendChild(diffSeatsLabel);
        galleryDiv.appendChild(seatsTableDiv);

        galleriesDetails.appendChild(galleryDiv);
    }
}

function createSeatsTableForGallery(galleryIndex, numRows) {
    const seatsTableDiv = document.getElementById(`gallery-seats-table-${galleryIndex}`);
    seatsTableDiv.innerHTML = '';

    let table = document.createElement('table');
    for (let i = 0; i < numRows; i++) {
        let row = table.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerHTML = `Row ${i + 1}`;
        let input = document.createElement('input');
        input.type = 'number';
        cell2.appendChild(input);
    }
    seatsTableDiv.appendChild(table);
}

function saveHall(theater) {
    const hallName = document.getElementById('hall-name').value;
    const numRows = document.getElementById('num-rows').value;
    const seatsPerRow = document.getElementById('seats-per-row').value;
    const hallData = {
        name: hallName,
        rows: [],
        galleries: []
    };

    if (document.getElementById('diff-seats-hall').checked) {
        const hallTable = document.querySelector('#hall-seats-table table');
        for (let i = 0; i < hallTable.rows.length; i++) {
            const seats = hallTable.rows[i].cells[1].querySelector('input').value;
            hallData.rows.push({ seats });
        }
    } else {
        for (let i = 0; i < numRows; i++) {
            hallData.rows.push({ seats: seatsPerRow });
        }
    }

    if (document.getElementById('has-gallery').checked) {
        const numGalleries = document.getElementById('num-galleries').value;
        for (let i = 1; i <= numGalleries; i++) {
            const galleryRows = document.getElementById(`num-rows-gallery-${i}`).value;
            const gallerySeatsPerRow = document.getElementById(`seats-per-row-gallery-${i}`).value;
            const gallery = { name: `Gallery ${i}`, rows: [] };

            if (document.getElementById(`diff-seats-gallery-${i}`).checked) {
                const galleryTable = document.querySelector(`#gallery-seats-table-${i} table`);
                for (let j = 0; j < galleryTable.rows.length; j++) {
                    const seats = galleryTable.rows[j].cells[1].querySelector('input').value;
                    gallery.rows.push({ seats });
                }
            } else {
                for (let j = 0; j < galleryRows; j++) {
                    gallery.rows.push({ seats: gallerySeatsPerRow });
                }
            }
            hallData.galleries.push(gallery);
        }
    }

    let halls = JSON.parse(localStorage.getItem(theater)) || [];
    halls.push(hallData);
    localStorage.setItem(theater, JSON.stringify(halls));

    location.href = `${theater}.html`;
}

function setupHallPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const theater = urlParams.get('theater');
    const hallName = urlParams.get('name');
    let halls = JSON.parse(localStorage.getItem(theater));
    let hall = halls.find(h => h.name === hallName);

    document.getElementById('hall-title').textContent = hall.name;

    let hallGraphic = document.getElementById('hall-graphic');
    hall.rows.forEach(row => {
        let rowUl = document.createElement('ul');
        rowUl.className = 'row';
        for (let i = 0; i < row.seats; i++) {
            let seatLi = document.createElement('li');
            seatLi.className = 'seat';
            rowUl.appendChild(seatLi);
        }
        hallGraphic.appendChild(rowUl);
    });

    if (hall.galleries) {
        hall.galleries.forEach(gallery => {
            let emptyLine = document.createElement('ul');
            emptyLine.className = 'row';
            emptyLine.style.visibility = 'hidden';
            hallGraphic.appendChild(emptyLine);

            gallery.rows.forEach(row => {
                let rowUl = document.createElement('ul');
                rowUl.className = 'row';
                for (let i = 0; i < row.seats; i++) {
                    let seatLi = document.createElement('li');
                    seatLi.className = 'seat';
                    rowUl.appendChild(seatLi);
                }
                hallGraphic.appendChild(rowUl);
            });
        });
    }

    document.getElementById('lighting-sound-btn').addEventListener('click', () => {
        document.querySelectorAll('.seat').forEach(seat => {
            seat.addEventListener('click', () => {
                seat.classList.toggle('lighting-sound');
            });
        });
    });

    document.getElementById('add-seats-btn').addEventListener('click', () => {
        document.querySelectorAll('.seat').forEach(seat => {
            seat.addEventListener('click', () => {
                seat.classList.add('occupied');
            });
        });
    });

    document.getElementById('remove-seats-btn').addEventListener('click', () => {
        document.querySelectorAll('.seat.occupied').forEach(seat => {
            seat.addEventListener('click', () => {
                seat.classList.remove('occupied');
            });
        });
    });

    document.getElementById('edit-hall-btn').addEventListener('click', () => {
        enterEditMode(hallGraphic);
    });
}

function enterEditMode(hallGraphic) {
    document.querySelectorAll('.seat').forEach(seat => seat.removeEventListener('click', toggleOccupied));

    document.querySelectorAll('.row').forEach(row => {
        row.classList.add('edit-row');
        let arrowLeft = document.createElement('div');
        arrowLeft.className = 'arrow-left';
        arrowLeft.innerHTML = '←';
        arrowLeft.addEventListener('mousedown', (e) => dragRow(e, row, 'left'));

        let arrowRight = document.createElement('div');
        arrowRight.className = 'arrow-right';
        arrowRight.innerHTML = '→';
        arrowRight.addEventListener('mousedown', (e) => dragRow(e, row, 'right'));

        let handle = document.createElement('div');
        handle.className = 'handle';
        handle.addEventListener('mousedown', (e) => dragCurve(e, row));

        row.appendChild(arrowLeft);
        row.appendChild(arrowRight);
        row.appendChild(handle);
    });

    let saveBtn = document.createElement('button');
    saveBtn.id = 'save-edit-btn';
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => saveEditMode(hallGraphic));
    document.body.appendChild(saveBtn);
}

function saveEditMode(hallGraphic) {
    document.querySelectorAll('.arrow-left, .arrow-right, .handle').forEach(elem => elem.remove());
    document.querySelectorAll('.row').forEach(row => row.classList.remove('edit-row'));

    document.getElementById('save-edit-btn').remove();

    document.querySelectorAll('.seat').forEach(seat => seat.addEventListener('click', toggleOccupied));
}

function toggleOccupied() {
    this.classList.toggle('occupied');
}

function dragRow(e, row, direction) {
    // Implement row dragging logic
}

function dragCurve(e, row) {
    // Implement row curving logic
}
