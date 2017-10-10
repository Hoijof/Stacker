const CONFIG = require('../config');

let cardManager,
    Card = require('../models/Card');

let mainContainer,
    input,
    editContainer,
    editInput,
    titleInput,
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
    titleInput = editContainer.getElementsByClassName('input')[0];
    importContainer = document.getElementById('importContainer');
    importInput = importContainer.getElementsByClassName('input')[0];
    importButton = importContainer.getElementsByClassName('button')[0];
    exportContainer = document.getElementById('exportContainer');
    exportContent = exportContainer.getElementsByTagName('div')[0];


    window.addEventListener('keyup', keyHandlerUp, false);
    window.addEventListener('keydown', keyHandlerDown, false);
    input.addEventListener('keydown', mainInputKeyEvent);
    editInput.addEventListener('keydown', editInputKeyEvent);
    titleInput.addEventListener('keydown', editInputKeyEvent);
    editContainer.addEventListener('click', hideEditContainer);
    editInput.addEventListener('click', stopPropagation);
    titleInput.addEventListener('click', stopPropagation);
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
    } else if (e.keyCode === CONFIG.ASCII.CMD_KEY) {
        window.cmdPress = true;
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
            if (event.ctrlKey || window.cmdPress) {
                let elem = cardManager.selectedCard.node,
                    selection;

                selection = selectText(elem.getElementsByClassName('cardText')[0]);
                copySelectionText();
                selection.empty();
            }

            break;
        case CONFIG.ASCII.D_KEY:
            if (event.ctrlKey || window.cmdPress) {
                let card = cardManager.selectedCard;
                cardManager.nextCard();

                cardManager.deleteCard(card);

                cardManager.saveCards();
            }
            break;
        case CONFIG.ASCII.E_KEY:
            if (event.ctrlKey || window.cmdPress) {
                doubleClickHandler.apply(cardManager.selectedCard.node);
            }
            break;
        case CONFIG.ASCII.A_KEY:
            if (event.ctrlKey || window.cmdPress) {
                cardManager.selectedCard.toggleArchived();
            }
            break;
        case CONFIG.ASCII.I_KEY:
            if (event.ctrlKey || window.cmdPress) {
                // input.focus();
                createCard();
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

            cardManager.saveCards();
            break;
        case CONFIG.ASCII.Z_KEY:
            if (event.ctrlKey || window.cmdPress) {
                cardManager.undeleteLastCard();
            }
            break;
        case CONFIG.ASCII.CMD_KEY:
            window.cmdPress = false;
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
        card.title = titleInput.value;
        card.description = editInput.value;
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

    titleInput.value = card.title;
    editInput.value = card.description;
    titleInput.style.top = card.y;
    titleInput.style.left = card.x;
    editContainer.cardId = cardId;
    editContainer.style.display = 'block';
    editInput.style.top = card.y + 23;
    editInput.style.left = card.x;
    titleInput.focus();
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

function createCard() {
    const card = cardManager.addCard(Object.create(Card, {}).init(''));
    card.render();
    cardManager.selectCard(card.id);

    // and now we autoedit :D
    doubleClickHandler.apply(card.node);
}

module.exports = {
    init: init
};