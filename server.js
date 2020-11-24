const express = require("express");
const { animals } = require("./data/animals");

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
//tell our server to listen on port 3301
app.listen(3001, () => {
  console.log(`API server now on port 3001!`);
});
