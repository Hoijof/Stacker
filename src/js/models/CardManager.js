var Card = require('./Card'),
  pubsub = require('../lib/pubsub');


function CardManager() {
  this.cards = [];
}

CardManager.prototype.addCard = function (card) {
  this.cards.push(card);
  card.id = this.cards.length - 1;

  return card;
};

CardManager.prototype.removeCard = function (id) {
  this.cards[id].derender();
  this.cards[id] = undefined;
};

CardManager.prototype.redrawCard = function (cardId, x, y) {
  var card = this.cards[cardId];
  card.x = x;
  card.y = y;

  card.derender();
  card.render();
};

CardManager.prototype.saveCards = function () {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem("cards", JSON.stringify(this.cards));
  } else {
    console.log("you don't have local storage :(");
  }
};

CardManager.prototype.loadCards = function () {
  var i;

  this.cards = JSON.parse(localStorage.getItem("cards"));
  if (this.cards === null) this.cards = [];

  this.clearArray();
};

CardManager.prototype.clearArray = function () {
  var i;

  this.cards = this.cards.filter(function (elem) {
    return elem !== undefined && elem !== null
  });
  for (i in this.cards) {
    if (this.cards.hasOwnProperty(i)) {
      this.cards[i].id = i;
    }
  }
};

CardManager.prototype.renderAllCards = function () {
  this.cards.forEach(function (card) {
    // card.__proto__ = Card.prototype;
    Object.setPrototypeOf(card, Card.prototype);
    card.render();
  })
};

CardManager.getInstance = function() {
  if (CardManager.instance === undefined) {
    CardManager.instance = new CardManager();
    pubsub.sub(window.CONFIG.SAVE_CARDS, CardManager.instance.saveCards, CardManager.instance);
  }

  return CardManager.instance;
}

module.exports = CardManager;