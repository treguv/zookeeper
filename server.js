const express = require("express");
const { animals } = require("./data/animals");
const fs = require("fs");
const path = require("path");
//Set up port for Heroku
const PORT = process.env.PORT || 3001;
//instantiate server
const app = express();
//These need to be set up any time server is looking to accept post data
//parse incomings string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming json data
app.use(express.json()); //Use puts a functio non our server that our data has to pass through
//For serving static pages
//Public is replaced with the path in server to where all your sttatic stuff is
//THis is another api path
app.use(express.static("public")); // allows the requests for css and such from the main file
//filter responses to be sent based on queries
function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];

  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }

    //Loop through array
    personalityTraitsArray.forEach((trait) => {
      filteredResults = filteredResults.filter(
        (animal) => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  //Filter the array based on the query
  if (query.diet) {
    filteredResults = filteredResults.filter(
      (animal) => animal.diet === query.diet
    );
  }

  if (query.spices) {
    filteredResults = filteredResults.filter(
      (animal) => animal.spices === query.spices
    );
  }

  if (query.name) {
    filteredResults = filteredResults.filter(
      (animal) => animal.name === query.name
    );
  }
  return filteredResults;
}
//filters for the animal with the given id.
function findById(id, animalsArray) {
  const result = animalsArray.filter((animal) => animal.id === id)[0];
  return result;
}

function createNewAnimal(body, animalsArray) {
  //__dir is the path to executed file
  const animal = body;
  animalsArray.push(animal);
  fs.writeFileSync(
    path.join(__dirname, "./data/animals.json"),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  // return finished code to post route for response
  return animal;
}
//Validate the data we recieve
function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== "string") {
    return false;
  }
  if (!animal.species || typeof animal.species !== "string") {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== "string") {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}
//Add a path like we used with external api's
//Route fetching from, callback function when accessed withget requests
app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    console.log("filtering");
    results = filterByQuery(req.query, results);
  }
  res.json(results); //send animals object back as response
});
app.get("/api/animals/:id", (req, res) => {
  //A param route must come after the other GET route.
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

//Serve up index.html
app.get("/", (req, res) => {
  // / is the root directory for the server
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//server up animals.html
app.get("/animals", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/animals.html"));
});
//server up zookeepers.html
app.get("/zookeepers", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/zookeepers.html"));
});
/*
req.query is multifaceted, 
often combining multiple parameters,
 whereas req.param is specific to a single property, 
 often intended to retrieve a single record.
*/

// set up post requests to recieve data
app.post("/api/animals", (req, res) => {
  //req.body is where our incoming content will be
  req.body.id = animals.length.toString();
  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send("The animal is not properly formatted.");
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});
//tell our server to listen on port 3301
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
});
