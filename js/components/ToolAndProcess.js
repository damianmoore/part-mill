import React, { Component, PropTypes } from 'react'


export default class Generate extends Component {
  render() {
    return (
      <div>
        <h2>Tool And Process</h2>
        <div className="options">
          <p>Strategy:</p>
          <select id="strategy" onChange={changeStrategy}>
            <option value="SliceStrategy">Slice</option>
            <option value="SurfaceStrategy">Surface</option>
            <option value="ProgressiveSurfaceStrategy">Progressive Surface</option>
          </select>
          <p>Resolution:</p>
          <input type="number" id="resolution" defautValue="3" onKeyup={changeResolution} onChange={changeResolution} />
          <p>Tool Diameter:</p>
          <input type="number" id="toolDiameter" defautValue="3" onKeyup={changeToolDiameter} onChange={changeToolDiameter} />
        </div>
      </div>
    )
  }
}
