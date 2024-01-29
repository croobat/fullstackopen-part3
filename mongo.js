const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://tony:${password}@cluster0.ajenvwu.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

// if only password is given, print all persons in phonebook
if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  // if name and number are given, create a new person
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    console.log(result);
    mongoose.connection.close();
  });
}
