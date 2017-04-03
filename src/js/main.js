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
    var todo;
    if (event.keyCode === 13) {
      todo = cardManager.addCard(new Card(input.value));
      todo.render();
      this.value = "";
      cardManager.saveCards();
    }
  });

  editInput.addEventListener('keyup', function (event) {
    event.stopPropagation();
    var todo;
    if (event.keyCode === 13) {
      todo = cardManager.todos[editContainer.todoId];
      todo.name = editInput.value;
      todo.derender();
      todo.render();
      this.value = "";
      cardManager.saveCards();

      editContainer.style.display = 'none';
    }
  });

  /*
   On double click edit the todo
   */
  mainContainer.on("dblclick", "div", function () {
    var elem = this.querySelector('.cardText'),
      todoId = parseInt(this.id.split("_")[1]),
      todo = cardManager.todos[todoId];

    editInput.value = todo.name;
    editContainer.todoId = todoId;
    editContainer.style.display = 'block';
    editInput.focus();
  });

  /*
   On click perform the todo
   */
  mainContainer.on("click", "div", function (event) {
    var elem = this.querySelector('.cardText'),
      todoId = parseInt(this.id.split("_")[1]),
      todo = cardManager.todos[todoId];

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
      todoId = getParentCardId(this);

    switch (option) {
      case '+':
        changeDepth.apply(this, [todoId, 1]);
        break;
      case '-':
        changeDepth.apply(this, [todoId, -1]);
        break;
      case 'C':
        selection = selectText(this.parentElement.getElementsByClassName('cardText')[0]);
        copySelectionText();
        selection.empty();
        break;
      case 'x':
        cardManager.removeCard(todoId, -1);
        break;
    }
    cardManager.saveCards();
  });

  cardManager.loadCards();
  cardManager.renderAllCards();
  input.focus();
});