import React, { Component } from "react";
import Card from '../Card';

export default class CardContainer extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Card
        title="Test title"
        content="This is the content of this card, very beautiful :D"
      />
    );
  }
}