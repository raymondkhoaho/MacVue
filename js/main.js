
var $cancelIcon = document.querySelector('#cancelicon');
var $searchText = document.querySelector('#searchbar');
var $formSubmit = document.querySelector('#form');
var $rowResult = document.querySelector('.result-item');
var $noResults = document.querySelector('.noresults');
var $viewNodes = document.querySelectorAll('.view');
var $searchLink = document.querySelector('.search-link');
var $favoriteLink = document.querySelector('.favorite-link');
var resultsArray = [];

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
      $rowResult.replaceChildren();
      resultsArray.push(xhr.response.hints);
      for (var i = 0; i < resultsArray[0].length; i++) {
        var result = renderResult(resultsArray[0][i].food);
        result.setAttribute('data-search-index', i);
        $rowResult.appendChild(result);
        viewSwap('results-page');
        $noResults.setAttribute('class', 'row noresults hidden');
      }
    }
  });
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

// click function - will need to rework this to account for other icon clicks.

function clickFunction(event) {
  var pageView = event.target.getAttribute('data-view');
  viewSwap(pageView);
  $noResults.setAttribute('class', 'row noresults hidden');
  resultsArray = [];
  data.view = pageView;
}
$searchLink.addEventListener('click', clickFunction);
$favoriteLink.addEventListener('click', clickFunction);

// view detail click function
var $detailsHeader = document.querySelector('#details-header');
var $detailsImg = document.querySelector('#details-image');
var $detailsKcal = document.querySelector('#details-kcal');
var $detailsProtein = document.querySelector('#details-protein');
var $detailsCarbs = document.querySelector('#details-carbs');
var $detailsFat = document.querySelector('#details-fat');
var $resultsNodes = document.querySelector('.result-item');

function clickDetails(event) {
  if (event.target.tagName === 'IMG' || event.target.tagName === 'H4') {
    for (var j = 0; j < resultsArray[0].length; j++) {
      var closestDiv = event.target.closest('div[data-search-index]');
      if (closestDiv.getAttribute('data-search-index') === j.toString()) {
        if (resultsArray[0][j].food.image !== undefined) {
          $detailsImg.setAttribute('src', resultsArray[0][j].food.image);
        } else {
          $detailsImg.setAttribute('src', 'images/MacVueIcon.png');
        }
        $detailsHeader.textContent = resultsArray[0][j].food.label;
        $detailsKcal.textContent = Math.floor(resultsArray[0][j].food.nutrients.ENERC_KCAL);
        $detailsProtein.textContent = Math.floor(resultsArray[0][j].food.nutrients.PROCNT);
        $detailsCarbs.textContent = Math.floor(resultsArray[0][j].food.nutrients.CHOCDF);
        $detailsFat.textContent = Math.floor(resultsArray[0][j].food.nutrients.FAT);
      }
    }
    viewSwap('details-page');
  }
}

$resultsNodes.addEventListener('click', clickDetails);

// save to favorite function
var $rowFavorite = document.querySelector('.favorite-items');
var $favoriteIcon = document.querySelector('#favoriteicon');
$favoriteIcon.addEventListener('click', saveToFavorite);

var heart = false;

function saveToFavorite(event) {
  if (heart === false) {
    // save to local storage
    var favoriteObject = {};
    favoriteObject.label = $detailsHeader.textContent;
    favoriteObject.image = $detailsImg.src;
    favoriteObject.kcal = $detailsKcal.textContent;
    favoriteObject.protein = $detailsProtein.textContent;
    favoriteObject.carbs = $detailsCarbs.textContent;
    favoriteObject.fat = $detailsFat.textContent;
    data.favorites.push(favoriteObject);
    // render to favorites page
    var favorite = renderResult(favoriteObject);
    $rowFavorite.appendChild(favorite);
    // switch heart icon and boolean
    $favoriteIcon.setAttribute('class', 'fa-solid fa-heart');
    heart = true;
  } else {
    $favoriteIcon.setAttribute('class', 'fa-regular fa-heart');
    heart = false;
  }
}

// DOM Content Loaded Event

function DOMContentLoaded(event) {
  for (var k = 0; k < data.favorites.length; k++) {
    var favorites = renderResult(data.favorites[k]);
    $rowFavorite.appendChild(favorites);
  }
  viewSwap(data.view);
}

document.addEventListener('DOMContentLoaded', DOMContentLoaded);
