const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(bodyParser.json());
app.use(morgan('tiny'));

let persons = [
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Matti Tienari', number: '040-123456', id: 2 },
    { name: 'Arto Järvinen', number: '040-123456', id: 3 },
    { name: 'Lea Kutvonen', number: '040-123456', id: 4 }
];

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    res.send('puhelinluettelossa on ' + persons.length + ' henkilön tiedot'
        + '</br>' + new Date());
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    };
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    
    res.status(204).end();
});

app.post('/api/persons' , (req, res) => {
    if (req.body.name === undefined) {
        return res.status(400).json({error: 'missing name'});
    };
    if (req.body.number === undefined) {
        return res.status(400).json({error: 'missing number'});
    };
    if (persons.find(person => person.name === req.body.name)) {
        return res.status(400).json({error: 'name must be unique'});
    };
    const id = Math.floor(Math.random() * Math.floor(1000000)); 
    const person = {
        name: req.body.name,
        number: req.body.number,
        id: id
    };

    persons = persons.concat(person)

    res.json(person);
});

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});