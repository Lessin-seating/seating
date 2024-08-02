document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('create-hall-btn')) {
        loadHomePage();
    }

    if (document.getElementById('save-hall-btn')) {
        setupCreateHallPage();
    }

    if (document.getElementById('hall-title')) {
        setupHallPage();
    }
});

function loadHomePage() {
    let halls = JSON.parse(localStorage.getItem('halls')) || [];
    let hallsList = document.getElementById('halls-list');

    halls.forEach(hall => {
        let hallBtn = document.createElement('button');
        hallBtn.textContent = hall.name;
        hallBtn.addEventListener('click', () => {
            location.href = `hall-template.html?name=${hall.name}`;
        });
        hallsList.appendChild(hallBtn);
    });
}

function setupCreateHallPage() {
    document.getElementById('has-stand').addEventListener('change', function () {
        document.getElementById('stand-section').style.display = this.checked ? 'block' : 'none';
    });

    document.getElementById('diff-seats-hall').addEventListener('change', function () {
        document.getElementById('hall-seats-table').style.display = this.checked ? 'block' : 'none';
        if (this.checked) {
            createSeatsTable('hall');
        }
    });

    document.getElementById('num-stands').addEventListener('input', function () {
        createStandSections(this.value);
    });

    document.getElementById('save-hall-btn').addEventListener('click', () => {
        const hallName = document.getElementById('hall-name').value;
        const numRows = document.getElementById('num-rows').value;
        const seatsPerRow = document.getElementById('seats-per-row').value;

        saveHall(hallName, numRows, seatsPerRow);
    });
}

function createSeatsTable(section) {
    let numRows = document.getElementById('num-rows').value;
    let table = document.createElement('table');
    for (let i = 1; i <= numRows; i++) {
        let row = table.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerHTML = `Row ${i}`;
        let input = document.createElement('input');
        input.type = 'number';
        cell2.appendChild(input);
    }
    document.getElementById(`${section}-seats-table`).appendChild(table);
}

function createStandSections(numStands) {
    const standsDetails = document.getElementById('stands-details');
    standsDetails.innerHTML = '';

    for (let i = 1; i <= numStands; i++) {
        const standDiv = document.createElement('div');
        standDiv.classList.add('stand-section');

        const standNameLabel = document.createElement('label');
        standNameLabel.innerText = `Stand ${i} Name:`;
        const standNameInput = document.createElement('input');
        standNameInput.type = 'text';
        standNameInput.id = `stand-name-${i}`;
        
        const numRowsLabel = document.createElement('label');
        numRowsLabel.innerText = `Number of Rows in Stand ${i}:`;
        const numRowsInput = document.createElement('input');
        numRowsInput.type = 'number';
        numRowsInput.id = `num-rows-stand-${i}`;

        const seatsPerRowLabel = document.createElement('label');
        seatsPerRowLabel.innerText = `Number of Seats per Row in Stand ${i}:`;
        const seatsPerRowInput = document.createElement('input');
        seatsPerRowInput.type = 'number';
        seatsPerRowInput.id = `seats-per-row-stand-${i}`;

        const diffSeatsCheckbox = document.createElement('input');
        diffSeatsCheckbox.type = 'checkbox';
        diffSeatsCheckbox.id = `diff-seats-stand-${i}`;
        const diffSeatsLabel = document.createElement('label');
        diffSeatsLabel.innerText = `Each row has a different number of seats`;

        const seatsTableDiv = document.createElement('div');
        seatsTableDiv.id = `stand-seats-table-${i}`;
        seatsTableDiv.style.display = 'none';

        diffSeatsCheckbox.addEventListener('change', function () {
            seatsTableDiv.style.display = this.checked ? 'block' : 'none';
            if (this.checked) {
                createSeatsTableForStand(i, numRowsInput.value);
            }
        });

        numRowsInput.addEventListener('input', function () {
            if (diffSeatsCheckbox.checked) {
                createSeatsTableForStand(i, this.value);
            }
        });

        standDiv.appendChild(standNameLabel);
        standDiv.appendChild(standNameInput);
        standDiv.appendChild(numRowsLabel);
        standDiv.appendChild(numRowsInput);
        standDiv.appendChild(seatsPerRowLabel);
        standDiv.appendChild(seatsPerRowInput);
        standDiv.appendChild(diffSeatsCheckbox);
        standDiv.appendChild(diffSeatsLabel);
        standDiv.appendChild(seatsTableDiv);

        standsDetails.appendChild(standDiv);
    }
}

