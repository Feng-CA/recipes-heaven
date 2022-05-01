const form = document.getElementById('recipe-search');
const baseUrl =
  'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?';

const featureColours = {
  vegetarian: '#BEBEB0',
  vegan: '#00FF00',
  glutenFree: '#F563B1',
  dairyFree: '#F04F3F',
  veryHealthy: '#C8B76F',
  cheap: '#8574FF',
  veryPopular: '#55ACFF',
  sustainable: '#CDBC72',
  weightWatcherSmartPoints: '#8874FF',
  gaps: '#A75545',
  lowFodmap: '#BFCE20',
  aggregateLikes: '#C2C1D4',
  spoonacularScore: '#9D9AD5',
  healthScore: '#FDE03E',
  pricePerServing: '#C4C2DA',
};

// creates the pills for badge elements using template strings
function createFeatureBadges(data) {
  let initial = '';
  for (const [key, value] of Object.entries(data)) {
    if (value === true) {
      console.log(value);
      initial += `<span class='badge badge-pill badge-primary increase-size' style= "background-color: ${featureColours[key]};">${key}</span>`;
    }
  }
  return initial;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  getRecipeData();
});

// create request URL function & assigns to baseUrl variable
let requestUrl = function () {
  const tags = document.getElementById('tags');
  const paramString = tags.value.replace(/ /g, '%20');

  const recipeNum = document.getElementById('amount');
  const amount = recipeNum.value;

  return baseUrl + 'tags=' + paramString + '&number=' + amount;
};

function getRecipeData() {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
      'X-RapidAPI-Key': '95bf4e37b4mshe8cb692a716b2e3p190df5jsnb5e4f313f0e0',
    },
  };

  fetch(requestUrl(), options)
    .then((response) => response.json())
    .then((data) => createCards(data))
    .finally(() => ((tags.value = ''), (amount.value = ''))); // clears input fields after search
}

// create error handlinng function
function handleError(error) {
  console.log(error.message);
  document.getElementById(
    'main-section'
  ).innerHTML = `<p style='color: red'>Something went wrong, try again</p>`;
}

// create cards generator function
function createCards(data) {
  document.getElementById('cards-container').innerHTML = ''; // clean all previous cards

  for (i in data.recipes) {
    const recipe = data.recipes[i]; // pass populateData function the full recipe[i] object
    const { title, image } = data.recipes[i];
    document.getElementById('cards-container').innerHTML += `
    <div class="cards col mb-4">
      <div class="card border-dark h-100">
      <div class="card-header" mb-2>${title}</div>
      <img src=${image} class="thumbnail card-img-top" alt="recipe image" />
      <div class="card-body d-flex justify-content-center ">
        <button class="more-details btn btn-outline-success" type="button">More Details</button>
      </div>
    </div>
    `;

    // create card details function
    document
      .querySelector('.more-details')
      .addEventListener('click', (event) => {
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
  console.log('You clicked the button!:');
  console.log(data);
  // recipeImage.parentElement.style.display = ''; // remove the style="none" for containing div when we pass img element an image
  document.getElementById('main-section').style.display = 'block';

  const {
    image,
    title,
    instructions,
    summary: recipeSummary,
    extendedIngredients: ingredients,
  } = data; // destructure data

  document.getElementById('cards-container').className = ''; // reset class list for the new layout
  document.getElementById('cards-container').innerHTML = `
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
  </div>
  `;

  const ingredientsDiv = document.querySelector('.ingredients');

  // Clears previous text if the ingredientsDiv already contains text (list items)
  // if (ingredientsDiv.innerText !== '') {
  //   ingredientsDiv.innerText = '';
  // }

  document.getElementById('recipe-img').src = image;
  document.getElementById('recipe-name').innerText = title;
  document.getElementById('summary-title').innerText = 'Summary';
  //Adds badges for recipe features
  document.getElementById('feature-badges').innerHTML = `${createFeatureBadges(
    data
  )}`;
  document.querySelector('.summary').innerHTML = recipeSummary;
  document.getElementById('instruction-title').innerText =
    'Cooking Instructions';
  document.querySelector('.instructions').innerHTML = instructions;
  // recipeImage.src = image;

  document.getElementById('ingredient-title').innerText = 'Ingredients';
  // Add each ingredient into the ingredientsDiv DOM div
  const ul = document.createElement('ul');
  ingredientsDiv.appendChild(ul);

  ingredients.forEach((ingredient) => {
    const li = document.createElement('li');
    li.innerText = ingredient.original;
    ul.appendChild(li);
  });
}
