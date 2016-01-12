import React, { Component, PropTypes } from 'react'


export default class Toolbox extends Component {
  handleClick(e) {
    this.props.onToolboxVisibilityClick()
  }
  render() {
    var items = ''
    if (this.props.visibility) {
      items = this.props.items
    }
    return (
      <div id="toolbox">
        <h1 onClick={e => this.handleClick(e)}>Part Mill <span className="beta">beta</span></h1>
        {items}
      </div>
    );
  }
}

Toolbox.propTypes = {
  items: React.PropTypes.array,
}
