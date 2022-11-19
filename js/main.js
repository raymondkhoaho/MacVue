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
var $rowFavorite = document.querySelector('.favorite-items');
var $favoriteIcon = document.querySelector('#favoriteicon');
var $viewMoreLink = document.querySelector('.view-more-link');
var resultsArray = [];
var currentFoodId = '';
var objFavIdMap = {};
var nextPageLink = '';
var $loader = document.querySelector('.loader');

// Clear Search Bar Function

function clearSearch(event) {
  $searchText.value = '';
}
$cancelIcon.addEventListener('click', clearSearch);

// HTTP Request Form Submit Event

function getFoodData(event) {
  event.preventDefault();
  $loader.setAttribute('class', 'row center loader');
  $formSubmit.setAttribute('class', 'hidden');
  $noResults.setAttribute('class', 'noresults hidden');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.edamam.com/api/food-database/v2/parser?app_id=62e1382f&app_key=fb581bd2de03e8a30b53d8a1a76b8b79&ingr=' + $searchText.value);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    nextPageLink = xhr.response._links.next.href;
    if (xhr.response.hints.length === 0) {
      $loader.setAttribute('class', 'row center hidden loader');
      $formSubmit.setAttribute('class', '');
      $noResults.setAttribute('class', 'noresults');
    } else {
      resultsArray = [];
      $rowResult.replaceChildren();
      var objIdMap = {};
      for (var i = 0; i < xhr.response.hints.length; i++) {
        if (!objIdMap[xhr.response.hints[i].food.foodId]) {
          objIdMap[xhr.response.hints[i].food.foodId] = true;
          resultsArray.push(xhr.response.hints[i]);
          var result = renderResult(xhr.response.hints[i].food);
          result.setAttribute('data-search-index', i);
          result.setAttribute('data-food-id', xhr.response.hints[i].food.foodId);
          $rowResult.appendChild(result);
        }
      }
      viewSwap('results-page');
      $loader.setAttribute('class', 'row center hidden loader');
      $formSubmit.setAttribute('class', '');
      $noResults.setAttribute('class', 'noresults hidden');
    }
  }
  );
  xhr.send();
  $formSubmit.reset();
}
$formSubmit.addEventListener('submit', getFoodData);

// View More Function

function viewMoreData(event) {
  event.preventDefault();
  var xhrNext = new XMLHttpRequest();
  xhrNext.open('GET', nextPageLink);
  xhrNext.responseType = 'json';
  xhrNext.addEventListener('load', function () {
    nextPageLink = xhrNext.response._links.next.href;
    var objIdMap2 = {};
    for (var q = 0; q < xhrNext.response.hints.length; q++) {
      if (!objIdMap2[xhrNext.response.hints[q].food.foodId]) {
        objIdMap2[xhrNext.response.hints[q].food.foodId] = true;
        resultsArray.push(xhrNext.response.hints[q]);
        var result = renderResult(xhrNext.response.hints[q].food);
        result.setAttribute('data-search-index', q);
        result.setAttribute('data-food-id', xhrNext.response.hints[q].food.foodId);
        $rowResult.appendChild(result);
      }
    }
  }
  );
  xhrNext.send();
}

$viewMoreLink.addEventListener('click', viewMoreData);

// Render Result Function

function renderResult(result) {
  var $newDiv = document.createElement('div');
  $newDiv.setAttribute('class', 'column-sixth flex-column');

  var $imageDiv = document.createElement('div');
  $imageDiv.setAttribute('class', 'wrapper');

  var $newImg = document.createElement('img');
  if (result.image !== undefined) {
    $newImg.setAttribute('src', result.image);
  } else {
    $newImg.setAttribute('src', 'images/macvue-icon.png');
  }

  var $newH4 = document.createElement('h4');
  $newH4.textContent = result.label;

  $newDiv.appendChild($imageDiv);
  $imageDiv.appendChild($newImg);
  $newDiv.appendChild($newH4);

  return $newDiv;
}

// View Swap Function

function viewSwap(view) {
  for (var i = 0; i < $viewNodes.length; i++) {
    if ($viewNodes[i].getAttribute('data-view') === view) {
      $viewNodes[i].setAttribute('class', 'view container');
    } else {
      $viewNodes[i].setAttribute('class', 'view container hidden');
    }
  }
}

// Navigation Link Click Function

function clickFunction(event) {
  var pageView = event.target.getAttribute('data-view');
  viewSwap(pageView);
  $noResults.setAttribute('class', 'noresults hidden');
  data.view = pageView;
  if (pageView === 'favorites-page') {
    resultsArray = [...data.favorites];
  }
  return resultsArray;
}
$searchLink.addEventListener('click', clickFunction);
$favoriteLink.addEventListener('click', clickFunction);

// Detail Click Function

function clickDetails(event) {
  if (event.target.tagName === 'IMG' || event.target.tagName === 'H4') {
    var closestDiv = event.target.closest('div.column-sixth');
    for (var j = 0; j < resultsArray.length; j++) {
      for (var p = 0; p < data.favorites.length; p++) {
        if (closestDiv.getAttribute('data-food-id') === data.favorites[p].food.foodId) {
          heart = true;
          $favoriteIcon.setAttribute('class', 'fa-solid fa-heart');
          break;
        } else {
          heart = false;
          $favoriteIcon.setAttribute('class', 'fa-regular fa-heart');
        }
      }
      if (closestDiv.getAttribute('data-food-id') === resultsArray[j].food.foodId.toString()) {
        if (resultsArray[j].food.image !== undefined) {
          $detailsImg.setAttribute('src', resultsArray[j].food.image);
        } else {
          $detailsImg.setAttribute('src', 'images/macvue-icon.png');
        }
        currentFoodId = resultsArray[j].food.foodId;
        $detailsHeader.setAttribute('data-search-index', j);
        $detailsHeader.setAttribute('data-food-id', resultsArray[j].food.foodId);
        $detailsHeader.textContent = resultsArray[j].food.label;
        $detailsKcal.textContent = Math.floor(resultsArray[j].food.nutrients.ENERC_KCAL);
        $detailsProtein.textContent = Math.floor(resultsArray[j].food.nutrients.PROCNT);
        $detailsCarbs.textContent = Math.floor(resultsArray[j].food.nutrients.CHOCDF);
        $detailsFat.textContent = Math.floor(resultsArray[j].food.nutrients.FAT);
      }
    }
    viewSwap('details-page');
  }
}

$resultsNodes.addEventListener('click', clickDetails);
$favoritesNodes.addEventListener('click', clickDetails);

// Favorite Click Function

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
      }
    };
    data.favorites.push(favoriteObject);
    var favorite = renderResult(favoriteObject.food);
    favorite.setAttribute('data-food-id', currentFoodId);
    $rowFavorite.appendChild(favorite);
    $favoriteIcon.setAttribute('class', 'fa-solid fa-heart');
    objFavIdMap[currentFoodId] = true;

  }
}

$favoriteIcon.addEventListener('click', favoriteClickFunction);

// DOM Content Loaded Event Function

function DOMContentLoaded(event) {
  for (var k = 0; k < data.favorites.length; k++) {
    var favorites = renderResult(data.favorites[k].food);
    favorites.setAttribute('data-food-id', data.favorites[k].food.foodId);
    $rowFavorite.appendChild(favorites);
  }
  viewSwap(data.view);
}

document.addEventListener('DOMContentLoaded', DOMContentLoaded);
