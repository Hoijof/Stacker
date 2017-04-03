var Card = require('./Card');

function CardManager() {
  this.todos = [];
}

CardManager.prototype.addCard = function (card) {
  this.todos.push(card);
  card.id = this.todos.length - 1;

  return card;
};

CardManager.prototype.removeCard = function (id) {
  this.todos[id].derender();
  this.todos[id] = undefined;
};

CardManager.prototype.redrawCard = function (todoId, x, y) {
  var card = this.todos[todoId];
  card.x = x;
  card.y = y;

  card.derender();
  card.render();
};

CardManager.prototype.saveCards = function () {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  } else {
    console.log("you don't have local storage :(");
  }
};

CardManager.prototype.loadCards = function () {
  var i;

  this.todos = JSON.parse(localStorage.getItem("todos"));
  if (this.todos === null) this.todos = [];

  this.clearArray();
};

CardManager.prototype.clearArray = function () {
  var i;

  this.todos = this.todos.filter(function (elem) {
    return elem !== undefined && elem !== null
  });
  for (i in this.todos) {
    if (this.todos.hasOwnProperty(i)) {
      this.todos[i].id = i;
    }
  }
};

CardManager.prototype.renderAllCards = function () {
  this.todos.forEach(function (card) {
    card.__proto__ = Card.prototype;
    card.render();
  })
};

module.exports = CardManager;