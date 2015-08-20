
function createDiv (text) {
	var div = document.createElement('div');
	div.innerHTML = text;
	div.style.float = "right";
	div.style.border = "1px solid black";
	div.style.cursor = "pointer";
	div.style.width = "16px";
	div.style.textAlign = "center";
	return div;
}
// PROTOTYPES

/*
 * Returns the size of an array
*/
Array.prototype.size = function(){ 
	return this.filter(function(a){return a !== undefined;}).length
};

/*
 * Returns the size of an object
*/
Object.size = function(obj) {
    var size = 0, key = "";

    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


function TodoManager() {
	this.todos = [];
}

TodoManager.prototype.addTodo = function(todo) {
	this.todos.push(todo);
	todo.id = this.todos.size() - 1;

	return todo;
};

TodoManager.prototype.removeTodo = function(id) {
	this.todos[id].derender();
	this.todos[id] = undefined;
}

TodoManager.prototype.redrawTodo = function(todoId, x, y) {
	var todo = this.todos[todoId]
	todo.x = x;
	todo.y = y;

	todo.derender();
	todo.render();
}

TodoManager.prototype.saveTodos = function() {
	if(typeof(Storage) !== "undefined") {
    	localStorage.setItem("todos", JSON.stringify(this.todos));
	} else {
	    console.log("you don't have local storage :(");
	}
}

TodoManager.prototype.loadTodos = function() {
	this.todos = JSON.parse(localStorage.getItem("todos"));
	if (this.todos == null) this.todos = [];

	this.todos = this.todos.filter(function(elem){return elem !== undefined && elem !== null});
}

TodoManager.prototype.renderAllTodos = function() {
	this.todos.forEach(function(todo) {
		todo.__proto__ = Todo.prototype;
		todo.render();
	})
}

function Todo(name) {
	this.id = -1;
	this.name = name;
	this.depth = 100;
	this.x = 100;
	this.y = 100;
	this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
}

Todo.prototype.render = function() {
	var node = document.createElement('div'),
		text = document.createElement('div');

 	text.innerHTML = this.name
 	text.style.marginTop = "25px";
 	
	node.id = "todo_" + this.id;
	node.style.backgroundColor = this.color;
	node.style.border = "1px solid black";
	node.style.height = "150px";
	node.style.width = "150px";
	node.style.position = "fixed";
	node.style.left = this.x + "px";
	node.style.top = this.y + "px";
	node.style.cursor = "-webkit-grab";
	node.style.zIndex = this.depth;

	document.getElementById("mainContainer").appendChild(node);

	node.appendChild(createDiv('x'));
	node.appendChild(createDiv('-'));
	node.appendChild(createDiv('+'));
	node.appendChild(text);

	$("#todo_" + this.id).draggable();
}

Todo.prototype.derender = function() {
	var node = document.getElementById("todo_" + this.id);
	document.getElementById("mainContainer").removeChild(node);
}