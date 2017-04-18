window.CONFIG = require('./config.js');

let prototypes = require('./prototypes'),
  Card = require('./models/Card'),
  CardManager = require('./models/CardManager');

let mainContainer,
  input,
  editContainer,
  editInput,
  importContainer,
  importInput,
  exportContainer,
  exportContent,
  importButton;


let cardManager = CardManager.getInstance();

Object.assign(window, require('./prototypes'));


document.addEventListener('DOMContentLoaded', function () {
  'strict mode';

  mainContainer = $('#mainContainer');
  input = document.querySelector('#formContainer input');
  editContainer = document.getElementById('editContainer');
  editInput = editContainer.getElementsByClassName('textarea')[0];
  importContainer = document.getElementById('importContainer');
  importInput = importContainer.getElementsByClassName('input')[0];
  importButton = importContainer.getElementsByClassName('button')[0];
  exportContainer = document.getElementById('exportContainer');
  exportContent = exportContainer.getElementsByTagName('div')[0];


  window.addEventListener('keydown', keyHandler, false);
  input.addEventListener('keydown', mainInputKeyEvent);
  editInput.addEventListener('keydown', editInputKeyEvent);
  editContainer.addEventListener('click', hideEditContainer);
  editInput.addEventListener('click', stopPropagation);
  /*
   On double click edit the card
   */
  mainContainer.on('dblclick', 'div', doubleClickHandler);
  /*
   On click perform the card
   */
  mainContainer.on('click', 'div', cardClickEvents);
  mainContainer.on('click', 'div > div', cardMenuEvents);
  document.getElementById('export').addEventListener('click', exportCards);
  document.getElementById('import').addEventListener('click', showImporter);
  importButton.addEventListener('click', loadImportCardsCode);
  importContainer.addEventListener('click', hideImportContainer);
  importInput.addEventListener('keydown', importInputKeyEvent);
  importInput.addEventListener('click', stopPropagation);
  exportContainer.addEventListener('click', hideExportContainer);
  exportContent.addEventListener('click', stopPropagation);

  cardManager.loadCards();
  cardManager.renderAllCards();
  input.focus();
});

function hideExportContainer () {
  exportContainer.style.display = 'none';
}

function hideEditContainer () {
  editContainer.style.display = 'none';
}

function hideImportContainer () {
  importContainer.style.display = 'none';
}

function stopPropagation (e) {
  e.stopPropagation();
}

function mainInputKeyEvent (event) {
  event.stopPropagation();
  let card;

  if (event.keyCode === 13) {
    card = cardManager.addCard(Object.create(Card, {}).init(input.value));
    card.render();
    this.value = '';
    cardManager.saveCards();
  }
}

function editInputKeyEvent (event) {
  event.stopPropagation();
  let card;
  if (event.keyCode === 13 && event.shiftKey) return;
  if (event.keyCode === 13) {
    card = cardManager.cards[editContainer.cardId];
    card.name = editInput.value;
    card.derender();
    card.render();
    this.value = '';
    cardManager.saveCards();
    hideEditContainer();
  } else if (event.keyCode === 27) {
    hideEditContainer();
  }

}

function importInputKeyEvent (event) {
  if (event.keyCode === 27) {
    hideImportContainer();
  }
}

function keyHandler (e) {
  let TAB_KEY = 9,
    ESCAPE_KEY = 27,
    C_KEY = 67,
    D_KEY = 68,
    E_KEY = 69,
    PLUS_KEY = 43,
    MINUS_KEY = 45,
    DOT_KEY = 46;

  switch (e.keyCode) {
    case C_KEY:
      let elem = cardManager.selectedCard.node;
      selection = selectText(elem.getElementsByClassName('cardText')[0]);
      copySelectionText();
      selection.empty();
      break;
    case D_KEY:
      cardManager.removeCard(cardManager.selectedCard.id, -1);
      break;
    case E_KEY:
      doubleClickHandler.apply(cardManager.selectedCard.node);
      break;
    case PLUS_KEY:
      changeDepth.apply(cardManager.selectedCard.node, [cardManager.selectedCard.id, 1]);
      break;
    case MINUS_KEY:
      changeDepth.apply(cardManager.selectedCard.node, [cardManager.selectedCard.id, -1]);
      break;
    case DOT_KEY:

      break;

    case TAB_KEY:
      if (event.shiftKey) {
        cardManager.previousCard();
      } else {
        cardManager.nextCard();
      }
      if (e.preventDefault) {
        e.preventDefault();
      }
      return false;
      break;
    case ESCAPE_KEY:
      hideEditContainer();
      break;
  }
}
function doubleClickHandler () {
  let elem = this.querySelector('.cardText'),
    cardId,
    card;

  if (this.id === '') {
    cardId = parseInt(this.parentElement.id.split('_')[1]);
  } else {
    cardId = parseInt(this.id.split('_')[1]);
  }

  card = cardManager.cards[cardId];

  editInput.value = card.name;
  editContainer.cardId = cardId;
  editContainer.style.display = 'block';
  editInput.style.top = card.y;
  editInput.style.left = card.x;
  editInput.style['padding-top'] = '23px';
  editInput.focus();
}

function cardClickEvents (event) {
  let elem = this.querySelector('.cardText'),
    cardId = parseInt(this.id.split('_')[1]),
    card = cardManager.cards[cardId];

  cardManager.selectCard(card.id);

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

function exportCards () {
  exportContainer.style.display = 'block';
  exportContent.innerHTML = cardManager.exportCards();
  selection = selectText(exportContent);
  copySelectionText();
  selection.empty();
}

function loadImportCardsCode () {
  let data = importInput.value;
  cardManager.importCards(data);
  importContainer.style.display = 'none';
}

function showImporter () {
  importContainer.style.display = 'block';
  importInput.focus();
}