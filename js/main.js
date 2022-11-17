
var $cancelIcon = document.querySelector('#cancelicon');
var $searchText = document.querySelector('#searchbar');
var $formSubmit = document.querySelector('#form');
var $rowResult = document.querySelector('.result-item');
var $noResults = document.querySelector('.noresults');
var $viewNodes = document.querySelectorAll('.view');
var $searchLink = document.querySelector('.search-link');
var $favoriteLink = document.querySelector('.favorite-link');
var $detailsHeader = document.querySelector('#details-header');
var $detailsImg = document.querySelector('#details-image');
var $detailsKcal = document.querySelector('#details-kcal');
var $detailsProtein = document.querySelector('#details-protein');
var $detailsCarbs = document.querySelector('#details-carbs');
var $detailsFat = document.querySelector('#details-fat');
var $resultsNodes = document.querySelector('.result-item');
var $favoritesNodes = document.querySelector('.favorite-items');
var resultsArray = [];
// var currentIndex = null;
var currentFoodId = '';
var objFavIdMap = {};

// Clear Search Bar
function clearSearch(event) {
  $searchText.value = '';
}
$cancelIcon.addEventListener('click', clearSearch);

// HTTP Request Form Submit Event

function getFoodData(event) {
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.edamam.com/api/food-database/v2/parser?app_id=62e1382f&app_key=fb581bd2de03e8a30b53d8a1a76b8b79&ingr=' + $searchText.value);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (xhr.response.hints.length === 0) {
      $noResults.setAttribute('class', 'row noresults');
    } else {
      resultsArray = [];
      $rowResult.replaceChildren();
      var objIdMap = {};
      var count = 0;
      for (var i = 0; i < xhr.response.hints.length; i++) {
        if (!objIdMap[xhr.response.hints[i].food.foodId]) {
          objIdMap[xhr.response.hints[i].food.foodId] = true;
          resultsArray.push(xhr.response.hints[i]);
          var result = renderResult(xhr.response.hints[i].food);
          result.setAttribute('data-search-index', count++);
          result.setAttribute('data-food-id', xhr.response.hints[i].food.foodId);
          $rowResult.appendChild(result);
        }
      }
      viewSwap('results-page');
      $noResults.setAttribute('class', 'row noresults hidden');
    }
  }
  );
  xhr.send();
  $formSubmit.reset();
}
$formSubmit.addEventListener('submit', getFoodData);

// Render result function

function renderResult(result) {
  var $newDiv = document.createElement('div');
  $newDiv.setAttribute('class', 'column-sixth flex-column');

  var $imageDiv = document.createElement('div');
  $imageDiv.setAttribute('class', 'wrapper');

  var $newImg = document.createElement('img');
  if (result.image !== undefined) {
    $newImg.setAttribute('src', result.image);
  } else {
    $newImg.setAttribute('src', 'images/MacVueIcon.png');
  }

  var $newH4 = document.createElement('h4');
  $newH4.textContent = result.label;

  $newDiv.appendChild($imageDiv);
  $imageDiv.appendChild($newImg);
  $newDiv.appendChild($newH4);

  return $newDiv;
}

// view swapping

function viewSwap(view) {
  for (var i = 0; i < $viewNodes.length; i++) {
    if ($viewNodes[i].getAttribute('data-view') === view) {
      $viewNodes[i].setAttribute('class', 'view container');
    } else {
      $viewNodes[i].setAttribute('class', 'view container hidden');
    }
  }
}

// click link function

function clickFunction(event) {
  var pageView = event.target.getAttribute('data-view');
  viewSwap(pageView);
  $noResults.setAttribute('class', 'row noresults hidden');
  data.view = pageView;
  if (pageView === 'favorites-page') {
    resultsArray = [...data.favorites];
  }
  return resultsArray;
}
$searchLink.addEventListener('click', clickFunction);
$favoriteLink.addEventListener('click', clickFunction);

// view detail click function

