import React, { Component, PropTypes } from 'react'


export default class Generate extends Component {
  render() {
    var playPauseButton = ''
    var stepButton = ''
    if (this.props.generatingPath) {
      playPauseButton = <button className="button" onClick={this.props.onPauseClick}>Pause</button>
    }
    else {
      playPauseButton = <button className="button" onClick={this.props.onPlayClick}>Generate</button>
      stepButton = <button className="button" onClick={this.props.onStepClick}>Step Tool</button>
    }

    return (
      <div>
        <h2>Generate</h2>
        <div className="options">
          {playPauseButton}
          {stepButton}
          <span id="stats"></span>
        </div>
      </div>
    )
  }
}
