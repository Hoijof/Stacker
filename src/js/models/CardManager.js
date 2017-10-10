const Card = require('./Card'),
    pubsub = require('../lib/pubsub'),
    CONFIG = require('../config');

let CardManager = {
    init: function() {
        this.cards = [];
        this.selectedCard = {id: -1};
        this.deletedCards = [];

        return this;
    },
    addCard: function(card) {
        this.cards.push(card);
        card.id = this.cards.length - 1;

        return card;
    },
    removeCard: function(id) {
        this.cards[id].derender();
        this.cards[id] = undefined;

        return this;
    },
    redrawCard: function(cardId, x, y) {
        let card = this.cards[cardId];
        card.x = x;
        card.y = y;

        card.derender();
        card.render();

        return this;
    },
    saveCards: function() {
        if (typeof(Storage) !== 'undefined') {
            localStorage.setItem('cards', JSON.stringify(this.cards));
        } else {
            console.log('you don\'t have local storage :(');
        }

        this.persistSelectedCard();

        return this;
    },
    loadCards: function() {
        this.cards = JSON.parse(localStorage.getItem('cards'));
        if (this.cards === null) {
            this.cards = JSON.parse(atob(CONFIG.DEFAULT_CONTENT));
        }

        this.clearArray();

        this.loadSelectedCard();

        document.activeElement.blur();

        return this;
    },
    clearArray: function() {
        let i;

        this.cards = this.cards.filter(function(elem) {
            return elem !== undefined && elem !== null;
        });
        for (i in this.cards) {
            if (this.cards.hasOwnProperty(i)) {
                this.cards[i].id = i;
            }
        }

        return this;
    },
    reRenderAllCards: function() {
        this.cards.forEach((card) => {
            card.derender();
        });
        this.renderAllCards();
    },
    renderAllCards: function() {

        this.cards.forEach((card) => {
                card.selected = this.selectedCard && (this.selectedCard.id === card.id);
                Object.setPrototypeOf(card, Card);
                card.render();
            }
        );

        return this;
    },
    getInstance: function() {
        if (CardManager.instance === undefined) {
            CardManager.instance = Object.create(CardManager, {});
            CardManager.instance.init();
            pubsub.sub(window.CONFIG.SAVE_CARDS, CardManager.instance.saveCards, CardManager.instance);
            pubsub.sub(window.CONFIG.SELECT_CARD, CardManager.instance.selectCard, CardManager.instance);
            pubsub.sub(window.CONFIG.RERENDER, CardManager.instance.reRenderAllCards, CardManager.instance);
        }

        return CardManager.instance;

    },
    exportCards: function() {
        return btoa(JSON.stringify(this.cards));
    },
    importCards: function(data) {
        localStorage.setItem('cards', atob(data));
        this.loadCards();
        this.renderAllCards();
    },
    selectCard: function(cardId) {
        if (this.selectedCard !== undefined) {
            this.selectedCard.node.classList.remove('selected');
        }
        this.selectedCard = this.cards[cardId];

        this.selectedCard.node.classList.add('selected');

        this.persistSelectedCard();
        document.activeElement.blur();
    },
    nextCard: function() {
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
    previousCard: function() {
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
    persistSelectedCard: function() {
        if (this.selectedCard && this.selectedCard.id > -1) {
            localStorage.setItem('selectedCard', this.selectedCard.id);
        }
    },
    loadSelectedCard: function() {
        let selectedCardId = +localStorage.getItem('selectedCard');

        if (selectedCardId !== undefined && selectedCardId > -1) {
            this.selectedCard = this.cards[selectedCardId];
        }
    },
    deleteCard: function(card) {
        this.deletedCards.push(card);

        card.delete();
    },
    undeleteLastCard: function() {
        if (this.deletedCards.length === 0) {
            return;
        }

        this.deletedCards.splice(this.deletedCards.length -1)[0].undelete();

        this.saveCards();
    }
};

module.exports = CardManager;