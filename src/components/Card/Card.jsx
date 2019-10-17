import React, { Component } from "react";
import proptypes from 'prop-types';

export default class Card extends Component {
  
  static proptypes = {
    title: proptypes.string.isRequired,
    content: proptypes.string.isRequired
  }
  
  constructor() {
    super();
  }
  

  render() {
    const {title, content} = this.props;

    return (
      <div class="Card">
        <h3>{title}</h3>
        <content>{content}</content>
      </div>
    );
  }
}