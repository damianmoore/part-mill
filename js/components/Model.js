import React, { Component, PropTypes } from 'react'


export default class Generate extends Component {
  render() {
    return (
      <div>
        <h2>Model</h2>
        <div className="options">
          <p>Load model:</p>
          <button className="button" onClick={loadSphere}>Pick File (or drag 'n' drop)</button>
          <button className="button" onClick={loadSphere}>Load Sphere</button>
          <button className="button" onClick={loadTool}>Load Tool</button>
        </div>
      </div>
    )
  }
}
