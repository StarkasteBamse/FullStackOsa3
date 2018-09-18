require('dotenv').config();
const mongoose = require('mongoose');
const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_NAME}`;
mongoose.connect(url, { useNewUrlParser: true });

let Schema = mongoose.Schema;

let PeopleSchema = new Schema({
    name: String,
    number: String
});

PeopleSchema.statics.format = function (person) {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
};

const Person = mongoose.model(
    'Person', PeopleSchema
);

module.exports = Person;