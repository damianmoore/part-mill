var React = require('react');


var Generate = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Generate</h2>
        <div className="options">
          <button className="button" onClick={playPauseTool}>Generate / Pause</button>
          <button className="button" onClick={stepTool}>Step Tool</button>
          <span id="stats"></span>
        </div>
      </div>
    );
  }
});

module.exports = Generate;