function clickDetails(event) {
  if (event.target.tagName === 'IMG' || event.target.tagName === 'H4') {
    var closestDiv = event.target.closest('div.column-sixth');
    for (var j = 0; j < resultsArray.length; j++) {

      if (closestDiv.getAttribute('data-food-id') === resultsArray[j].food.foodId.toString()) {
        if (resultsArray[j].food.image !== undefined) {
          $detailsImg.setAttribute('src', resultsArray[j].food.image);
        } else {
          $detailsImg.setAttribute('src', 'images/MacVueIcon.png');
        }
        currentFoodId = resultsArray[j].food.foodId;
        $detailsHeader.setAttribute('data-search-index', j);
        $detailsHeader.setAttribute('data-food-id', resultsArray[j].food.foodId);
        $detailsHeader.textContent = resultsArray[j].food.label;
        $detailsKcal.textContent = Math.floor(resultsArray[j].food.nutrients.ENERC_KCAL);
        $detailsProtein.textContent = Math.floor(resultsArray[j].food.nutrients.PROCNT);
        $detailsCarbs.textContent = Math.floor(resultsArray[j].food.nutrients.CHOCDF);
        $detailsFat.textContent = Math.floor(resultsArray[j].food.nutrients.FAT);
        if (resultsArray[j].heart === true) {
          heart = true;
          $favoriteIcon.setAttribute('class', 'fa-solid fa-heart');
        } else {
          heart = false;
          $favoriteIcon.setAttribute('class', 'fa-regular fa-heart');
        }
      }
    }
    viewSwap('details-page');
    // return currentFoodId;

  }
}

$resultsNodes.addEventListener('click', clickDetails);
$favoritesNodes.addEventListener('click', clickDetails);

// save/delete favorite function
var $rowFavorite = document.querySelector('.favorite-items');
var $favoriteIcon = document.querySelector('#favoriteicon');
$favoriteIcon.addEventListener('click', favoriteClickFunction);
var heart = true;

function favoriteClickFunction(event) {
  if (heart === true) {
    heart = false;
    $favoriteIcon.setAttribute('class', 'fa-regular fa-heart');
    var $favoritesNodesAll = $favoritesNodes.querySelectorAll('.column-sixth');
    var deleteIndex = $detailsHeader.getAttribute('data-search-index');
    $favoritesNodesAll[deleteIndex].remove();
    data.favorites.splice(deleteIndex, 1);
  } else if (heart === false) {
    // save to local storage

    heart = true;
    var favoriteObject = {
      food: {
        foodId: currentFoodId,
        label: $detailsHeader.textContent,
        image: $detailsImg.src,
        nutrients: {
          CHOCDF: $detailsCarbs.textContent,
          ENERC_KCAL: $detailsKcal.textContent,
          FAT: $detailsFat.textContent,
          PROCNT: $detailsProtein.textContent
        }
      },
      heart: true
    };
    data.favorites.push(favoriteObject);
    // render to favorites page
    var favorite = renderResult(favoriteObject.food);
    favorite.setAttribute('data-food-id', currentFoodId);
    // favorite.setAttribute('data-search-index', currentIndex);
    // currentIndex++;
    $rowFavorite.appendChild(favorite);
    // switch heart icon and boolean
    $favoriteIcon.setAttribute('class', 'fa-solid fa-heart');
    objFavIdMap[currentFoodId] = true;

  }
}

// DOM Content Loaded Event

function DOMContentLoaded(event) {
  for (var k = 0; k < data.favorites.length; k++) {
    var favorites = renderResult(data.favorites[k].food);
    // favorites.setAttribute('data-search-index', k);
    favorites.setAttribute('data-food-id', data.favorites[k].food.foodId);
    $rowFavorite.appendChild(favorites);
    // resultsArray = [...data.favorites];
  }
  // currentIndex = data.favorites.length;
  viewSwap(data.view);
}

document.addEventListener('DOMContentLoaded', DOMContentLoaded);
