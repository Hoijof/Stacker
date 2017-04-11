(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  SAVE_CARDS: 'SAVE_CARDS'
}
},{}],2:[function(require,module,exports){

var subs = {};


function pub(name, params) {
  subs[name].forEach(function(elem) {
    elem.callback.apply(elem.context, params);
  });
}

function sub(name, callback, context) {
  if (subs[name] === undefined) {
    subs[name] = [];
  }

  subs[name].push({
    callback: callback,
    context: context
  });
}


module.exports = {
  pub: pub,
  sub: sub
};
},{}],3:[function(require,module,exports){
window.CONFIG = require('./config.js');

let prototypes = require('./prototypes'),
  Card = require('./models/Card'),
  CardManager = require('./models/CardManager');

let mainContainer,
  input,
  editContainer,
  editInput;


let cardManager = CardManager.getInstance();

Object.assign(window, require('./prototypes'));


document.addEventListener('DOMContentLoaded', function () {
  'strict mode';

  mainContainer = $('#mainContainer');
  input = document.querySelector('#formContainer input');
  editContainer = document.getElementById('editContainer');
  editInput = editContainer.getElementsByClassName('textarea')[0];


  window.addEventListener('keydown', keyHandler, false);
  input.addEventListener('keydown', mainInputKeyEvent);
  editInput.addEventListener('keydown', editInputKeyEvent);
  /*
   On double click edit the card
   */
  mainContainer.on('dblclick', 'div', doubleClickHandler);
  /*
   On click perform the card
   */
  mainContainer.on('click', 'div', cardClickEvents);
  mainContainer.on('click', 'div > div', cardMenuEvents);


  cardManager.loadCards();
  cardManager.renderAllCards();
  input.focus();
});


function mainInputKeyEvent (event) {
  event.stopPropagation();
  let card;

  if (event.keyCode === 13) {
    card = cardManager.addCard(Object.create(Card, {}).init(input.value));
    card.render();
    this.value = '';
    cardManager.saveCards();
  }
}

function editInputKeyEvent (event) {
  event.stopPropagation();
  let card;
  if (event.keyCode === 13 && event.shiftKey) return;
  if (event.keyCode === 13) {
    card = cardManager.cards[editContainer.cardId];
    card.name = editInput.value;
    card.derender();
    card.render();
    this.value = '';
    cardManager.saveCards();

    editContainer.style.display = 'none';
  }
}

function keyHandler (e) {
  let TABKEY = 9;
  if (e.keyCode === TABKEY) {
    if (event.shiftKey) {
      console.log('MoveToPreviousCard');
    } else {
      console.log('MoveToNextCard');
    }
    if (e.preventDefault) {
      e.preventDefault();
    }
    return false;
  }
}

function doubleClickHandler () {
  let elem = this.querySelector('.cardText'),
    cardId,
    card;

  if (this.id === '') {
    cardId = parseInt(this.parentElement.id.split('_')[1]);
  } else {
    cardId = parseInt(this.id.split('_')[1]);
  }

  card = cardManager.cards[cardId];

  editInput.value = card.name;
  editContainer.cardId = cardId;
  editContainer.style.display = 'block';
  editInput.focus();
}

function cardClickEvents (event) {
  let elem = this.querySelector('.cardText'),
    cardId = parseInt(this.id.split('_')[1]),
    card = cardManager.cards[cardId];

  if (event.ctrlKey) {
  }
  if (event.altKey) {
    this.querySelector('.copy').click();
  }
  if (event.shiftKey) {

  }
}

function cardMenuEvents () {
  let option = $(this).html(),
    selection,
    cardId = getParentCardId(this);

  switch (option) {
    case '+':
      changeDepth.apply(this, [cardId, 1]);
      break;
    case '-':
      changeDepth.apply(this, [cardId, -1]);
      break;
    case 'C':
      selection = selectText(this.parentElement.getElementsByClassName('cardText')[0]);
      copySelectionText();
      selection.empty();
      break;
    case 'x':
      cardManager.removeCard(cardId, -1);
      break;
  }
  cardManager.saveCards();
}
},{"./config.js":1,"./models/Card":4,"./models/CardManager":5,"./prototypes":6}],4:[function(require,module,exports){
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
},{"../lib/pubsub":2}],5:[function(require,module,exports){
const Card = require('./Card'),
  pubsub = require('../lib/pubsub');

let CardManager = {
  init: function () {
    this.cards = [];

    return this;
  },
  addCard: function (card) {
    this.cards.push(card);
    card.id = this.cards.length - 1;

    return card;
  },
  removeCard: function (id) {
    this.cards[id].derender();
    this.cards[id] = undefined;

    return this;
  },
  redrawCard: function (cardId, x, y) {
    let card = this.cards[cardId];
    card.x = x;
    card.y = y;

    card.derender();
    card.render();

    return this;
  },
  saveCards: function () {
    if (typeof(Storage) !== 'undefined') {
      localStorage.setItem('cards', JSON.stringify(this.cards));
    } else {
      console.log('you don\'t have local storage :(');
    }

    return this;
  },
  loadCards: function () {
    let i;

    this.cards = JSON.parse(localStorage.getItem('cards'));
    if (this.cards === null) this.cards = [];

    this.clearArray();

    return this;
  },
  clearArray: function () {
    let i;

    this.cards = this.cards.filter(function (elem) {
      return elem !== undefined && elem !== null;
    });
    for (i in this.cards) {
      if (this.cards.hasOwnProperty(i)) {
        this.cards[i].id = i;
      }
    }

    return this;
  },
  renderAllCards: function () {
    this.cards.forEach(function (card) {
      // card.__proto__ = Card.prototype;
      Object.setPrototypeOf(card, Card);
      card.render();
    });

    return this;
  },
  getInstance: function () {
    if (CardManager.instance === undefined) {
      CardManager.instance = Object.create(CardManager, {});
      pubsub.sub(window.CONFIG.SAVE_CARDS, CardManager.instance.saveCards, CardManager.instance);
    }

    return CardManager.instance;

  },
};

module.exports = CardManager;
},{"../lib/pubsub":2,"./Card":4}],6:[function(require,module,exports){
let cardManager = require('./models/CardManager').getInstance();

function createDiv(text, className) {
  let div = document.createElement('div');
  div.innerHTML = text;
  div.style.float = "right";
  div.style.cursor = "pointer";
  div.style.width = "16px";
  div.style.textAlign = "center";

  if (className !== undefined) {
    div.className = className;
  }

  return div;
}

function copySelectionText() {
  let copysuccess; // let to check whether execCommand successfully executed
  try {
    copysuccess = document.execCommand("copy"); // run command to copy selected text to clipboard
  } catch (e) {
    copysuccess = false
  }
  return copysuccess
}

function selectText(element) {
  let doc = document
    , text = element
    , range, selection
    ;
  if (doc.body.createTextRange) {
    range = document.body.createTextRange();
    range.moveToElementText(text);
    range.select();
  } else if (window.getSelection) {
    selection = window.getSelection();
    range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
    return selection;
  }
}

function getParentCardId(context) {
  if (context.parentElement === null) return;
  return parseInt(context.parentElement.id.split("_")[1]);
}

function changeDepth(cardId, increment) {
  let depth = parseInt(this.parentElement.style.zIndex) + increment;

  this.parentElement.style.zIndex = depth;
  cardManager.cards[cardId].depth = depth;
  this.parentElement.getElementsByClassName("depth")[0].innerHTML = depth;
}

// PROTOTYPES

/*
 * Returns the size of an array
 */
Array.prototype.size = function () {
  return this.filter(function (a) {
    return a !== undefined;
  }).length
};

/*
 * Returns the size of an object
 */
Object.size = function (obj) {
  let size = 0, key = "";

  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

module.exports = {
  createDiv: createDiv,
  copySelectionText: copySelectionText,
  selectText: selectText,
  getParentCardId: getParentCardId,
  changeDepth: changeDepth
}
},{"./models/CardManager":5}]},{},[3])

//# sourceMappingURL=bundle.js.map
