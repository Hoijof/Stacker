export default class GlobalEventHandler {
    constructor(api) {
        this._api = api;

        this._keyDownHandler = this._keyDownHandler.bind(this);

        this._registerEvents();
    }

    _registerEvents() {
        window.onkeydown = this._keyDownHandler;
    }

    _unregisterEvents() {
        window.onkeydown = null;
    }

    _keyDownHandler(e) {
        console.log(e);

        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'e': 
                    this._api.toggleEditMode();
                    e.preventDefault();
                    break;
                case 'i':
                    this._api.createCard()
                    break;
                case 'd':
                    this._api.removeCard();
                    e.preventDefault();
                    break;
                case 'z':
                    if (this._api.undoLastDelete()) {
                        e.preventDefault();
                    }
            }
        }
    }
}