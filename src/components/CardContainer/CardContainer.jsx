import React, { Component } from "react";
import './CardContainer.scss';
import Card from '../Card';
import { getUserInformation, saveStuff } from '../../services/cardService';
import { CARD_STYLES } from '../../constants';

export default class CardContainer extends Component {
  constructor() {
    super();

    this._onStart = this._onStart.bind(this);
    this._onStop = this._onStop.bind(this);
    this._onDrag = this._onDrag.bind(this);

    this.state = {
      type: CARD_STYLES.GOLDEN,
      grid: false,
      cards: [],
      selectedCardId: null
    }
    
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
      return (<Card
          key={card.id}
          id={card.id}
          isSelected={card.id === this.state.selectedCardId}
          title={card.title}
          content={card.content}
          index={card.index}
          position={card.position}
          type={this.state.type}
          grid={this.state.grid}
          onStart={this._onStart}
          onStop={this._onStop}
          onDrag={this._onDrag}
        />);
    });
  }

  _onStart(id, event, data) {
    
  }

  _onDrag(id, event, data) {
    
  }

  _onStop(id, event, data) {
    const card = this.state.cards.find((card) => card.id === id);

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