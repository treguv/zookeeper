const fs = require("fs");
const path = require("path");
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
    path.join(__dirname, "../data/animals.json"),
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

module.exports = {
  filterByQuery,
  findById,
  createNewAnimal,
  validateAnimal,
};
