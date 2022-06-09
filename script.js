//I will be working on nutrition facts spoonacular
const form = document.getElementById("recipe-search");
const baseUrl =
  "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?";

const nutritionUrl =
  "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/";

const featureColours = {
  vegetarian: "#BEBEB0",
  vegan: "#00FF00",
  glutenFree: "#F563B1",
  dairyFree: "#F04F3F",
  veryHealthy: "#C8B76F",
  cheap: "#8574FF",
  veryPopular: "#55ACFF",
  sustainable: "#CDBC72",
  weightWatcherSmartPoints: "#8874FF",
  gaps: "#A75545",
  lowFodmap: "#BFCE20",
  aggregateLikes: "#C2C1D4",
  spoonacularScore: "#9D9AD5",
  healthScore: "#FDE03E",
  pricePerServing: "#C4C2DA",
};

// creates the pills for badge elements using template strings
function createFeatureBadges(data) {
  let initial = "";
  for (const [key, value] of Object.entries(data)) {
    if (value === true) {
      console.log(value);
      initial += `<span class='badge badge-pill badge-primary increase-size mx-1' style="background-color: ${featureColours[key]};">${key}</span>`;
    }
  }
  return initial;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  getRecipeData();
});

// create request URL function & assigns to baseUrl variable
let requestUrl = function () {
  const tags = document.getElementById("tags");
  const paramString = tags.value.replace(/ /g, "%20");

  const recipeNum = document.getElementById("amount");
  const amount = recipeNum.value;

  return baseUrl + "tags=" + paramString + "&number=" + amount;
};

function getRecipeData() {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      "X-RapidAPI-Key": "55b014b399msh167c3c730f66388p11fe0ejsn4b96d22e62bd"
    },
  };

  fetch(requestUrl(), options)
    .then((response) => response.json())
    .then((data) => createCards(data))
    .catch((error) => console.error(error))
    .finally(() => ((tags.value = ""), (amount.value = ""))); // clears input fields after search
}

//fetch nutition facts
function getRecipeNutrition(id) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      "X-RapidAPI-Key": "55b014b399msh167c3c730f66388p11fe0ejsn4b96d22e62bd",
    },
  };
  // let requestNutritionUrl = nutritionUrl + id+'/nutritionWidget.json';
  let requestNutritionUrl =
    nutritionUrl + id + "/information?includeNutrition=true";
  fetch(requestNutritionUrl, options)
    .then((response) => response.json())
    .then((nutritionData) => {
      console.log(nutritionData); // testing the data
      populateNutritionFacts(nutritionData);
    })
    .catch((err) => {
      console.error(err);
      handleError(err);
    });
}

//Fill the Nutrition Facts Widge
function populateNutritionFacts(nutritionData) {
  document.querySelector(".nutrition").innerHTML =
    "<div>" +
    "QuickView: " +
    '<span class="badge badge-secondary">' +
    nutritionData.nutrition.nutrients[0]["amount"] +
    "kcal" +
    "</span>" +
    "<span> </span>" +
    '<span class="badge badge-secondary"> ' +
    nutritionData.nutrition.nutrients[3]["amount"] +
    "g Carbs </span>" +
    "<span> </span>" +
    '<span class="badge badge-secondary"> ' +
    nutritionData.nutrition.nutrients[1]["amount"] +
    " g </span>" +
    "<span> </span>" +
    '<span class="badge badge-secondary"> ' +
    nutritionData.healthScore +
    " Health Score </span>" +
    "</div>";
}

// create error handlinng function
function handleError(error) {
  console.log(error.message);
  document.getElementById(
    "main-section"
  ).innerHTML = `<p style='color: red'>Something went wrong, try again</p>`;
}

