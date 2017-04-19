let pubsub = require('../lib/pubsub'),
  randomMC = require('random-material-color');


let Card = {
  init: function (name) {
    this.id = -1;
    this.name = name;
    this.depth = 5;
    this.x = 100;
    this.y = 100;
    this.color = this.getBackgroundColor();
    this.selected = false;

    return this;
  },
  render: function () {
    let node = document.createElement('div'),
      text = document.createElement('div'),
      that = this;

    text.innerHTML = this.name.replace(/\r?\n/g,'<br/>');
    text.className = 'cardText';

    node.id = 'todo_' + this.id;
    node.className = 'card card-1';
    node.style.position = 'fixed';
    node.style.left = this.x;
    node.style.top = this.y;
    node.style.cursor = '-webkit-grab';
    node.style.zIndex = this.depth;
    node.style.backgroundColor = this.color;

    if (this.selected === true) {
      node.classList.add('selected');
    }

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

        pubsub.pub(window.CONFIG.SELECT_CARD, [that.id]);
        pubsub.pub(window.CONFIG.SAVE_CARDS);
      },
    });

    this.node = node;

    return this;
  },
  getBackgroundColor: function () {
    return randomMC.getColor({ shades: ['200', '300']});
  },
  derender: function () {
    let node = document.getElementById('todo_' + this.id);
    document.getElementById('mainContainer').removeChild(node);

    return this;
  },
};

module.exports = Card;