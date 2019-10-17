import React, { Component } from "react";
import ReactDOM from "react-dom";
import Card from '../Card';

export default class CardContainer extends Component {
  constructor() {
    super();
    this.state = {
      title: ""
    };
  }

  render() {
    return (
      <form id="article-form">
      </form>
    );
  }
}