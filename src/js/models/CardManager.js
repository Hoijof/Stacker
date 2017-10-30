const Card = require('./Card');
const pubsub = require('../lib/pubsub');
const CONFIG = require('../config');
const loger = require('../lib/loger');

let CardManager = {
  init: function () {
    this.cards = [];
    this.selectedCard = { id: -1 };
    this.deletedCards = [];
    this.pristine = 0;

    return this;
  },
  addCard: function (card) {
    this.cards.push(card);
    card.id = this.cards.length - 1;

    card.x = card.x + this.pristine * 10;
    card.y = card.y + this.pristine * 10;

    this.pristine++;

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
  saveData: function () {
    let data = {};

    if (typeof (Storage) === 'undefined') {
      console.warn('you don\'t have local storage :(');
      return;
    }

    data.cards = this.cards;
    data.selectedCardId = this.selectedCard.id;
    data.deletedCards = this.deletedCards;

    window.localStorage.setItem('cardsData', JSON.stringify(data));

    loger.log("Data saved");
  },
  loadData: function () {
    const data = JSON.parse(window.localStorage.getItem('cardsData')) || {};

    this.cards = data.cards;

    if (this.cards == null) {
      this.cards = JSON.parse(window.atob(CONFIG.DEFAULT_CONTENT));
    }

    // Load selected card
    if (data.selectedCardId !== undefined && data.selectedCardId > -1) {
      this.selectedCard = this.cards[data.selectedCardId];
    }

    this.clearArray();

    // Load deleted cards
    this.deletedCards = data.deletedCards || [];

    document.activeElement.blur();

    loger.log('Data loaded');
  },
  clearArray: function () {
    let i;

    this.cards = this.cards.filter(function (elem) {
      return elem !== undefined && elem !== null;
    });

    for (i in this.cards) {
      if (this.cards.hasOwnProperty(i)) {
        this.cards[+i].id = +i;
      }
    }

    return this;
  },
  reRenderAllCards: function () {
    this.cards.forEach((card) => {
      card.derender();
    });

    this.renderAllCards();
  },
  renderAllCards: function () {
    this.cards.forEach((card) => {
      card.selected = this.selectedCard && (this.selectedCard.id === card.id);
      Object.setPrototypeOf(card, Card);
      card.render();
    }
    );

    return this;
  },
  getInstance: function () {
    if (CardManager.instance === undefined) {
      CardManager.instance = Object.create(CardManager, {});
      CardManager.instance.init();
      pubsub.sub(window.CONFIG.SAVE_CARDS, CardManager.instance.saveData, CardManager.instance);
      pubsub.sub(window.CONFIG.SELECT_CARD, CardManager.instance.selectCard, CardManager.instance);
      pubsub.sub(window.CONFIG.RERENDER, CardManager.instance.reRenderAllCards, CardManager.instance);
      pubsub.sub(window.CONFIG.LESS_PRISTINE, CardManager.instance.lessPristine, CardManager.instance);
    }

    return CardManager.instance;
  },
  lessPristine: function () {
    this.pristine--;
  },
  exportCards: function () {
    return window.btoa(JSON.stringify(this.cards));
  },
  importCards: function (data) {
    window.localStorage.setItem('cardsData', window.atob(data));
    this.loadData();
    this.renderAllCards();
  },
  selectCard: function (cardId) {
    if (this.selectedCard !== undefined && this.selectedCard.node.classList !== undefined) {
      this.selectedCard.node.classList.remove('selected');
    }
    this.selectedCard = this.cards[cardId];

    this.selectedCard.node.classList.add('selected');

    document.activeElement.blur();
  },
  nextCard: function () {
    let it = +this.selectedCard.id + 1;

    while (it !== +this.selectedCard.id) {
      if (this.cards[it] !== undefined && this.cards[it].isDeleted !== true) {
        break;
      }
      if (++it >= this.cards.length) {
        it = 0;
      }
    }

    this.selectCard(it);
  },
  previousCard: function () {
    let it = +this.selectedCard.id - 1;

    while (it !== +this.selectedCard.id) {
      if (this.cards[it] !== undefined) {
        break;
      }
      if (--it <= 0) {
        it = this.cards.length;
      }
    }

    this.selectCard(it);
  },
  deleteCard: function (card) {
    this.deletedCards.push(card.id);

    card.delete();
  },
  undeleteLastCard: function () {
    if (this.deletedCards.length === 0) {
      return;
    }

    this.selectCard(this.cards[this.deletedCards.splice(this.deletedCards.length - 1)].undelete().id);

    this.saveData();
  }
};

module.exports = CardManager;
