window.CONFIG = require('./config.js');

let keyHandler = require('./lib/keyHandler');
let cardManager = require('./models/CardManager').getInstance();
let pubsub = require('./lib/pubsub');

window.cm = {
  cardManager: cardManager
};

Object.assign(window, require('./prototypes'));

document.addEventListener('DOMContentLoaded', function () {
  'strict mode';

  keyHandler.init({
    cardManager: cardManager
  });
    
  cardManager.loadData();
  cardManager.renderAllCards();
});
