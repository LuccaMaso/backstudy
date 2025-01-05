require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Person = require("./mongo");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:", request.path);
  console.log("Body:", request.body);
  console.log("---");
  next();
};

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    if (error.errors.name) {
      return response.status(400).send({ error: error.errors.name.message });
    }
    if (error.errors.number) {
      return response.status(400).send({ error: error.errors.number.message });
    }
  }

  next(error);
};

let persons = [];

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => response.json(people));
});

app.get("/info", (request, response) => {
  const today = String(new Date());
  response.send(`Phonebook has info for ${persons.length} people</br>${today}`);
});

app.get("/api/persons/:id", (request, response, next) => {
  const { id } = request.params;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response) => {
  const { id } = request.params;
  Person.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;
  const newPerson = new Person({
    name: name,
    number: number,
  });

  const error = newPerson.validateSync();
  if (error) {
    next(error);
  }

  newPerson
    .save()
    .then((answer) => response.json(answer))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { id } = request.params;
  const body = request.body;
  const newPerson = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(id, newPerson, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((answer) => {
      response.json(answer);
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log("Rodando no port 3002"));
