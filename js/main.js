var $cancelIcon = document.querySelector('#cancelicon');
var $searchText = document.querySelector('#searchbar');

$cancelIcon.addEventListener('click', clearSearch);

function clearSearch(event) {
  $searchText.value = '';
}
