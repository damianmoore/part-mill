import React, { Component, PropTypes } from 'react'

import { generateTool } from '../utils'


export default class Viewer extends Component {
  constructor() {
    super()
    this.lastToolPos = null;
  }
  componentDidMount() {
    this.viewer = new OpenJsCad.Viewer('#viewer', 40);
    this.rebuild();  // Will be a setInterval that runs if the scene is being generated
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.scene) {
      this.rebuild(nextProps.scene)
    }
    return false
  }
  rebuild(scene) {
    this.viewer.meshes = []

    if (scene) {
      if (scene.subModel) {
        this.viewer.meshes.push(scene.subModel.toMesh())
      }
      else if (scene.model) {
        this.viewer.meshes.push(scene.model.toMesh())
      }

      var tool = generateTool(scene)
      if (tool) {
        this.viewer.meshes.push(tool.toMesh())
      }

      this.viewer.boundingBox = scene.boundingBox;
      this.viewer.toolPath = scene.path;
    }
    this.viewer.gl.ondraw();
  }
  render() {
    return (
      <div id="viewer" className="viewer" style={{width: '100%', height: '750px'}}>
        <div id="dragBox">
          <div id="dropMsg">
            Drop file here
          </div>
        </div>
        <div id="topDiv"></div>
      </div>
    )
  }
}
