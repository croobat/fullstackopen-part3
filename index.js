require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const Person = require('./models/person');

morgan.token('person', (req, _) => (req.method === 'POST' ? JSON.stringify(req.body) : ''));

const errorHandler = (error, _, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(express.static('dist'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'));
app.use(cors());
app.use(errorHandler);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/info', (_, res, next) => {
  Person.find({})
    .then((persons) => {
      const date = new Date();
      res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`);
    })
    .catch((error) => next(error));
});

app.get('/api/persons', (_, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({
      error: 'body missing',
    });
  }

  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: `content missing: ${body.name ? 'number' : 'name'}`,
    });
  }

  // ignore this check for now
  // if (persons.find((person) => person.name === body.name)) {
  //   return res.status(400).json({
  //     error: 'name must be unique',
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((_) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
