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
      <div>
        <h1 onClick={e => this.handleClick(e)}>G-code Generator</h1>
        {items}
      </div>
    );
  }
}

Toolbox.propTypes = {
  items: React.PropTypes.array,
}
