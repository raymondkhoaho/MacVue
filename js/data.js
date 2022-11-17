/* exported data */

var data = {
  view: 'search-form',
  favorites: []
};

var previousDataJSON = localStorage.getItem('data-local-storage');
if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

function unloadWindow(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('data-local-storage', dataJSON);
}

window.addEventListener('beforeunload', unloadWindow);
window.addEventListener('pagehide', unloadWindow);
