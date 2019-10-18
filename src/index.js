import 'babel-polyfill';
import ReactDOM from 'react-dom';
import React from 'react';
import CardContainer from './components/CardContainer';

const wrapper = document.getElementById("mainContainer");
wrapper ? ReactDOM.render(<CardContainer />, wrapper) : false;