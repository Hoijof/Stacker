var todoManager = new TodoManager();


document.addEventListener('DOMContentLoaded', function () {
  "strict mode";

  var input = document.querySelector("#formContainer input"),
    mainContainer = $("#mainContainer");

  input.addEventListener('keyup', function (event) {
    event.stopPropagation();
    var todo;
    if (event.keyCode === 13) {
      todo = todoManager.addTodo(new Todo(input.value));
      todo.render();
      this.value = "";
      todoManager.saveTodos();
    }
  });

  /*
  On double click edit the todo
   */
  mainContainer.on("dblclick", "div", function () {
    var elem = this.querySelector('.cardText');


    console.log(elem.innerHTML);
  });

  mainContainer.on("click", "div > div", function () {
    var option = $(this).html(),
      todoId = parseInt(this.parentElement.id.split("_")[1]),
      depth;

    switch (option) {
      case '+':
        changeDepth.apply(this, [todoId, 1]);
        break;
      case '-':
        changeDepth.apply(this, [todoId, -1]);
        break;
      case 'x':
        todoManager.removeTodo(todoId, -1);
        break;
    }
    todoManager.saveTodos();
  });

  function changeDepth(todoId, increment) {
    var depth = parseInt(this.parentElement.style.zIndex) + increment;

    this.parentElement.style.zIndex = depth;
    todoManager.todos[todoId].depth = depth;
    this.parentElement.getElementsByClassName("depth")[0].innerHTML = depth;
  }

  todoManager.loadTodos();
  todoManager.renderAllTodos();
  input.focus();
});