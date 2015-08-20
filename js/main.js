var todoManager = new TodoManager();


document.addEventListener('DOMContentLoaded', function() {
	"strict mode";
	var input = document.querySelector("#formContainer input");

	input.addEventListener('keyup', function(event) {
		event.stopPropagation();
		var todo = ""
		if (event.keyCode === 13) {
			todo = todoManager.addTodo(new Todo(input.value));
			todo.render();
			this.value = "";
			todoManager.saveTodos();
		}		
	});

	$("#mainContainer").on("click", "div > div", function() {
		var option = $(this).html(),
			todoId = parseInt(this.parentElement.id.split("_")[1]),
			depth = 0;

		switch (option) {
			case '+':
				depth = parseInt(this.parentElement.style.zIndex) + 1;

				this.parentElement.style.zIndex = depth;
				todoManager.todos[todoId].depth = depth;
				this.parentElement.getElementsByClassName("depth")[0].innerHTML = depth;
			break;
			case '-':
				depth = parseInt(this.parentElement.style.zIndex) - 1;

				this.parentElement.style.zIndex = depth;
				todoManager.todos[todoId].depth = depth;
				this.parentElement.getElementsByClassName("depth")[0].innerHTML = depth;
			break;
			case 'x':
				todoManager.removeTodo(todoId, -1);
			break;
		}
		todoManager.saveTodos();
	});

	document.addEventListener("keyup", function(e) {
		input.focus();
		$(input).val($(input).val() + String.fromCharCode(e.keyCode));
	});

	todoManager.loadTodos();
	todoManager.renderAllTodos();
	input.focus();
});