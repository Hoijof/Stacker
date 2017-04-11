let pubsub = require('../lib/pubsub');

let Card = {
  init: function (name) {
    this.id = -1;
    this.name = name;
    this.depth = 5;
    this.x = 100;
    this.y = 100;
    this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);

    return this;
  },
  render: function () {
    let node = document.createElement('div'),
      text = document.createElement('div'),
      that = this;

    text.innerHTML = this.name;
    text.className = 'cardText';

    node.id = 'todo_' + this.id;
    node.className = 'card card-1';
    node.style.position = 'fixed';
    node.style.left = this.x;
    node.style.top = this.y;
    node.style.cursor = '-webkit-grab';
    node.style.zIndex = this.depth;

    document.getElementById('mainContainer').appendChild(node);

    node.appendChild(createDiv('x', 'control remove'));
    node.appendChild(createDiv('+', 'control up'));
    node.appendChild(createDiv('-', 'control down'));
    node.appendChild(createDiv('C', 'control copy'));
    node.appendChild(createDiv(this.depth, 'depth'));

    node.appendChild(text);

    $('#todo_' + this.id).draggable({
      stop: function () {
        let card = $('#todo_' + that.id);
        that.x = card.css('left');
        that.y = card.css('top');

        // cardManager.saveCards();
        pubsub.pub(window.CONFIG.SAVE_CARDS);
      },
    }).html(this.name.replace(/\r?\n/g,'<br/>'));;

    return this;
  },
  derender: function () {
    let node = document.getElementById('todo_' + this.id);
    document.getElementById('mainContainer').removeChild(node);

    return this;
  },
};

module.exports = Card;