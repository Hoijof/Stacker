window.CONFIG = require('./config.js');

let keyHandler = require('./lib/keyHandler'),
  cardManager = require('./models/CardManager').getInstance();

Object.assign(window, require('./prototypes'));


document.addEventListener('DOMContentLoaded', function () {
  'strict mode';

  keyHandler.init({
    cardManager: cardManager
  });

  cardManager.loadCards();
  cardManager.renderAllCards();
});
