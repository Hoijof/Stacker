window.CONFIG = require('./config.js')

let prototypes  = require('./prototypes'),
    Card        = require('./models/Card'),
    CardManager = require('./models/CardManager');

let mainContainer,
    input,
    editContainer,
    editInput;


let cardManager = CardManager.getInstance();

Object.assign(window, require('./prototypes'));


document.addEventListener('DOMContentLoaded', function () {
  "strict mode";

  mainContainer = $("#mainContainer");
  input = document.querySelector("#formContainer input");
  editContainer = document.getElementById('editContainer');
  editInput = editContainer.getElementsByClassName('input')[0];


  window.addEventListener('keydown', keyHandler, false);
  input.addEventListener('keyup', mainInputKeyEvent);
  editInput.addEventListener('keyup', editInputKeyEvent);
  /*
   On double click edit the card
   */
  mainContainer.on("dblclick", "div", doubleClickHandler);
  /*
   On click perform the card
   */
  mainContainer.on("click", "div", cardClickEvents);
  mainContainer.on("click", "div > div", cardMenuEvents);


  cardManager.loadCards();
  cardManager.renderAllCards();
  input.focus();
});


function mainInputKeyEvent (event) {
  event.stopPropagation();
  let card;

  if (event.keyCode === 13) {
    card = cardManager.addCard(Object.create(Card, {}).init(input.value));
    card.render();
    this.value = "";
    cardManager.saveCards();
  }
}

function editInputKeyEvent (event) {
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
}

function keyHandler (e) {
  let TABKEY = 9;
  if (e.keyCode === TABKEY) {
    if (event.shiftKey) {
      console.log("MoveToPreviousCard");
    } else {
      console.log("MoveToNextCard");
    }
    if (e.preventDefault) {
      e.preventDefault();
    }
    return false;
  }
}

function doubleClickHandler () {
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
}

function cardClickEvents (event) {
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
}

function cardMenuEvents () {
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
}