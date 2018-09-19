
const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(
  cors(),
  bodyParser.json(),
  express.static('build'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))


app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then((people) => {
      res.json(people.map(Person.format))
    })
})

app.get('/info', (req, res) => {
  Person
    .countDocuments({})
    .then((count) => {
      res.send(`puhelinluettelossa on ${count} henkilön tiedot`
                + `</br>${new Date()}`)
    })
    .catch((error) => {
      console.log(error)
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(Person.format(person))
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (body.name === undefined) {
    return res.status(400).json({ error: 'missing name' })
  }
  if (body.number === undefined) {
    return res.status(400).json({ error: 'missing number' })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  Person
    .find({ name: person.name })
    .then((result) => {
      if (result.length > 0) {
        res.status(409).json({ error: 'name already in use' })
      } else {
        person
          .save()
          .then((savedPerson) => {
            res.json(Person.format(savedPerson))
          }).catch((error) => {
            console.log(error)
          })
      }
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person
    .findOneAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(Person.format(updatedPerson))
    })
    .catch((error) => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