function createSeatsTableForStand(standIndex, numRows) {
    const seatsTableDiv = document.getElementById(`stand-seats-table-${standIndex}`);
    seatsTableDiv.innerHTML = '';

    let table = document.createElement('table');
    for (let i = 1; i <= numRows; i++) {
        let row = table.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerHTML = `Row ${i}`;
        let input = document.createElement('input');
        input.type = 'number';
        cell2.appendChild(input);
    }
    seatsTableDiv.appendChild(table);
}

function saveHall(hallName, numRows, seatsPerRow) {
    let hall = {
        name: hallName,
        rows: [],
        stands: []
    };

    for (let i = 1; i <= numRows; i++) {
        hall.rows.push({ seats: seatsPerRow });
    }

    if (document.getElementById('has-stand').checked) {
        const numStands = document.getElementById('num-stands').value;
        for (let i = 1; i <= numStands; i++) {
            let standName = document.getElementById(`stand-name-${i}`).value;
            let standRows = document.getElementById(`num-rows-stand-${i}`).value;
            let standSeatsPerRow = document.getElementById(`seats-per-row-stand-${i}`).value;
            let stand = { name: standName, rows: [] };

            if (document.getElementById(`diff-seats-stand-${i}`).checked) {
                let table = document.querySelector(`#stand-seats-table-${i} table`);
                for (let j = 0; j < table.rows.length; j++) {
                    let seats = table.rows[j].cells[1].querySelector('input').value;
                    stand.rows.push({ seats });
                }
            } else {
                for (let j = 1; j <= standRows; j++) {
                    stand.rows.push({ seats: standSeatsPerRow });
                }
            }
            hall.stands.push(stand);
        }
    }

    let halls = JSON.parse(localStorage.getItem('halls')) || [];
    halls.push(hall);
    localStorage.setItem('halls', JSON.stringify(halls));

    location.href = 'index.html';
}

function setupHallPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const hallName = urlParams.get('name');
    let hall = JSON.parse(localStorage.getItem('halls')).find(h => h.name === hallName);

    document.getElementById('hall-title').textContent = hall.name;

    let hallGraphic = document.getElementById('hall-graphic');
    hall.rows.forEach((row, rowIndex) => {
        let rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        for (let i = 0; i < row.seats; i++) {
            let seat = document.createElement('li');
            seat.className = 'seat';
            seat.addEventListener('click', () => {
                seat.classList.toggle('occupied');
            });
            rowDiv.appendChild(seat);
        }
        hallGraphic.appendChild(rowDiv);
    });

    if (hall.stands) {
        hall.stands.forEach((stand, standIndex) => {
            let emptyLine = document.createElement('div');
            emptyLine.className = 'row';
            emptyLine.style.visibility = 'hidden';
            hallGraphic.appendChild(emptyLine);

            stand.rows.forEach(row => {
                let rowDiv = document.createElement('div');
                rowDiv.className = 'row';
                for (let i = 0; i < row.seats; i++) {
                    let seat = document.createElement('li');
                    seat.className = 'seat';
                    seat.addEventListener('click', () => {
                        seat.classList.toggle('occupied');
                    });
                    rowDiv.appendChild(seat);
                }
                hallGraphic.appendChild(rowDiv);
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
