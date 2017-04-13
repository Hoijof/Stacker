(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var defaultPalette={50:["#FFEBEE","#FCE4EC","#F3E5F5","#EDE7F6","#E8EAF6","#E3F2FD","#E1F5FE","#E0F7FA","#E0F2F1","#E8F5E9","#F1F8E9","#F9FBE7","#FFFDE7","#FFF8E1","#FFF3E0","#FBE9E7","#EFEBE9","#FAFAFA","#ECEFF1"],100:["#FFCDD2","#F8BBD0","#E1BEE7","#D1C4E9","#C5CAE9","#BBDEFB","#B3E5FC","#B2EBF2","#B2DFDB","#C8E6C9","#DCEDC8","#F0F4C3","#FFF9C4","#FFECB3","#FFE0B2","#FFCCBC","#D7CCC8","#F5F5F5","#CFD8DC"],200:["#EF9A9A","#F48FB1","#CE93D8","#B39DDB","#9FA8DA","#90CAF9","#81D4FA","#80DEEA","#80CBC4","#A5D6A7","#C5E1A5","#E6EE9C","#FFF59D","#FFE082","#FFCC80","#FFAB91","#BCAAA4","#EEEEEE","#B0BEC5"],300:["#E57373","#F06292","#BA68C8","#9575CD","#7986CB","#64B5F6","#4FC3F7","#4DD0E1","#4DB6AC","#81C784","#AED581","#DCE775","#FFF176","#FFD54F","#FFB74D","#FF8A65","#A1887F","#E0E0E0","#90A4AE"],400:["#EF5350","#EC407A","#AB47BC","#7E57C2","#5C6BC0","#42A5F5","#29B6F6","#26C6DA","#26A69A","#66BB6A","#9CCC65","#D4E157","#FFEE58","#FFCA28","#FFA726","#FF7043","#8D6E63","#BDBDBD","#78909C"],500:["#F44336","#E91E63","#9C27B0","#673AB7","#3F51B5","#2196F3","#03A9F4","#00BCD4","#009688","#4CAF50","#8BC34A","#CDDC39","#FFEB3B","#FFC107","#FF9800","#FF5722","#795548","#9E9E9E","#607D8B"],600:["#E53935","#D81B60","#8E24AA","#5E35B1","#3949AB","#1E88E5","#039BE5","#00ACC1","#00897B","#43A047","#7CB342","#C0CA33","#FDD835","#FFB300","#FB8C00","#F4511E","#6D4C41","#757575","#546E7A"],700:["#D32F2F","#C2185B","#7B1FA2","#512DA8","#303F9F","#1976D2","#0288D1","#0097A7","#00796B","#388E3C","#689F38","#AFB42B","#FBC02D","#FFA000","#F57C00","#E64A19","#5D4037","#616161","#455A64"],800:["#C62828","#AD1457","#6A1B9A","#4527A0","#283593","#1565C0","#0277BD","#00838F","#00695C","#2E7D32","#558B2F","#9E9D24","#F9A825","#FF8F00","#EF6C00","#D84315","#4E342E","#424242","#37474F"],900:["#B71C1C","#880E4F","#4A148C","#311B92","#1A237E","#0D47A1","#01579B","#006064","#004D40","#1B5E20","#33691E","#827717","#F57F17","#FF6F00","#E65100","#BF360C","#3E2723","#212121","#263238"],A100:["#FF8A80","#FF80AB","#EA80FC","#B388FF","#8C9EFF","#82B1FF","#80D8FF","#84FFFF","#A7FFEB","#B9F6CA","#CCFF90","#F4FF81","#FFFF8D","#FFE57F","#FFD180","#FF9E80"],A200:["#FF5252","#FF4081","#E040FB","#7C4DFF","#536DFE","#448AFF","#40C4FF","#18FFFF","#64FFDA","#69F0AE","#B2FF59","#EEFF41","#FFFF00","#FFD740","#FFAB40","#FF6E40"],A400:["#FF1744","#F50057","#D500F9","#651FFF","#3D5AFE","#2979FF","#00B0FF","#00E5FF","#1DE9B6","#00E676","#76FF03","#C6FF00","#FFEA00","#FFC400","#FF9100","#FF3D00"],A700:["#D50000","#C51162","#AA00FF","#6200EA","#304FFE","#2962FF","#0091EA","#00B8D4","#00BFA5","#00C853","#64DD17","#AEEA00","#FFD600","#FFAB00","#FF6D00","#DD2C00"]},murmur=require("murmurhash-js");module.exports=function(){var F=[],E={shades:["500"],palette:defaultPalette,text:null,ignoreColors:[]},C=function(C){C||(C=E),C.palette||(C.palette=defaultPalette),C.shades||(C.shades=["500"]);for(var B,D=F.length,t=0;D>t;t++)if(C.text&&F[t].text===C.text)return F[t].color;return B=A(C),C.text&&F.push({text:C.text,color:B}),B},A=function(F){var E=F.shades[B(F.shades.length)],C="";for(var A in F.palette)F.palette.hasOwnProperty(A)&&A===E&&(C=F.text?F.palette[A][D(F.text,F.palette[A].length)]:F.palette[A][B(F.palette[A].length)]);return C},B=function(F){return Math.floor(Math.random()*F)},D=function(F,E){var C=murmur.murmur3(F)/1e10;return.1>C&&(C=10*C),Math.floor(C*E)};return{getColor:C}}();
},{"murmurhash-js":2}],2:[function(require,module,exports){
var murmur3 = require("./murmurhash3_gc.js")
var murmur2 = require("./murmurhash2_gc.js")

module.exports = murmur3
module.exports.murmur3 = murmur3
module.exports.murmur2 = murmur2

},{"./murmurhash2_gc.js":3,"./murmurhash3_gc.js":4}],3:[function(require,module,exports){
/**
 * JS Implementation of MurmurHash2
 * 
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 * 
 * @param {string} str ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */

function murmurhash2_32_gc(str, seed) {
  var
    l = str.length,
    h = seed ^ l,
    i = 0,
    k;
  
  while (l >= 4) {
  	k = 
  	  ((str.charCodeAt(i) & 0xff)) |
  	  ((str.charCodeAt(++i) & 0xff) << 8) |
  	  ((str.charCodeAt(++i) & 0xff) << 16) |
  	  ((str.charCodeAt(++i) & 0xff) << 24);
    
    k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    k ^= k >>> 24;
    k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));

	h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;

    l -= 4;
    ++i;
  }
  
  switch (l) {
  case 3: h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
  case 2: h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
  case 1: h ^= (str.charCodeAt(i) & 0xff);
          h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
  }

  h ^= h >>> 13;
  h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
  h ^= h >>> 15;

  return h >>> 0;
}

