const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let halls = {};

app.post('/save-hall', (req, res) => {
    const { theater, hall } = req.body;
    if (!halls[theater]) {
        halls[theater] = [];
    }
    halls[theater].push(hall);
    res.send({ message: 'Hall saved successfully!' });
});

app.get('/halls/:theater', (req, res) => {
    const theater = req.params.theater;
    res.send(halls[theater] || []);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
