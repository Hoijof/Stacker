window.CONFIG = require('./config.js');

let keyHandler = require('./lib/keyHandler'),
  cardManager = require('./models/CardManager').getInstance(),
  pubsub = require('./lib/pubsub');

window.cm = {
  cardManager: cardManager
};

Object.assign(window, require('./prototypes'));


document.addEventListener('DOMContentLoaded', function () {
  'strict mode';

  keyHandler.init({
    cardManager: cardManager
  });

  cardManager.loadCards();
  cardManager.renderAllCards();
});
