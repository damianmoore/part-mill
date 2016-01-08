var React = require('react');


var Model = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Model</h2>
        <div className="options">
          <p>Load file:</p>
          <button className="button" onClick={loadSphere}>Pick File (or drag 'n' drop)</button>
          <button className="button" onClick={loadSphere}>Load Sphere</button>
          <button className="button" onClick={loadTool}>Load Tool</button>
        </div>
      </div>
    );
  }
});

module.exports = Model;