if(typeof module !== undefined) {
  module.exports = murmurhash2_32_gc
}

},{}],4:[function(require,module,exports){
/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 * 
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 * 
 * @param {string} key ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash 
 */

function murmurhash3_32_gc(key, seed) {
	var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;
	
	remainder = key.length & 3; // key.length % 4
	bytes = key.length - remainder;
	h1 = seed;
	c1 = 0xcc9e2d51;
	c2 = 0x1b873593;
	i = 0;
	
	while (i < bytes) {
	  	k1 = 
	  	  ((key.charCodeAt(i) & 0xff)) |
	  	  ((key.charCodeAt(++i) & 0xff) << 8) |
	  	  ((key.charCodeAt(++i) & 0xff) << 16) |
	  	  ((key.charCodeAt(++i) & 0xff) << 24);
		++i;
		
		k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

		h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
		h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
		h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
	}
	
	k1 = 0;
	
	switch (remainder) {
		case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
		case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
		case 1: k1 ^= (key.charCodeAt(i) & 0xff);
		
		k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
		h1 ^= k1;
	}
	
	h1 ^= key.length;

	h1 ^= h1 >>> 16;
	h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
	h1 ^= h1 >>> 13;
	h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
	h1 ^= h1 >>> 16;

	return h1 >>> 0;
}

if(typeof module !== "undefined") {
  module.exports = murmurhash3_32_gc
}
},{}],5:[function(require,module,exports){
module.exports = {
  SAVE_CARDS: 'SAVE_CARDS'
}
},{}],6:[function(require,module,exports){

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
},{}],7:[function(require,module,exports){
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
  editContainer.addEventListener('click', hideEditContainer);
  editInput.addEventListener('click', stopPropagation);
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

function hideEditContainer() {
  editContainer.style.display = 'none';
}

function stopPropagation (e) {
  e.stopPropagation();
}

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
    hideEditContainer();
  } else if (event.keyCode === 27) {
    hideEditContainer()
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
  } else if (event.keyCode === 27) {
    hideEditContainer()
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
  editInput.style.top = card.y;
  editInput.style.left = card.x;
  editInput.style["padding-top"] = '23px';
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
},{"./config.js":5,"./models/Card":8,"./models/CardManager":9,"./prototypes":10}],8:[function(require,module,exports){
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
    });

    return this;
  },
  getBackgroundColor2: function () {
    let c = Math.floor(Math.random() * 16777215).toString(16),  // strip #
     rgb = parseInt(c, 16),   // convert rrggbb to decimal
     r = (rgb >> 16) & 0xff,  // extract red
     g = (rgb >>  8) & 0xff, // extract green
     b = (rgb >>  0) & 0xff,  // extract blue
     // luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
     luma =(r + g + b)/3;

    if (luma < 128) {
      console.log ("not enough luma! " + luma);
      return this.getBackgroundColor();
    }
    return "#" + c;
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
},{"../lib/pubsub":6,"random-material-color":1}],9:[function(require,module,exports){
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
},{"../lib/pubsub":6,"./Card":8}],10:[function(require,module,exports){
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
},{"./models/CardManager":9}]},{},[7])

//# sourceMappingURL=bundle.js.map
