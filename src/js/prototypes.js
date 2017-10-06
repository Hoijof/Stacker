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