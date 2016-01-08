import React, { Component, PropTypes } from 'react'


export default class Generate extends Component {
  handlePlayPauseClick(e) {
    this.props.onPlayPauseClick()
    playPauseTool()
  }
  render() {
    var playPauseText = 'Generate'
    var stepButton = ''
    if (this.props.generatingPath) {
      playPauseText = 'Pause'
    }
    else {
      stepButton = <button className="button" onClick={stepTool}>Step Tool</button>
    }
    return (
      <div>
        <h2>Generate</h2>
        <div className="options">
          <button className="button" onClick={e => this.handlePlayPauseClick(e)}>{playPauseText}</button>
          {stepButton}
          <span id="stats"></span>
        </div>
      </div>
    )
  }
}
