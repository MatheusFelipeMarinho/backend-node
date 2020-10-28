const express = require("express");
//const { uuid, isUuid } = require('uuidv4');
const { v4: uuid, validate: isUuid } = require('uuid');
const cors = require("cors");


// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validarUuid (request, response, next){
  const {id} = request.params;

  if (isUuid(id)){
    next();
  } else {
    return response.status(400).json({error: "Invalid repository ID."})
   }
}

app.use('/repositories/:id', validarUuid);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  
  if (repositoryIndex === -1){
    return response.status(400).json({error:"repository not found"})
  }

  repository = {
    ...repositories[repositoryIndex],
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  }
    
  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  
  if (repositoryIndex >= 0){
    repositories.splice(repositoryIndex, 1);
  } else {
    return response.status(400).json({error: "Repository not exists."})
  }
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex === -1){
    return response.status(400).json({error: "Repository not exists."});
  }

  repositories[repositoryIndex].likes += 1;
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;