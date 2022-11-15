
var $cancelIcon = document.querySelector('#cancelicon');
var $searchText = document.querySelector('#searchbar');
var $formSubmit = document.querySelector('#form');
var $rowResult = document.querySelector('.result-item');
var $searchForm = document.querySelector('.view1');
var $resultPage = document.querySelector('.view2');

// Clear Search Bar
function clearSearch(event) {
  $searchText.value = '';
}
$cancelIcon.addEventListener('click', clearSearch);

// HTTP Request

$formSubmit.addEventListener('submit', getFoodData);

function getFoodData(event) {
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.edamam.com/api/food-database/v2/parser?app_id=62e1382f&app_key=fb581bd2de03e8a30b53d8a1a76b8b79&ingr=' + $searchText.value);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.hints.length; i++) {
      var result = renderResult(xhr.response.hints[i]);
      $rowResult.appendChild(result);
      $searchForm.setAttribute('class', 'view1 container hidden');
      $resultPage.setAttribute('class', 'view2 container');

    }
  });
  xhr.send();
  $formSubmit.reset();
}

function renderResult(result) {
  var $newDiv = document.createElement('div');
  $newDiv.setAttribute('class', 'column-sixth flex-column');

  var $imageDiv = document.createElement('div');
  $imageDiv.setAttribute('class', 'image-wrapper');

  $newDiv.appendChild($imageDiv);

  var $newImg = document.createElement('img');
  $newImg.setAttribute('src', result.food.image);

  $imageDiv.appendChild($newImg);

  var $newH4 = document.createElement('h4');
  $newH4.textContent = result.food.label;

  $newDiv.appendChild($newH4);

  return $newDiv;
}
