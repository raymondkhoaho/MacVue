
var $cancelIcon = document.querySelector('#cancelicon');
var $searchText = document.querySelector('#searchbar');
var $formSubmit = document.querySelector('#form');
var $rowResult = document.querySelector('.result-item');
var $noResults = document.querySelector('.noresults');
var $viewNodes = document.querySelectorAll('.view');
var $searchLink = document.querySelector('.search-link');
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
    resultsArray.push(xhr.response.hints);

    if (xhr.response.hints.length === 0) {
      $noResults.setAttribute('class', 'row noresults');
    } else {
      $rowResult.replaceChildren();
      for (var i = 0; i < xhr.response.hints.length; i++) {
        var result = renderResult(xhr.response.hints[i]);
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
  if (result.food.image !== undefined) {
    $newImg.setAttribute('src', result.food.image);
  } else {
    $newImg.setAttribute('src', 'images/MacVueIcon.png');
  }

  var $newH4 = document.createElement('h4');
  $newH4.textContent = result.food.label;

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
  viewSwap('search-form');
  $noResults.setAttribute('class', 'row noresults hidden');
  resultsArray = [];
}
$searchLink.addEventListener('click', clickFunction);

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
var $favoriteIcon = document.querySelector('#favoriteicon');
$favoriteIcon.addEventListener('click', saveToFavorite);

function saveToFavorite(event) {
  $favoriteIcon.setAttribute('class', 'fa-solid fa-heart');

}
