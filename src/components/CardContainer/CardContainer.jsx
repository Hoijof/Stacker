import React, { Component } from "react";
import './CardContainer.scss';
import Card from '../Card';

export default class CardContainer extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="CardContainer">
        <Card
          title="Test title"
          content="This is the content of this card, very beautiful :D"
          type="goldenRatio"
        />
      
        <Card
          title="Test title"
          content="This is the content of this card, very beautiful :D"
          type="postIt"
        />
      </div>
    );
  }
}