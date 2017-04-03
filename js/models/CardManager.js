
function CardManager() {
  this.todos = [];
}

CardManager.prototype.addCard = function (todo) {
  this.todos.push(todo);
  todo.id = this.todos.length - 1;

  return todo;
};

CardManager.prototype.removeCard = function (id) {
  this.todos[id].derender();
  this.todos[id] = undefined;
};

CardManager.prototype.redrawCard = function (todoId, x, y) {
  var todo = this.todos[todoId];
  todo.x = x;
  todo.y = y;

  todo.derender();
  todo.render();
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
  if (this.todos == null) this.todos = [];

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
  this.todos.forEach(function (todo) {
    todo.__proto__ = Card.prototype;
    todo.render();
  })
};