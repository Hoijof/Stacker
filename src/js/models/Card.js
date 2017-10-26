let pubsub = require('../lib/pubsub');
let randomMC = require('random-material-color');

let Card = {
  init: function (title, description, pristine) {
    this.id = -1;
    this.title = title;
    this.description = description;
    this.depth = 5;
    this.x = 100;
    this.y = 100;
    this.color = this.getBackgroundColor();
    this.selected = false;
    this.isArchived = false;
    this.isDeleted = false;
    this.createdAt = +new Date();
    this.archivedAt = null;
    this.isPristine = true;

    return this;
  },
  render: function (always = false) {
    if (this.isDeleted === true && always === false) {
      return;
    }

    let node = document.createElement('div');
    let title = document.createElement('div');
    let text = document.createElement('div');
    let link = this.findLink();
    let that = this;

    if (this.title) {
      if (link) {
        title.innerHTML = `<a target="_blank" href="${link}">${this.title}</a>`;
      } else {
        title.innerHTML = this.title;
      }
    } else {
      if (link) {
        title.innerHTML = `<a target="_blank" href="${link}">Link!</a>`;
      }
    }

    if (this.description) {
      text.innerHTML = this.description.replace(/\r?\n/g, '<br/>');
    }

    title.className = 'cardTitle';
    text.className = 'cardText';

    node.id = 'todo_' + this.id;
    node.className = 'card card-1';
    node.style.position = 'fixed';
    node.style.left = this.x;
    node.style.top = this.y;
    node.style.cursor = '-webkit-grab';
    node.style.zIndex = this.depth;
    node.style.backgroundColor = this.color;

    document.getElementById('mainContainer').appendChild(node);

    node.appendChild(createDiv('x', 'control remove'));
    // node.appendChild(createDiv('+', 'control up'));
    // node.appendChild(createDiv('-', 'control down'));
    node.appendChild(createDiv('C', 'control copy'));
    node.appendChild(createDiv('depth: ' + this.depth, 'depth'));
    // node.appendChild(createDiv(this.isArchived ? 'V' : 'O', 'isArchived'));
    node.appendChild(createDiv('id: ' + this.id, 'id'));

    node.appendChild(title);
    node.appendChild(text);

    $('#todo_' + this.id).draggable({
      stop: function () {
        let card = $('#todo_' + that.id);

        if (that.isPristine === true) {
          that.isPristine = false;

          pubsub.pub(window.CONFIG.LESS_PRISTINE);
        }

        that.x = +card.css('left').replace('px', '');
        that.y = +card.css('top').replace('px', '');

        pubsub.pub(window.CONFIG.SELECT_CARD, [that.id]);
        pubsub.pub(window.CONFIG.SAVE_CARDS);
      }
    });

    this.node = node;

    if (this.selected === true) {
      node.classList.add('selected');
    }

    if (this.isArchived) {
      node.classList.add('completed');
    }

    return this;
  },
  getBackgroundColor: function () {
    return randomMC.getColor({ shades: ['200', '300'] });
  },
  derender: function () {
    let node = document.getElementById('todo_' + this.id);
    document.getElementById('mainContainer').removeChild(node);

    return this;
  },
  toggleArchived: function () {
    if (this.isArchived === false || this.isArchived === undefined) {
      this.node.classList.remove('notCompleted');
      void this.node.offsetWidth;
      this.node.classList.add('completed');
      this.archivedAt = +new Date();
    } else {
      this.node.classList.remove('completed');
      void this.node.offsetWidth;
      this.node.classList.add('notCompleted');
      this.archivedAt = null;
    }

    this.isArchived = !this.isArchived;

    pubsub.pub(window.CONFIG.SAVE_CARDS);
  },
  delete: function () {
    this.isDeleted = true;

    this.derender();
  },
  undelete: function () {
    this.isDeleted = false;

    this.render();

    return this;
  },
  findLink: function () {
    const regex = /(https?:\/\/[^\s]+|www.[^\s]+)/;
    let link = regex.exec(this.title);

    if (link == null) {
      link = regex.exec(this.description);
    }

    if (link) {
      return link[0];
    }
  }
};

module.exports = Card;
