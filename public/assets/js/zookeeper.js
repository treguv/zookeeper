const { response } = require("express");

const $displayArea = document.querySelector("#display-area");
const $zookeeperForm = document.querySelector("#zookeeper-form");
const printResults = (resultArr) => {
  console.log(resultArr);

  const animalHTML = resultArr.map(({ id, name, age, favoriteAnimal }) => {
    return `
  <div class="col-12 col-md-5 mb-3">
    <div class="card p-3" data-id=${id}>
      <h4 class="text-primary">${name}</h4>
      <p>Age: ${age}<br/>
      Favorite Animal: ${
        favoriteAnimal.substring(0, 1).toUpperCase() +
        favoriteAnimal.substring(1)
      }<br/>
      </p>
    </div>
  </div>
    `;
  });

  $displayArea.innerHTML = animalHTML.join("");
};

const getZookeepers = () => {
  fetch("/api/zookeepers")
    .then((response) => {
      if (!response.ok) {
        return alert("Error: " + response.statusText);
      }
      return response.json();
    })
    .then((zookeeperArr) => {
      console.log(zookeeperArr);
      printResults(zookeeperArr);
    });
};

const handleZookeeperFormSubmit = (event) => {
  event.preventDefault();

  // get zookeeper data and organize it
  const name = $zookeeperForm.querySelector('[name="zookeeper-name"]').value;
  const age = parseInt($zookeeperForm.querySelector('[name="age"]').value);
  const favoriteAnimal = $zookeeperForm.querySelector(
    '[name="favorite-animal"]'
  ).value;

  const zookeeperObj = { name, age, favoriteAnimal };
  console.log(zookeeperObj);
  fetch("api/zookeepers", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(zookeeperObj),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      alert("Error: " + response.statusText);
    })
    .then((postResponse) => {
      console.log(postResponse);
      alert("Thank you for adding a zookeeper!");
    });
};
$zookeeperForm.addEventListener("submit", handleZookeeperFormSubmit);

getZookeepers();
