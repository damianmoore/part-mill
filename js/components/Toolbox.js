var React = require('react');

var Model = require('./Model');
var ToolAndProcess = require('./ToolAndProcess');
var Generate = require('./Generate');


var Toolbox = React.createClass({
  propTypes: {
    items: React.PropTypes.array,
  },
  getDefaultProps: function() {
    return {
      items: [
        <Model />,
        <ToolAndProcess />,
        <Generate />,
      ],
    };
  },
  render: function() {
    return (
      <div>
        <h1>G-code Generator</h1>
        {this.props.items}
      </div>
    );
  }
});

module.exports = Toolbox;
