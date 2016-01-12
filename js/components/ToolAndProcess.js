import React, { Component, PropTypes } from 'react'


export default class ToolAndProcess extends Component {
  handleChange(field, e) {
    var newState = {}
    var value = e.target.value
    if (['resolution', 'toolDiameter'].indexOf(field) > -1) {
      value = parseInt(value)
    }
    newState[field] = value
    var state = Object.assign({}, this.props.toolAndProcess, newState)
    this.props.onChange(state)
  }
  render() {
    return (
      <div>
        <h2>Tool And Process</h2>
        <div className="options">
          <p>Strategy:</p>
          <select id="strategy" onChange={this.handleChange.bind(this, 'strategy')}>
            <option value="SliceStrategy">Slice</option>
            <option value="SurfaceStrategy">Surface</option>
            <option value="ProgressiveSurfaceStrategy">Progressive Surface</option>
          </select>
          <p>Resolution (mm):</p>
          <input type="number" id="resolution" defautValue="3" onKeyup={this.handleChange.bind(this, 'resolution')} onChange={this.handleChange.bind(this, 'resolution')} />
          <p>Tool Diameter (mm):</p>
          <input type="number" id="toolDiameter" defautValue="3" onKeyup={this.handleChange.bind(this, 'toolDiameter')} onChange={this.handleChange.bind(this, 'toolDiameter')} />
        </div>
      </div>
    )
  }
}
