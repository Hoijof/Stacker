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