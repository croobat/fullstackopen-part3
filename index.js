const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

morgan.token('person', (req, _) => req.method === 'POST' ? JSON.stringify(req.body) : '');

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'));
app.use(cors());
app.use(express.static('dist'));

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

app.get('/', (_, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (_, res) => {
  res.send(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/info', (_, res) => {
  const date = new Date();
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    return res.json(person);
  }

  res.status(404).json({ error: 'Person not found' });
});

app.post('/api/persons', (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      error: 'content missing',
    });
  }

  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing',
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    id: Math.floor(Math.random() * 100000000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});
