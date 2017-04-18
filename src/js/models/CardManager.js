const Card = require('./Card'),
  pubsub = require('../lib/pubsub');

let CardManager = {
  init: function () {
    this.cards = [];

    return this;
  },
  addCard: function (card) {
    this.cards.push(card);
    card.id = this.cards.length - 1;

    return card;
  },
  removeCard: function (id) {
    this.cards[id].derender();
    this.cards[id] = undefined;

    return this;
  },
  redrawCard: function (cardId, x, y) {
    let card = this.cards[cardId];
    card.x = x;
    card.y = y;

    card.derender();
    card.render();

    return this;
  },
  saveCards: function () {
    if (typeof(Storage) !== 'undefined') {
      localStorage.setItem('cards', JSON.stringify(this.cards));
    } else {
      console.log('you don\'t have local storage :(');
    }

    return this;
  },
  loadCards: function () {
    this.cards = JSON.parse(localStorage.getItem('cards'));
    if (this.cards === null) this.cards = [];

    this.clearArray();

    return this;
  },
  clearArray: function () {
    let i;

    this.cards = this.cards.filter(function (elem) {
      return elem !== undefined && elem !== null;
    });
    for (i in this.cards) {
      if (this.cards.hasOwnProperty(i)) {
        this.cards[i].id = i;
      }
    }

    return this;
  },
  renderAllCards: function () {
    this.cards.forEach(function (card) {
      Object.setPrototypeOf(card, Card);
      card.render();
    });

    return this;
  },
  getInstance: function () {
    if (CardManager.instance === undefined) {
      CardManager.instance = Object.create(CardManager, {});
      pubsub.sub(window.CONFIG.SAVE_CARDS, CardManager.instance.saveCards, CardManager.instance);
    }

    return CardManager.instance;

  },
  exportCards: function () {
    return btoa(JSON.stringify(this.cards));
  },
  importCards: function (data) {
    localStorage.setItem('cards', atob(data));
    this.loadCards();
    this.renderAllCards();
  }
};

module.exports = CardManager;