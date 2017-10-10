(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var murmur3 = require("./murmurhash3_gc.js")
var murmur2 = require("./murmurhash2_gc.js")

module.exports = murmur3
module.exports.murmur3 = murmur3
module.exports.murmur2 = murmur2

},{"./murmurhash2_gc.js":2,"./murmurhash3_gc.js":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
var defaultPalette={50:["#FFEBEE","#FCE4EC","#F3E5F5","#EDE7F6","#E8EAF6","#E3F2FD","#E1F5FE","#E0F7FA","#E0F2F1","#E8F5E9","#F1F8E9","#F9FBE7","#FFFDE7","#FFF8E1","#FFF3E0","#FBE9E7","#EFEBE9","#FAFAFA","#ECEFF1"],100:["#FFCDD2","#F8BBD0","#E1BEE7","#D1C4E9","#C5CAE9","#BBDEFB","#B3E5FC","#B2EBF2","#B2DFDB","#C8E6C9","#DCEDC8","#F0F4C3","#FFF9C4","#FFECB3","#FFE0B2","#FFCCBC","#D7CCC8","#F5F5F5","#CFD8DC"],200:["#EF9A9A","#F48FB1","#CE93D8","#B39DDB","#9FA8DA","#90CAF9","#81D4FA","#80DEEA","#80CBC4","#A5D6A7","#C5E1A5","#E6EE9C","#FFF59D","#FFE082","#FFCC80","#FFAB91","#BCAAA4","#EEEEEE","#B0BEC5"],300:["#E57373","#F06292","#BA68C8","#9575CD","#7986CB","#64B5F6","#4FC3F7","#4DD0E1","#4DB6AC","#81C784","#AED581","#DCE775","#FFF176","#FFD54F","#FFB74D","#FF8A65","#A1887F","#E0E0E0","#90A4AE"],400:["#EF5350","#EC407A","#AB47BC","#7E57C2","#5C6BC0","#42A5F5","#29B6F6","#26C6DA","#26A69A","#66BB6A","#9CCC65","#D4E157","#FFEE58","#FFCA28","#FFA726","#FF7043","#8D6E63","#BDBDBD","#78909C"],500:["#F44336","#E91E63","#9C27B0","#673AB7","#3F51B5","#2196F3","#03A9F4","#00BCD4","#009688","#4CAF50","#8BC34A","#CDDC39","#FFEB3B","#FFC107","#FF9800","#FF5722","#795548","#9E9E9E","#607D8B"],600:["#E53935","#D81B60","#8E24AA","#5E35B1","#3949AB","#1E88E5","#039BE5","#00ACC1","#00897B","#43A047","#7CB342","#C0CA33","#FDD835","#FFB300","#FB8C00","#F4511E","#6D4C41","#757575","#546E7A"],700:["#D32F2F","#C2185B","#7B1FA2","#512DA8","#303F9F","#1976D2","#0288D1","#0097A7","#00796B","#388E3C","#689F38","#AFB42B","#FBC02D","#FFA000","#F57C00","#E64A19","#5D4037","#616161","#455A64"],800:["#C62828","#AD1457","#6A1B9A","#4527A0","#283593","#1565C0","#0277BD","#00838F","#00695C","#2E7D32","#558B2F","#9E9D24","#F9A825","#FF8F00","#EF6C00","#D84315","#4E342E","#424242","#37474F"],900:["#B71C1C","#880E4F","#4A148C","#311B92","#1A237E","#0D47A1","#01579B","#006064","#004D40","#1B5E20","#33691E","#827717","#F57F17","#FF6F00","#E65100","#BF360C","#3E2723","#212121","#263238"],A100:["#FF8A80","#FF80AB","#EA80FC","#B388FF","#8C9EFF","#82B1FF","#80D8FF","#84FFFF","#A7FFEB","#B9F6CA","#CCFF90","#F4FF81","#FFFF8D","#FFE57F","#FFD180","#FF9E80"],A200:["#FF5252","#FF4081","#E040FB","#7C4DFF","#536DFE","#448AFF","#40C4FF","#18FFFF","#64FFDA","#69F0AE","#B2FF59","#EEFF41","#FFFF00","#FFD740","#FFAB40","#FF6E40"],A400:["#FF1744","#F50057","#D500F9","#651FFF","#3D5AFE","#2979FF","#00B0FF","#00E5FF","#1DE9B6","#00E676","#76FF03","#C6FF00","#FFEA00","#FFC400","#FF9100","#FF3D00"],A700:["#D50000","#C51162","#AA00FF","#6200EA","#304FFE","#2962FF","#0091EA","#00B8D4","#00BFA5","#00C853","#64DD17","#AEEA00","#FFD600","#FFAB00","#FF6D00","#DD2C00"]},murmur=require("murmurhash-js");module.exports=function(){var F=[],E={shades:["500"],palette:defaultPalette,text:null,ignoreColors:[]},C=function(C){C||(C=E),C.palette||(C.palette=defaultPalette),C.shades||(C.shades=["500"]);for(var B,D=F.length,t=0;D>t;t++)if(C.text&&F[t].text===C.text)return F[t].color;return B=A(C),C.text&&F.push({text:C.text,color:B}),B},A=function(F){var E=F.shades[B(F.shades.length)],C="";for(var A in F.palette)F.palette.hasOwnProperty(A)&&A===E&&(C=F.text?F.palette[A][D(F.text,F.palette[A].length)]:F.palette[A][B(F.palette[A].length)]);return C},B=function(F){return Math.floor(Math.random()*F)},D=function(F,E){var C=murmur.murmur3(F)/1e10;return.1>C&&(C=10*C),Math.floor(C*E)};return{getColor:C}}();
},{"murmurhash-js":1}],5:[function(require,module,exports){
module.exports = {
  SAVE_CARDS: 'SAVE_CARDS',
  SELECT_CARD: 'SELECT_CARD',
  RERENDER: 'RERENDER',
  ASCII: {
    ESCAPE_KEY: 27,
    TAB_KEY: 9,
    C_KEY: 67,
    D_KEY: 68,
    E_KEY: 69,
    PLUS_KEY: 187,
    MINUS_KEY: 189,
    DOT_KEY: 190,
    A_KEY: 65,
    I_KEY: 73,
    R_KEY: 82,
    Z_KEY: 90,
    KEYS_ARRAY: [27, 9, 67, 68, 69, 187, 189, 190, 65, 73, 82, 90],
  },
  DEFAULT_CONTENT: 'W3siaWQiOiIwIiwibmFtZSI6IlVzZSB0YWIgYW5kIHNoaWZ0IHRhYiB0byBjaXJjbGUgYmV0d2VlbiBjYXJkcyA6RFxuXG5EcmFnZ2luZyBvciBjbGlja2luZyB0aGVtIHdpbGwgYWxzbyBtYXJrIHRoZW0gYXMgc2VsZWN0ZWQiLCJkZXB0aCI6NSwieCI6IjEyM3B4IiwieSI6IjU5cHgiLCJjb2xvciI6IiM0REQwRTEiLCJzZWxlY3RlZCI6dHJ1ZSwibm9kZSI6eyJqUXVlcnkxNzIwODI0MDE1NTE1MTY1MDg3OSI6NH19LHsiaWQiOiIxIiwibmFtZSI6Ik9uIGEgbWFya2VkIGNhcmQgdXNlOlxuJ2MnIHRvIGNvcHkgdGhlIGNvbnRlbnRcbidkJyB0byBkZWxldGUgaXRcbidlJyB0byBlZGl0IGl0XG4nKycgYW5kICctJyB0byBtb2RpZnkgdGhlIGRlcHRoIG9mIHRoZSBjYXJkIGFuZCAnLicgdG8gcmVzZXQgaXRcbidhJyB0byBhcmNoaXZlIG9yIGRlYXJjaGl2ZSBkZSBjYXJkXG4naScgdG8gZm9jdXMgb24gdGhlIGFkZCBuZXcgY2FyZCBpbnB1dCIsImRlcHRoIjo2LCJ4IjoiMzQycHgiLCJ5IjoiNTRweCIsImNvbG9yIjoiIzgwQ0JDNCIsInNlbGVjdGVkIjpmYWxzZSwibm9kZSI6eyJqUXVlcnkxNzIwODI0MDE1NTE1MTY1MDg3OSI6N319LHsiaWQiOiIyIiwibmFtZSI6IldoaWxlIGVkaXRpbmcgdXNlIHNoaWZ0ICsgZW50ZXIgdG8gXG5pbnNlcnRcbmFcbmxpbmVcbmJyZWFrXG46RCIsImRlcHRoIjo1LCJ4IjoiMTIxcHgiLCJ5IjoiMjczcHgiLCJjb2xvciI6IiM2NEI1RjYiLCJzZWxlY3RlZCI6ZmFsc2UsIm5vZGUiOnsialF1ZXJ5MTcyMDgyNDAxNTUxNTE2NTA4NzkiOjZ9fV0=',
  VERSION: '0.5.0',
};
},{}],6:[function(require,module,exports){
const CONFIG = require('../config');

let cardManager,
    Card = require('../models/Card');

let mainContainer,
    input,
    editContainer,
    editInput,
    importContainer,
    importInput,
    exportContainer,
    exportContent,
    importButton;


function init(options) {
    cardManager = options.cardManager;
    bindings();
}

function bindings() {
    mainContainer = $('#mainContainer');
    input = document.querySelector('#formContainer input');
    editContainer = document.getElementById('editContainer');
    editInput = editContainer.getElementsByClassName('textarea')[0];
    importContainer = document.getElementById('importContainer');
    importInput = importContainer.getElementsByClassName('input')[0];
    importButton = importContainer.getElementsByClassName('button')[0];
    exportContainer = document.getElementById('exportContainer');
    exportContent = exportContainer.getElementsByTagName('div')[0];


    window.addEventListener('keyup', keyHandlerUp, false);
    window.addEventListener('keydown', keyHandlerDown, false);
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
    document.getElementById('export').addEventListener('click', exportCards);
    document.getElementById('import').addEventListener('click', showImporter);
    importButton.addEventListener('click', loadImportCardsCode);
    importContainer.addEventListener('click', hideImportContainer);
    importInput.addEventListener('keydown', importInputKeyEvent);
    importInput.addEventListener('click', stopPropagation);
    exportContainer.addEventListener('click', hideExportContainer);
    exportContent.addEventListener('click', stopPropagation);
}

function keyHandlerDown(e) {

    if (e.keyCode === CONFIG.ASCII.TAB_KEY) {
        document.activeElement.blur();
        if (event.shiftKey) {
            cardManager.previousCard();
        } else {
            cardManager.nextCard();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
    }
}

function keyHandlerUp(e) {
    console.log(e.keyCode);
    if (document.activeElement !== document.body || CONFIG.ASCII.KEYS_ARRAY.indexOf(e.keyCode) === -1) {
        return;
    }
    e.stopPropagation();
    e.preventDefault();

    switch (e.keyCode) {
        case CONFIG.ASCII.C_KEY:
            if (event.ctrlKey) {
                let elem = cardManager.selectedCard.node,
                    selection;

                selection = selectText(elem.getElementsByClassName('cardText')[0]);
                copySelectionText();
                selection.empty();
            }

            break;
        case CONFIG.ASCII.D_KEY:
            if (event.ctrlKey) {
                let card = cardManager.selectedCard;
                cardManager.nextCard();

                cardManager.deleteCard(card);

                cardManager.saveCards();
            }
            break;
        case CONFIG.ASCII.E_KEY:
            if (event.ctrlKey) {
                doubleClickHandler.apply(cardManager.selectedCard.node);
            }
            break;
        case CONFIG.ASCII.A_KEY:
            if (event.ctrlKey) {
                cardManager.selectedCard.toggleArchived();
            }
            break;
        case CONFIG.ASCII.I_KEY:
            if (event.ctrlKey) {
                input.focus();
            }
            break;
        case CONFIG.ASCII.PLUS_KEY:
            changeDepth.apply(cardManager.selectedCard.node, [cardManager.selectedCard.id, 1]);
            break;
        case CONFIG.ASCII.MINUS_KEY:
            changeDepth.apply(cardManager.selectedCard.node, [cardManager.selectedCard.id, -1]);
            break;
        case CONFIG.ASCII.DOT_KEY:
            setDepth.apply(cardManager.selectedCard.node, [cardManager.selectedCard.id, 5]);
            break;
        case CONFIG.ASCII.R_KEY:
            cardManager.selectedCard.color = cardManager.selectedCard.getBackgroundColor();
            cardManager.selectedCard.derender();
            cardManager.selectedCard.render();
            break;
        case CONFIG.ASCII.Z_KEY:
            if (event.ctrlKey) {
                cardManager.undeleteLastCard();
            }
            break;
    }
}

function hideExportContainer() {
    exportContainer.style.display = 'none';
}

function hideEditContainer() {
    editContainer.style.display = 'none';
}

function hideImportContainer() {
    importContainer.style.display = 'none';
}

function stopPropagation(e) {
    e.stopPropagation();
}

function mainInputKeyEvent(event) {
    let card;

    if (event.keyCode === 13) {
        card = cardManager.addCard(Object.create(Card, {}).init(input.value));
        card.render();
        this.value = '';
        cardManager.saveCards();
        cardManager.selectCard(card.id);
    }
}

function editInputKeyEvent(event) {
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
        hideEditContainer();
    }

}

function importInputKeyEvent(event) {
    if (event.keyCode === 27) {
        hideImportContainer();
    }
}

function doubleClickHandler() {
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
    editInput.style['padding-top'] = '23px';
    editInput.focus();
}

function cardClickEvents(event) {
    let elem = this.querySelector('.cardText'),
        cardId,
        card;

    if (this.id === "") {
        cardId = parseInt(this.parentElement.id.split('_')[1]);
    } else {
        cardId = parseInt(this.id.split('_')[1]);
    }

    card = cardManager.cards[cardId];

    if (card === undefined) return;

    cardManager.selectCard(card.id);

    if (event.ctrlKey) {
    }
    if (event.altKey) {
        this.querySelector('.copy').click();
    }
    if (event.shiftKey) {

    }
}

function cardMenuEvents() {
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
            cardManager.deleteCard(cardManager.cards[cardId]);
            break;
        case 'V':
        case 'O':
            cardManager.cards[cardId].toggleArchived();
    }
    cardManager.saveCards();
}

function exportCards() {
    exportContainer.style.display = 'block';
    exportContent.innerHTML = cardManager.exportCards();
    selection = selectText(exportContent);
    copySelectionText();
    selection.empty();
}

function loadImportCardsCode() {
    let data = importInput.value;
    cardManager.importCards(data);
    importContainer.style.display = 'none';
}

function showImporter() {
    importContainer.style.display = 'block';
    importInput.focus();
}

module.exports = {
    init: init
};
},{"../config":5,"../models/Card":9}],7:[function(require,module,exports){

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
},{}],8:[function(require,module,exports){
window.CONFIG = require('./config.js');

let keyHandler = require('./lib/keyHandler'),
  cardManager = require('./models/CardManager').getInstance(),
  pubsub = require('./lib/pubsub');

window.cm = {
  cardManager: cardManager
};

Object.assign(window, require('./prototypes'));


document.addEventListener('DOMContentLoaded', function () {
  'strict mode';

  keyHandler.init({
    cardManager: cardManager
  });

  cardManager.loadCards();
  cardManager.renderAllCards();
});

},{"./config.js":5,"./lib/keyHandler":6,"./lib/pubsub":7,"./models/CardManager":10,"./prototypes":11}],9:[function(require,module,exports){
let pubsub = require('../lib/pubsub'),
    randomMC = require('random-material-color');


let Card = {
    init: function(name) {
        this.id = -1;
        this.name = name;
        this.depth = 5;
        this.x = 100;
        this.y = 100;
        this.color = this.getBackgroundColor();
        this.selected = false;
        this.isArchived = false;
        this.isDeleted = false;
        this.createdAt = + new Date();
        this.archivedAt = null;

        return this;
    },
    render: function(always = false) {
        if (this.isDeleted === true && always === false) {
            return;
        }

        let node = document.createElement('div'),
            text = document.createElement('div'),
            that = this;

        text.innerHTML = this.name.replace(/\r?\n/g, '<br/>');
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

        node.appendChild(text);

        $('#todo_' + this.id).draggable({
            stop: function() {
                let card = $('#todo_' + that.id);

                that.x = card.css('left');
                that.y = card.css('top');

                pubsub.pub(window.CONFIG.SELECT_CARD, [that.id]);
                pubsub.pub(window.CONFIG.SAVE_CARDS);
            },
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
    getBackgroundColor: function() {
        return randomMC.getColor({shades: ['200', '300']});
    },
    derender: function() {
        let node = document.getElementById('todo_' + this.id);
        document.getElementById('mainContainer').removeChild(node);

        return this;
    },
    toggleArchived: function() {
        if (this.isArchived === false || this.isArchived === undefined) {
            this.node.classList.remove('notCompleted');
            void this.node.offsetWidth;
            this.node.classList.add('completed');
            this.archivedAt = + new Date();
        } else {
            this.node.classList.remove('completed');
            void this.node.offsetWidth;
            this.node.classList.add('notCompleted');
            this.archivedAt = null;
        }

        this.isArchived = !this.isArchived;

        pubsub.pub(window.CONFIG.SAVE_CARDS);
    },
    delete: function() {
        this.isDeleted = true;

        this.derender();
    },
    undelete: function() {
        this.isDeleted = false;

        this.render();
    }
};

module.exports = Card;
},{"../lib/pubsub":7,"random-material-color":4}],10:[function(require,module,exports){
const Card = require('./Card'),
    pubsub = require('../lib/pubsub'),
    CONFIG = require('../config');

let CardManager = {
    init: function() {
        this.cards = [];
        this.selectedCard = {id: -1};
        this.deletedCards = [];

        return this;
    },
    addCard: function(card) {
        this.cards.push(card);
        card.id = this.cards.length - 1;

        return card;
    },
    removeCard: function(id) {
        this.cards[id].derender();
        this.cards[id] = undefined;

        return this;
    },
    redrawCard: function(cardId, x, y) {
        let card = this.cards[cardId];
        card.x = x;
        card.y = y;

        card.derender();
        card.render();

        return this;
    },
    saveCards: function() {
        if (typeof(Storage) !== 'undefined') {
            localStorage.setItem('cards', JSON.stringify(this.cards));
        } else {
            console.log('you don\'t have local storage :(');
        }

        this.persistSelectedCard();

        return this;
    },
    loadCards: function() {
        this.cards = JSON.parse(localStorage.getItem('cards'));
        if (this.cards === null) {
            this.cards = JSON.parse(atob(CONFIG.DEFAULT_CONTENT));
        }

        this.clearArray();

        this.loadSelectedCard();

        document.activeElement.blur();

        return this;
    },
    clearArray: function() {
        let i;

        this.cards = this.cards.filter(function(elem) {
            return elem !== undefined && elem !== null;
        });
        for (i in this.cards) {
            if (this.cards.hasOwnProperty(i)) {
                this.cards[i].id = i;
            }
        }

        return this;
    },
    reRenderAllCards: function() {
        this.cards.forEach((card) => {
            card.derender();
        });
        this.renderAllCards();
    },
    renderAllCards: function() {

        this.cards.forEach((card) => {
                card.selected = this.selectedCard && (this.selectedCard.id === card.id);
                Object.setPrototypeOf(card, Card);
                card.render();
            }
        );

        return this;
    },
    getInstance: function() {
        if (CardManager.instance === undefined) {
            CardManager.instance = Object.create(CardManager, {});
            CardManager.instance.init();
            pubsub.sub(window.CONFIG.SAVE_CARDS, CardManager.instance.saveCards, CardManager.instance);
            pubsub.sub(window.CONFIG.SELECT_CARD, CardManager.instance.selectCard, CardManager.instance);
            pubsub.sub(window.CONFIG.RERENDER, CardManager.instance.reRenderAllCards, CardManager.instance);
        }

        return CardManager.instance;

    },
    exportCards: function() {
        return btoa(JSON.stringify(this.cards));
    },
    importCards: function(data) {
        localStorage.setItem('cards', atob(data));
        this.loadCards();
        this.renderAllCards();
    },
    selectCard: function(cardId) {
        if (this.selectedCard !== undefined) {
            this.selectedCard.node.classList.remove('selected');
        }
        this.selectedCard = this.cards[cardId];

        this.selectedCard.node.classList.add('selected');

        this.persistSelectedCard();
        document.activeElement.blur();
    },
    nextCard: function() {
        let it = +this.selectedCard.id + 1;

        while (it !== +this.selectedCard.id) {
            if (this.cards[it] !== undefined && this.cards[it].isDeleted !== true) {
                break;
            }
            if (++it >= this.cards.length) {
                it = 0;
            }
        }

        this.selectCard(it);
    },
    previousCard: function() {
        let it = +this.selectedCard.id - 1;

        while (it !== +this.selectedCard.id) {
            if (this.cards[it] !== undefined) {
                break;
            }
            if (--it <= 0) {
                it = this.cards.length;
            }
        }

        this.selectCard(it);
    },
    persistSelectedCard: function() {
        if (this.selectedCard && this.selectedCard.id > -1) {
            localStorage.setItem('selectedCard', this.selectedCard.id);
        }
    },
    loadSelectedCard: function() {
        let selectedCardId = +localStorage.getItem('selectedCard');

        if (selectedCardId !== undefined && selectedCardId > -1) {
            this.selectedCard = this.cards[selectedCardId];
        }
    },
    deleteCard: function(card) {
        this.deletedCards.push(card);

        card.delete();
    },
    undeleteLastCard: function() {
        if (this.deletedCards.length === 0) {
            return;
        }

        this.deletedCards.splice(this.deletedCards.length -1)[0].undelete();

        this.saveCards();
    }
};

module.exports = CardManager;
},{"../config":5,"../lib/pubsub":7,"./Card":9}],11:[function(require,module,exports){
let cardManager = require('./models/CardManager').getInstance();

function createDiv(text, className) {
    let div = document.createElement('div');
    div.innerHTML = text;
    div.style.float = "right";
    div.style.cursor = "pointer";
    div.style.width = "auto";
    div.style.textAlign = "center";
    div.style.margin = "0 3px";

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

function getSomethingByclassName(context, classname) {
    let res = context.getElementsByClassName(classname);

    if (res.length === 0) {
        res = context.parentElement.getElementsByClassName(classname);
    }

    return res;
}

function changeDepth(cardId, increment) {
    let depth = cardManager.cards[cardId].depth + increment;

    this.style.zIndex = depth;
    cardManager.cards[cardId].depth = depth;

    let elem = getSomethingByclassName(this, 'depth');
    elem[0].innerHTML = depth;
}

function setDepth(cardId, depth) {
    this.style.zIndex = depth;
    cardManager.cards[cardId].depth = depth;

    let elem = getSomethingByclassName(this, 'depth');
    elem[0].innerHTML = depth;
}

function getCardHTMLById(mainContainer, id) {
    return mainContainer.getElementById('todo_' + id);
}

// PROTOTYPES

/*
 * Returns the size of an array
 */
Array.prototype.size = function() {
    return this.filter(function(a) {
        return a !== undefined;
    }).length
};

/*
 * Returns the size of an object
 */
Object.size = function(obj) {
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
    changeDepth: changeDepth,
    setDepth: setDepth,
    getCardHTMLById: getCardHTMLById
};
},{"./models/CardManager":10}]},{},[8])

//# sourceMappingURL=bundle.js.map
