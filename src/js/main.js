window.CONFIG = require('./config.js')

let prototypes  = require('./prototypes'),
    Card        = require('./models/Card'),
    CardManager = require('./models/CardManager');


let cardManager = CardManager.getInstance();

Object.assign(window, require('./prototypes'));


document.addEventListener('DOMContentLoaded', function () {
  "strict mode";

  let mainContainer = $("#mainContainer"),
      input         = document.querySelector("#formContainer input"),
      editContainer = document.getElementById('editContainer'),
      editInput     = editContainer.getElementsByClassName('input')[0];

  input.addEventListener('keyup', function (event) {
    event.stopPropagation();
    let card,
        TABKEY = 9;

    if (event.keyCode === 13) {
      card = cardManager.addCard(Object.create(Card, {}).init(input.value));
      card.render();
      this.value = "";
      cardManager.saveCards();
    }
  });

  window.addEventListener('keydown', keyHandler, false);

  function keyHandler(e) {
    let TABKEY = 9;
    if(e.keyCode === TABKEY) {
      if (event.shiftKey) {
        console.log("MoveToPreviousCard");
      } else {
        console.log("MoveToNextCard");
      }
      if(e.preventDefault) {
        e.preventDefault();
      }
      return false;
    }
  }

  editInput.addEventListener('keyup', function (event) {
    event.stopPropagation();
    let card;
    if (event.keyCode === 13) {
      card = cardManager.cards[editContainer.cardId];
      card.name = editInput.value;
      card.derender();
      card.render();
      this.value = "";
      cardManager.saveCards();

      editContainer.style.display = 'none';
    }
  });

  /*
   On double click edit the card
   */
  mainContainer.on("dblclick", "div", function () {
    let elem = this.querySelector('.cardText'),
        cardId,
        card;

    if (this.id === "") {
      cardId = parseInt(this.parentElement.id.split("_")[1]);
    } else {
      cardId = parseInt(this.id.split("_")[1]);
    }

    card = cardManager.cards[cardId];

    editInput.value = card.name;
    editContainer.cardId = cardId;
    editContainer.style.display = 'block';
    editInput.focus();
  });

  /*
   On click perform the card
   */
  mainContainer.on("click", "div", function (event) {
    let elem   = this.querySelector('.cardText'),
        cardId = parseInt(this.id.split("_")[1]),
        card   = cardManager.cards[cardId];

    if (event.ctrlKey) {
    }
    if (event.altKey) {
      this.querySelector('.copy').click();
    }
    if (event.shiftKey) {

    }
  });

  mainContainer.on("click", "div > div", function () {
    let option = $(this).html(),
        selection,
        cardId = getParentCardId(this);

    switch (option) {
      case '+':
        changeDepth.apply(this, [cardId, 1]);
        break;
      case '-':
        changeDepth.apply(this, [cardId, -1]);
        break;
      case 'C':
        selection = selectText(this.parentElement.getElementsByClassName('cardText')[0]);
        copySelectionText();
        selection.empty();
        break;
      case 'x':
        cardManager.removeCard(cardId, -1);
        break;
    }
    cardManager.saveCards();
  });

  cardManager.loadCards();
  cardManager.renderAllCards();
  input.focus();
});