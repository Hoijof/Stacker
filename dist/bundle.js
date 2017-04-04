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
}
},{}],3:[function(require,module,exports){
window.CONFIG = require('./config.js')

var prototypes = require('./prototypes'),
  Card = require('./models/Card'),
  CardManager = require('./models/CardManager');


var cardManager = CardManager.getInstance();

Object.assign(window, require('./prototypes'));


document.addEventListener('DOMContentLoaded', function () {
  "strict mode";

  var mainContainer = $("#mainContainer"),
    input = document.querySelector("#formContainer input"),
    editContainer = document.getElementById('editContainer'),
    editInput = editContainer.getElementsByClassName('input')[0];

  input.addEventListener('keyup', function (event) {
    event.stopPropagation();
    var card;
    if (event.keyCode === 13) {
      card = cardManager.addCard(new Card(input.value));
      card.render();
      this.value = "";
      cardManager.saveCards();
    }
  });

  editInput.addEventListener('keyup', function (event) {
    event.stopPropagation();
    var card;
    if (event.keyCode === 13) {
      card = cardManager.cards[editContainer.cardId];
      card.name = editInput.value;
      card.derender();
      card.render();
      this.value = "";
      cardManager.saveCards();

      editContainer.style.display = 'none';
    }
  });

  /*
   On double click edit the card
   */
  mainContainer.on("dblclick", "div", function () {
    var elem = this.querySelector('.cardText'),
      cardId,
      card;

    if (this.id === "") {
      cardId = parseInt(this.parentElement.id.split("_")[1]);
    } else {
      cardId = parseInt(this.id.split("_")[1]);
    }

    card = cardManager.cards[cardId];

    editInput.value = card.name;
    editContainer.cardId = cardId;
    editContainer.style.display = 'block';
    editInput.focus();
  });

  /*
   On click perform the card
   */
  mainContainer.on("click", "div", function (event) {
    var elem = this.querySelector('.cardText'),
      cardId = parseInt(this.id.split("_")[1]),
      card = cardManager.cards[cardId];

    if (event.ctrlKey) {
    }
    if (event.altKey) {
      this.querySelector('.copy').click();
    }
    if (event.shiftKey) {

    }
  });

  mainContainer.on("click", "div > div", function () {
    var option = $(this).html(),
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
  });

  cardManager.loadCards();
  cardManager.renderAllCards();
  input.focus();
});
},{"./config.js":1,"./models/Card":4,"./models/CardManager":5,"./prototypes":6}],4:[function(require,module,exports){
var pubsub = require('../lib/pubsub');

function Card(name) {
  this.id = -1;
  this.name = name;
  this.depth = 5;
  this.x = 100;
  this.y = 100;
  this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
}

Card.prototype.render = function () {
  var node = document.createElement('div'),
      text = document.createElement('div'),
      that = this;

  text.innerHTML = this.name;
  text.className = "cardText";

  node.id = "todo_" + this.id;
  node.className = "card card-1";
  node.style.position = "fixed";
  node.style.left = this.x;
  node.style.top = this.y;
  node.style.cursor = "-webkit-grab";
  node.style.zIndex = this.depth;

  document.getElementById("mainContainer").appendChild(node);

  node.appendChild(createDiv('x', "control remove"));
  node.appendChild(createDiv('+', "control up"));
  node.appendChild(createDiv('-', "control down"));
  node.appendChild(createDiv('C', "control copy"));
  node.appendChild(createDiv(this.depth, "depth"));

  node.appendChild(text);

  $("#todo_" + this.id).draggable({
    stop: function () {
      var card = $("#todo_" + that.id);
      that.x = card.css("left");
      that.y = card.css("top");

      // cardManager.saveCards();
      pubsub.pub(window.CONFIG.SAVE_CARDS);
    }
  });
};

Card.prototype.derender = function () {
  var node = document.getElementById("todo_" + this.id);
  document.getElementById("mainContainer").removeChild(node);
};

module.exports = Card;
},{"../lib/pubsub":2}],5:[function(require,module,exports){
var Card = require('./Card'),
  pubsub = require('../lib/pubsub');


function CardManager() {
  this.cards = [];
}

CardManager.prototype.addCard = function (card) {
  this.cards.push(card);
  card.id = this.cards.length - 1;

  return card;
};

CardManager.prototype.removeCard = function (id) {
  this.cards[id].derender();
  this.cards[id] = undefined;
};

CardManager.prototype.redrawCard = function (cardId, x, y) {
  var card = this.cards[cardId];
  card.x = x;
  card.y = y;

  card.derender();
  card.render();
};

CardManager.prototype.saveCards = function () {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem("cards", JSON.stringify(this.cards));
  } else {
    console.log("you don't have local storage :(");
  }
};

CardManager.prototype.loadCards = function () {
  var i;

  this.cards = JSON.parse(localStorage.getItem("cards"));
  if (this.cards === null) this.cards = [];

  this.clearArray();
};

CardManager.prototype.clearArray = function () {
  var i;

  this.cards = this.cards.filter(function (elem) {
    return elem !== undefined && elem !== null
  });
  for (i in this.cards) {
    if (this.cards.hasOwnProperty(i)) {
      this.cards[i].id = i;
    }
  }
};

CardManager.prototype.renderAllCards = function () {
  this.cards.forEach(function (card) {
    card.__proto__ = Card.prototype;
    card.render();
  })
};

CardManager.getInstance = function() {
  if (CardManager.instance === undefined) {
    CardManager.instance = new CardManager();
    pubsub.sub(window.CONFIG.SAVE_CARDS, CardManager.instance.saveCards, CardManager.instance);
  }

  return CardManager.instance;
}

module.exports = CardManager;
},{"../lib/pubsub":2,"./Card":4}],6:[function(require,module,exports){
var cardManager = require('./models/CardManager').getInstance();

function createDiv(text, className) {
  var div = document.createElement('div');
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
  var copysuccess; // var to check whether execCommand successfully executed
  try {
    copysuccess = document.execCommand("copy"); // run command to copy selected text to clipboard
  } catch (e) {
    copysuccess = false
  }
  return copysuccess
}

function selectText(element) {
  var doc = document
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
  var depth = parseInt(this.parentElement.style.zIndex) + increment;

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
  var size = 0, key = "";

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
