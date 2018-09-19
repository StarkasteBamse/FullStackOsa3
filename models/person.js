if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true })

const Schema = mongoose.Schema

const PeopleSchema = new Schema({
  name: String,
  number: String,
})

PeopleSchema.statics.format = function (person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id,
  }
}

const Person = mongoose.model(
  'Person', PeopleSchema)

module.exports = Person