let recipeArr = {};
const btnGoBack = document.getElementById("back-btn");
// create cards generator function
function createCards(data) {
  recipeArr = data;
  const cardsContainer = document.getElementById("cards-container");
  cardsContainer.innerHTML = ""; // clean all previous cards
  cardsContainer.className =
    "d-flex justify-content-center row row-cols-sm-1 row-cols-md-2 row-cols-lg-4"; // adds classes back when doing additional searches
  for (i in data.recipes) {
    console.log("in loop checking", this);
    const recipe = data.recipes[i]; // pass populateData function the full recipe[i] object
    const { title, image } = data.recipes[i];
    document.getElementById("cards-container").innerHTML += `
    <div class="cards col my-4">
      <div class="card border-dark h-100">
      <div class="card-header" mb-2>${title}</div>
      <img src=${image} class="thumbnail card-img-top" alt="recipe image" />
      <div class="card-body d-flex justify-content-center ">
        <button class="more-details btn btn-outline-success" type="button">More Details</button>
      </div>
    </div>
    `;
  }
  // event listeners for creating more-details layout
  // user can click either 'more-details' or the thumbnail img
  const btns = document.querySelectorAll(".more-details");
  const thumbnails = document.querySelectorAll(".thumbnail");
  for (i in data.recipes) {
    const recipe = data.recipes[i];
    btns[i].addEventListener("click", (event) => {
      populateData(recipe);
    });

    thumbnails[i].addEventListener("click", (event) => {
      populateData(recipe);
    });
  }
}

// document.getElementById('main-section').style.display = "none";
// const recipeImage = document.getElementById('recipe-img');
// // If no recipe image present, hide the parent div from DOM
// if (recipeImage.src === '') {
//   recipeImage.parentElement.style.display = 'none';
// }

/* populate divs with the data from the recipes object
 * reset any pre-existing when ran again
 *
 */

function populateData(data) {
  console.log("You clicked the button!:");
  // recipeImage.parentElement.style.display = ''; // remove the style="none" for containing div when we pass img element an image
  document.getElementById("main-section").style.display = "block";

  const {
    id, // to access the nutritin fact for this particilar recipe
    image,
    title,
    instructions,
    summary: recipeSummary,
    extendedIngredients: ingredients,
  } = data; // destructure data

  document.getElementById("cards-container").className = ""; // reset class list for the new layout
  document.getElementById("cards-container").innerHTML = `
  <h1 id="recipe-name" style="text-align: center"></h1>
  <div id="feature-badges"></div>
  <div class="image-container">
    <img id="recipe-img" width="300" height="300" />
  </div>
  <div class="information">
    <div class="info-item-container">
      <h2 id="summary-title"></h2>
      <div class="summary"></div>
    </div>
    <div class="info-item-container">
      <h2 id="ingredient-title"></h2>
      <div class="ingredients"></div>
    </div>
    <div class="info-item-container">
      <h2 id="instruction-title"></h2>
      <div class="instructions"></div>
    </div>
    <div class="info-item-container">
    <h2 id="nutrition-title"></h2>
    <div class="nutrition"></div>
  </div>
  </div>
  `;

  const ingredientsDiv = document.querySelector(".ingredients");

  // Clears previous text if the ingredientsDiv already contains text (list items)
  // if (ingredientsDiv.innerText !== '') {
  //   ingredientsDiv.innerText = '';
  // }

  document.getElementById("recipe-img").src = image;
  document.getElementById("recipe-name").innerText = title;
  document.getElementById("summary-title").innerText = "Summary";
  //Adds badges for recipe features
  document.getElementById("feature-badges").innerHTML = `${createFeatureBadges(
    data
  )}`;
  document.querySelector(".summary").innerHTML = recipeSummary;
  document.getElementById("instruction-title").innerText =
    "Cooking Instructions";
  document.querySelector(".instructions").innerHTML = instructions;
  // recipeImage.src = image;

  document.getElementById("ingredient-title").innerText = "Ingredients";
  // Add each ingredient into the ingredientsDiv DOM div
  const ul = document.createElement("ul");
  ingredientsDiv.appendChild(ul);

  ingredients.forEach((ingredient) => {
    const li = document.createElement("li");
    li.innerText = ingredient.original;
    ul.appendChild(li);
  });

  //add nutrition Widget to the recipe

  document.getElementById("nutrition-title").innerText = "Nutrition Facts";
  document.querySelector(".nutrition").innerHTML = getRecipeNutrition(id);

  //Event listner for go back to cards
  btnGoBack.addEventListener("click", (event) => {
    createCards(recipeArr);
  });
}
