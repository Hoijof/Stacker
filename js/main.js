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
			todoId = parseInt(this.parentElement.id.split("_")[1]);

		switch (option) {
			case '+':
				this.parentElement.style.zIndex = parseInt(this.parentElement.style.zIndex + 1);
			break;
			case '-':
				this.parentElement.style.zIndex = parseInt(this.parentElement.style.zIndex - 1);
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