
var $cancelIcon = document.querySelector('#cancelicon');
var $searchText = document.querySelector('#searchbar');
var $formSubmit = document.querySelector('#form');
var $rowResult = document.querySelector('.result-item');
var $noResults = document.querySelector('.noresults');
var $viewNodes = document.querySelectorAll('.view');
var $searchLink = document.querySelector('.search-link');

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
    // console.log(xhr.response.hints);

    if (xhr.response.hints.length === 0) {
      $noResults.setAttribute('class', 'row noresults');
    } else {
      $rowResult.replaceChildren();
      for (var i = 0; i < xhr.response.hints.length; i++) {
        var result = renderResult(xhr.response.hints[i]);
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
}
$searchLink.addEventListener('click', clickFunction);
