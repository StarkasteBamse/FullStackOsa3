require('dotenv').config();
const mongoose = require('mongoose');
const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_NAME}`;
mongoose.connect(url, { useNewUrlParser: true });

const Person = mongoose.model('Person', {
    name: String,
    number: String      
});

if (process.argv.length > 2) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    });

    person
        .save()
        .then(res => {
            console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`);
            mongoose.connection.close();
        });
} else {
    Person
        .find({})
        .then(res => {
            console.log('puhelinluettelo:')
            res.forEach(person => {
                console.log(person.name + " " + person.number)
            });
            mongoose.connection.close();   
        });  
};
