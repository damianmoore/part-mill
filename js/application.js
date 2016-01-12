import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { toggleToolboxVisibility, playPathGeneration, pathPathGeneration, setToolPath, setToolPos, rebuildScene, setModel, setSubModel, setBoundingBox, setToolAndProcess, setStepMode, clearStepMode } from './actions'
import Viewer from './components/Viewer'
import Toolbox from './components/Toolbox'
import Model from './components/Model'
import ToolAndProcess from './components/ToolAndProcess'
import Generate from './components/Generate'

import PathGenerator from './path-generator'


class Application extends Component {
  constructor() {
    super()
    this.pathGenerator = new PathGenerator()
  }
  componentDidMount() {
    const { dispatch, scene } = this.props

    this.pathGenerator = new PathGenerator({
      rebuildScene: scene => dispatch(rebuildScene(scene)),
      setToolPath: scene => dispatch(setToolPath(scene)),
      clearStepMode: scene => dispatch(clearStepMode(scene)),
      setSubModel: scene => dispatch(setSubModel(scene)),
    })
  }
  render() {
    const { dispatch, toolbox, scene } = this.props

    this.pathGenerator.update(scene)

    return (
      <div>
        <Viewer scene={scene}
          onToolMove={pos =>
            dispatch(setToolPos(pos))
          }
        />

        <Toolbox
          visibility={toolbox.visibility}
          items={[
            <Model
              onModelChange={model =>
                dispatch(setModel(model))
              }
            />,
            <ToolAndProcess
              toolAndProcess={scene.toolAndProcess}
              onChange={toolAndProcess =>
                dispatch(setToolAndProcess(toolAndProcess))
              }
            />,
            <Generate
              generatingPath={scene.generating}
              onPlayClick={text =>
                dispatch(playPathGeneration())
              }
              onPauseClick={text =>
                dispatch(pathPathGeneration())
              }
              onStepClick={text =>
                dispatch(setStepMode())
              }
            />,
          ]}
          onToolboxVisibilityClick={text =>
            dispatch(toggleToolboxVisibility())
          }
        />
      </div>
    )
  }
}

function select(state) {
  return {
    toolbox: state.toolbox,
    scene: state.scene,
  }
}

export default connect(select)(Application)
