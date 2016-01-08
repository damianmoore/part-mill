import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { toggleToolboxVisibility, toggleGeneratePath } from './actions'
import Toolbox from './components/Toolbox'

import Model from './components/Model'
import ToolAndProcess from './components/ToolAndProcess'
import Generate from './components/Generate'


class App extends Component {
  render() {
    const { dispatch, toolboxVisibility, generatingPath } = this.props
    return (
      <Toolbox
        visibility={toolboxVisibility}
        items={[
          <Model />,
          <ToolAndProcess />,
          <Generate
            generatingPath={generatingPath}
            onPlayPauseClick={text =>
              dispatch(toggleGeneratePath())
            }
          />,
        ]}
        onToolboxVisibilityClick={text =>
          dispatch(toggleToolboxVisibility())
        }/>
    )
  }
}

function select(state) {
  return {
    toolboxVisibility: state.toolboxVisibility,
    generatingPath: state.generatingPath
  }
}

export default connect(select)(App)
