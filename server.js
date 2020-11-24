const express = require("express");
const { animals } = require("./data/animals");
//Set up port for Heroku
const PORT = process.env.PORT || 3001;
//instantiate server
const app = express();

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
/*
req.query is multifaceted, 
often combining multiple parameters,
 whereas req.param is specific to a single property, 
 often intended to retrieve a single record.
*/
//tell our server to listen on port 3301
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
});
