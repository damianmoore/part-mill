require("../css/main.scss");

var React = require('react');
var ReactDOM = require('react-dom');
var Toolbox = require('./components/Toolbox');


ReactDOM.render(
  <Toolbox />,
  document.getElementById('toolbox')
);
