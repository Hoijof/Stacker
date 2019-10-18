import React, { Component } from "react";
import proptypes from 'prop-types';
import Draggable from 'react-draggable';
import './Card.scss';

export default class Card extends Component {
  
  static proptypes = {
    title: proptypes.string.isRequired,
    content: proptypes.string.isRequired,
    type: proptypes.string
  }

  static defaultPropTypes = {
    type: 'goldenRatio'
  }
  
  constructor() {
    super();
  }
  
  render() {
    const {title, content, type} = this.props;
    const className = `Card ${type}`;

    return (
      <Draggable
        defaultPosition={{x: 0, y: 0}}
        position={null}
        grid={[25, 25]}
        scale={1}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}>
        <div className={className}>
          <h3>{title}</h3>
          <content>{content}</content>
        </div>
      </Draggable>
    );
  }
}