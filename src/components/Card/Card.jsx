import React, { Component } from "react";
import proptypes from 'prop-types';
import Draggable from 'react-draggable';
import './Card.scss';

import { CARD_TYPES_TO_CLASSNAMES } from '../../constants';

export default class Card extends Component {
  
  static proptypes = {
    id: proptypes.number.isRequired,
    title: proptypes.string.isRequired,
    content: proptypes.string.isRequired,
    type: proptypes.string,
    position: proptypes.shape({
      x: proptypes.number.isRequired,
      y: proptypes.number.isRequired
    }).isRequired,
    grid: proptypes.oneOfType([proptypes.array, proptypes.bool]),
    isSelected: proptypes.bool,
    index: proptypes.number
  }

  static defaultPropTypes = {
    type: 'goldenRatio',
    grid: false,
    isSelected: false,
    index: 0
  }
  
  constructor() {
    super();

    this._handleStart = this._handleStart.bind(this);
    this._handleDrag = this._handleDrag.bind(this);
    this._handleStop = this._handleStop.bind(this);
  }

  _handleStart(e, data) {
    this.props.onStart(this.props.id, e, data);
  }

  _handleDrag(e, data) {
    this.props.onDrag(this.props.id, e, data);
  }

  _handleStop(e, data) {
    this.props.onStop(this.props.id, e, data);
  }
  
  render() {
    const {title, content, type, position, grid, index, isSelected} = this.props;
    let className = `Card ${CARD_TYPES_TO_CLASSNAMES[type]}`;

    if (isSelected) {
      className += ' isSelected';
    }

    const style = {
      zIndex: index
    }

    return (
      <Draggable
        defaultPosition={{x: 0, y: 0}}
        position={position}
        grid={grid || false}
        scale={1}
        onStart={this._handleStart}
        onDrag={this._handleDrag}
        onStop={this._handleStop}>
        <div className={className} style={style}>
          <h3>{title}</h3>
          <content>{content}</content>
        </div>
      </Draggable>
    );
  }
}