const express = require("express");
const app = express();
const cors = require("cors");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:", request.path);
  console.log("Body:", request.body);
  console.log("---");
  next();
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Ainda estou aqui</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const today = String(new Date());
  response.send(`Phonebook has info for ${persons.length} people</br>${today}`);
});

app.get("/api/persons/:id", (request, response) => {
  const { id } = request.params;
  const person = persons.find((people) => people.id === id);
  if (person) {
    response.json(person);
  }
  response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const { id } = request.params;
  deletedUser = persons.find((people) => people.id === id);
  persons = persons.filter((people) => people.id !== id);
  console.log(deletedUser);
  response.json(deletedUser);
});

const newId = () => {
  return Math.floor(Math.random() * 1000);
};

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;
  if (name && number) {
    const newPerson = {
      name: name,
      number: number,
      id: String(newId()),
    };
    persons = persons.concat(newPerson);
    return response.json(newPerson);
  }
  response.status(400).json({
    error: "name or number missing",
  });
});

app.use(unknownEndpoint);

const PORT = 3002;

app.listen(PORT, () => console.log("Rodando no port 3002"));
