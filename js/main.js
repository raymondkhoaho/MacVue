
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
var currentIndex = null;

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
      resultsArray = [];
      resultsArray = [...xhr.response.hints];
      for (var i = 0; i < resultsArray.length; i++) {
        var result = renderResult(resultsArray[i].food);
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
  data.view = pageView;
  if (pageView === 'favorites-page') {
    resultsArray = [];
    resultsArray = [...data.favorites];
  }
}
$searchLink.addEventListener('click', clickFunction);
$favoriteLink.addEventListener('click', clickFunction);

// view detail click function

function clickDetails(event) {
  if (event.target.tagName === 'IMG' || event.target.tagName === 'H4') {
    for (var j = 0; j < resultsArray.length; j++) {
      var closestDiv = event.target.closest('div[data-search-index]');
      if (closestDiv.getAttribute('data-search-index') === j.toString()) {
        if (resultsArray[j].food.image !== undefined) {
          $detailsImg.setAttribute('src', resultsArray[j].food.image);
        } else {
          $detailsImg.setAttribute('src', 'images/MacVueIcon.png');
        }
        $detailsHeader.textContent = resultsArray[j].food.label;
        $detailsKcal.textContent = Math.floor(resultsArray[j].food.nutrients.ENERC_KCAL);
        $detailsProtein.textContent = Math.floor(resultsArray[j].food.nutrients.PROCNT);
        $detailsCarbs.textContent = Math.floor(resultsArray[j].food.nutrients.CHOCDF);
        $detailsFat.textContent = Math.floor(resultsArray[j].food.nutrients.FAT);
        if (resultsArray[j].heart === true) {
          $favoriteIcon.setAttribute('class', 'fa-solid fa-heart');
        } else {
          $favoriteIcon.setAttribute('class', 'fa-regular fa-heart');
        }
      }
    }
    viewSwap('details-page');
  }
}

$resultsNodes.addEventListener('click', clickDetails);
$favoritesNodes.addEventListener('click', clickDetails);

// save to favorite function
var $rowFavorite = document.querySelector('.favorite-items');
var $favoriteIcon = document.querySelector('#favoriteicon');
$favoriteIcon.addEventListener('click', saveToFavorite);

var heart = false;

function saveToFavorite(event) {
  if (heart === false) {
    // save to local storage
    var favoriteObject = {
      food: {
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
    favorite.setAttribute('data-search-index', currentIndex);
    currentIndex++;
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
    var favorites = renderResult(data.favorites[k].food);
    favorites.setAttribute('data-search-index', k);
    $rowFavorite.appendChild(favorites);
    resultsArray = [...data.favorites];
  }
  currentIndex = data.favorites.length;
  viewSwap(data.view);
}

document.addEventListener('DOMContentLoaded', DOMContentLoaded);
