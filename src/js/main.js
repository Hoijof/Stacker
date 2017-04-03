var prototypes = require('./prototypes'),
  Card = require('./models/Card'),
  CardManager = require('./models/CardManager');
window.cardManager = new CardManager();

Object.assign(window, require('./prototypes'));

document.addEventListener('DOMContentLoaded', function () {
  "strict mode";

  var mainContainer = $("#mainContainer"),
    input = document.querySelector("#formContainer input"),
    editContainer = document.getElementById('editContainer'),
    editInput = editContainer.getElementsByClassName('input')[0];

  input.addEventListener('keyup', function (event) {
    event.stopPropagation();
    var card;
    if (event.keyCode === 13) {
      card = cardManager.addCard(new Card(input.value));
      card.render();
      this.value = "";
      cardManager.saveCards();
    }
  });

  editInput.addEventListener('keyup', function (event) {
    event.stopPropagation();
    var card;
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
    var elem = this.querySelector('.cardText'),
      cardId = parseInt(this.id.split("_")[1]),
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
    var elem = this.querySelector('.cardText'),
      cardId = parseInt(this.id.split("_")[1]),
      card = cardManager.cards[cardId];

    if (event.ctrlKey) {
    }
    if (event.altKey) {
      this.querySelector('.copy').click();
    }
    if (event.shiftKey) {

    }
  });

  mainContainer.on("click", "div > div", function () {
    var option = $(this).html(),
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