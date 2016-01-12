import React, { Component, PropTypes } from 'react'


export default class Generate extends Component {
  constructor() {
    super()
    this.model = null
  }
  componentDidMount() {
    this.loadMonkey()
  }
  loadModel(newModel) {
    this.model = null
    if (newModel) {
      this.model = newModel
      this.model.setColor(0, 0.5, 1)
    }
    this.props.onModelChange(this.model)

    //loadTool();
    strategy = new SliceStrategy(this.model, boundingBox);
  }
  loadSphere() {
    this.loadModel(CSG.sphere({ radius: 25 }))
  }
  loadMonkey() {
    var monkey = CSG.fromPolygons(monkeyModel.triangles.map(function(tri) {
      return new CSG.Polygon(tri.map(function(i) {
        return new CSG.Vertex(monkeyModel.vertices[i], monkeyModel.normals[i]);
      }));
    }));
    this.loadModel(monkey);
  }
  render() {
    return (
      <div>
        <h2>Model</h2>
        <div className="options">
          <p>Load model:</p>
          <p><i>You can import STL files (ASCII format only for now) by dragging and dropping them in this window.</i></p>
          <button className="button" onClick={this.loadSphere.bind(this)}>Load Sphere</button>
          <button className="button" onClick={this.loadMonkey.bind(this)}>Load Monkey</button>
        </div>
      </div>
    )
  }
}
