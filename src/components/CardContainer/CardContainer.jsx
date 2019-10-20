import React, { Component } from "react";
import './CardContainer.scss';
import Card from '../Card';
import { getUserInformation, saveStuff } from '../../services/cardService';
import { CARD_STYLES, EMPTY_CARD, TAGS, CREATION_OFFSET_STEP } from '../../constants';
import GlobalEventHandler from '../../GlobalEventHandler';

export default class CardContainer extends Component {
  constructor() {
    super();

    this._onStart = this._onStart.bind(this);
    this._onStop = this._onStop.bind(this);
    this._onDrag = this._onDrag.bind(this);
    this._onChangeTitle = this._onChangeTitle.bind(this);
    this._onChangeContent = this._onChangeContent.bind(this);
    this.burn = this.burn.bind(this);

    this.state = {
      type: CARD_STYLES.GOLDEN,
      grid: false,
      cards: [],
      selectedCardId: null,
      pristine: true
    }

    this._lastId = -1;
    this._creationOffset = 0;
    this.lastRemoved = [];

    this._api = this._getApi();

    this._globalEventHandler = new GlobalEventHandler(this._api);
    
    this._loadCards();

    window.addEventListener('beforeunload', (event) => {
      const { cards, type, grid } = this.state;
      
      if (!this.state.pristine) {
        event.preventDefault();

        event.returnValue = 'wat';
      }
      
    });
  }

  _getApi() {
    return {
      getSelectedCard: () => {
        return this.state.selectedCardId
      },
      isEditing: () => {
        return this.state.isEditing
      },
      toggleEditMode: () => {
        this.setState({
          isEditing: !this.state.isEditing,
          pristine: false
        });
      },
      createCard: () => {
        const card = { ...EMPTY_CARD };

        this._creationOffset += CREATION_OFFSET_STEP;

        card.position = {
          x: this._creationOffset,
          y: this._creationOffset
        }

        card.id = ++this._lastId;

        this.state.cards.push(card);
        this.setState({
          cards: this.state.cards,
          selectedCardId: card.id,
          pristine: false
        });
      },
      removeCard: () => {
        const card = this._getCard(this.state.selectedCardId);
        const cards = this.state.cards;

        this.lastRemoved.push(card);

        card.tags.push(TAGS.REMOVED);

        this.setState({
          cards,
          pristine: false
        });
      },
      undoLastDelete: () => {
        if (this.lastRemoved.length === 0 || this.state.isEditing) {
          return false;
        }

        const card = this.lastRemoved.pop();
      
        card.tags.splice(card.tags.indexOf(TAGS.REMOVED), 1);

        this.setState({
          selectedCardId: card.id,
          pristine: false
        });
      },
      saveStuff: () => {
        const { cards, type, grid } = this.state;

        saveStuff({
          cards,
          type,
          grid
        });
        
        this.setState({pristine: true});
      }
    };
  }

  async _loadCards() {
    const data = await getUserInformation();

    this._lastId = data.cards.reduce((acc, card) => {
      return card.id > acc ? card.id : acc;
    }, -1);

    this.setState({
      type: data.type,
      grid: data.grid,
      cards: data.cards 
    });
  }

  _renderCards(cards) {
    return cards.map((card) => {
      if (card.tags.includes(TAGS.REMOVED)) {
        return null;
      }

      const { selectedCardId, isEditing } = this.state;
      const isSelectedcard = card.id === selectedCardId;
      const isSelectedEditing = isSelectedcard && isEditing;

      return (<Card
          key={card.id}
          id={card.id}
          isSelected={isSelectedcard}
          isEditing={isSelectedEditing}
          title={card.title}
          content={card.content}
          index={card.index}
          position={card.position}
          type={this.state.type}
          grid={this.state.grid}
          onStart={this._onStart}
          onStop={this._onStop}
          onDrag={this._onDrag}
          onChangeContent={this._onChangeContent}
          onChangeTitle={this._onChangeTitle}
        />);
    });
  }

  _getCard(id) {
    return this.state.cards.find((card) => card.id === id);
  }

  _onChangeContent(id, e) {
    const card = this._getCard(id);

    card.content = e.target.value;

    this.setState({
      cards: this.state.cards,
      pristine: false
    });
  }


  _onChangeTitle(id, e) {
    const card = this._getCard(id);
  
    card.title = e.target.value;

    this.setState({
      cards: this.state.cards,
      pristine: false
    });
  }

  _onStart(id, event, data) {
    
  }

  _onDrag(id, event, data) {
    
  }

  _onStop(id, event, data) {
    const card = this._getCard(id);

    card.position = {
      x: data.x,
      y: data.y
    };

    this.setState({
      cards: this.state.cards,
      selectedCardId: card.id,
      pristine: false
    });
  }

  burn() {
    window.localStorage.removeItem('stacker-reborn-userInformation');
    this.setState({
      cards: [],
      pristine: false
    });
  }

  render() {
    return (
      <div className="CardContainer">
        <div>{this.state.pristine ? "" : "U DIRTY FUCKER"}</div>
        <button onClick={this.burn} value="Hard reset"> Hard Reset </button>
        {this._renderCards(this.state.cards)}
      </div>
    );
  }
}