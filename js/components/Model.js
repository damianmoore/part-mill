import React, { Component, PropTypes } from 'react'


export default class Generate extends Component {
  render() {
    return (
      <div>
        <h2>Model</h2>
        <div className="options">
          <p>Load model:</p>
          <p><i>You can import STL files (ASCII format only for now) by dragging and dropping them in this window.</i></p>
          <button className="button" onClick={loadSphere}>Load Sphere</button>
          <button className="button" onClick={loadMonkey}>Load Monkey</button>
          <button className="button" onClick={loadTool}>Reset Tool</button>
        </div>
      </div>
    )
  }
}
