var React = require('react');


var Model = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Model</h2>
        <div className="options">
          <p>Load file:</p>
          <div id="drop-zone">Drop STL file here</div>
          <button className="button" onClick={loadSphere}>Load Sphere</button>
          <button className="button" onClick={loadTool}>Load Tool</button>
        </div>
      </div>
    );
  }
});

module.exports = Model;
