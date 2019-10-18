import React, { Component } from "react";
import './CardContainer.scss';
import Card from '../Card';
import { getUserInformation, saveStuff } from '../../services/cardService';
import { CARD_STYLES } from '../../constants';
import GlobalEventHandler from '../../GlobalEventHandler';

export default class CardContainer extends Component {
  constructor() {
    super();

    this._onStart = this._onStart.bind(this);
    this._onStop = this._onStop.bind(this);
    this._onDrag = this._onDrag.bind(this);
    this._onChangeTitle = this._onChangeTitle.bind(this);
    this._onChangeContent = this._onChangeContent.bind(this);

    this.state = {
      type: CARD_STYLES.GOLDEN,
      grid: false,
      cards: [],
      selectedCardId: null
    }

    this._api = {
      getSelectedCard: () => {
        return this.state.selectedCardId
      },
      isEditing: () => {
        return this.state.isEditing
      },
      toggleEditMode: () => {
        this.setState({
          isEditing: !this.state.isEditing
        });
      }
    }

    this._globalEventHandler = new GlobalEventHandler(this._api);
    
    this._loadCards();

    window.addEventListener('beforeunload', (event) => {
      const { cards, type, grid } = this.state;

      saveStuff({
        cards,
        type,
        grid
      });
    });
  }

  async _loadCards() {
    const data = await getUserInformation();

    this.setState({
      type: data.type,
      grid: data.grid,
      cards: data.cards 
    });
  }

  _renderCards(cards) {
    return cards.map((card) => {
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

    this.setState({cards: this.state.cards});
  }


  _onChangeTitle(id, e) {
    const card = this._getCard(id);
  
    card.title = e.target.value;

    this.setState({cards: this.state.cards});
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
      selectedCardId: card.id
    });
  }

  render() {
    return (
      <div className="CardContainer">
        {this._renderCards(this.state.cards)}
      </div>
    );
  }
}