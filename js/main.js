var todoManager = new TodoManager();



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
      todo = todoManager.addTodo(new Todo(input.value));
      todo.render();
      this.value = "";
      todoManager.saveTodos();
    }
  });

  editInput.addEventListener('keyup', function (event) {
    event.stopPropagation();
    var todo;
    if (event.keyCode === 13) {
      todo = todoManager.todos[editContainer.todoId];
      todo.name = editInput.value;
      todo.derender();
      todo.render();
      this.value = "";
      todoManager.saveTodos();

      editContainer.style.display = 'none';
    }
  });

  /*
  On double click edit the todo
   */
  mainContainer.on("dblclick", "div", function () {
    var elem = this.querySelector('.cardText'),
      todoId = parseInt(this.id.split("_")[1]),
      todo = todoManager.todos[todoId];

    editInput.value = todo.name;
    editContainer.todoId = todoId;
    editContainer.style.display = 'block';
    editInput.focus();
  });

  mainContainer.on("click", "div > div", function () {
    var option = $(this).html(),
      selection,
      todoId = getParentTodoId(this);

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
        todoManager.removeTodo(todoId, -1);
        break;
    }
    todoManager.saveTodos();
  });

  todoManager.loadTodos();
  todoManager.renderAllTodos();
  input.focus();
});