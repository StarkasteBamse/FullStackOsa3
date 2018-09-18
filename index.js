const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors')
const Person = require('./models/person')

app.use(
    cors(),
    bodyParser.json(),
    express.static('build')
);

morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'));

let persons = [
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Matti Tienari', number: '040-123456', id: 2 },
    { name: 'Arto Järvinen', number: '040-123456', id: 3 },
    { name: 'Lea Kutvonen', number: '040-123456', id: 4 }
];

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(people => {
            res.json(people.map(Person.format))
        });
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

app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (body.name === undefined) {
        return res.status(400).json({ error: 'missing name' });
    };
    if (body.number === undefined) {
        return res.status(400).json({ error: 'missing number' });
    };
    const person = new Person({
        name: body.name,
        number: body.number
    });

    person
        .save()
        .then(savedPerson => {
            res.json(Person.format(savedPerson));
        }).catch(error => {
            console.log(error);
        });
    
    
    /*
    if (persons.find(person => person.name === req.body.name)) {
        return res.status(400).json({ error: 'name must be unique' });
    };
    const id = Math.floor(Math.random() * Math.floor(1000000));
    const person = {
        name: req.body.name,
        number: req.body.number,
        id: id
    };

    persons = persons.concat(person)

    res.json(person);
    */
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});