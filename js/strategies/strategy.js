"use strict";

class Strategy {
  constructor(model, boundingBox) {
    this.model = model;
    this.boundingBox = boundingBox;
    this.calculatingStep = false;
    this.collisionMesh = null;
  }

  hasCollided() {
    if (subModel && subModel.polygons.length > 0) {
      this.collisionMesh = subModel.intersect(tool).toMesh();
      if (this.collisionMesh.vertices.length > 0) {
        return true;
      }
    }
    else if (!subModel) {
      this.collisionMesh = subModel.intersect(tool).toMesh();
      if (this.collisionMesh.vertices.length > 0) {
        return true;
      }
    }
    return false;
  }

  optimisePath(pos) {
    // Optimise the path by removing points that are along a straight line
    var minusOne = toolPath[toolPath.length-1];
    var minusTwo = toolPath[toolPath.length-2];
    if (minusOne && minusTwo && pos[1] == minusOne[1] && pos[1] == minusTwo[1] && pos[2] == minusOne[2] && pos[2] == minusTwo[2]) {
      toolPath.splice(toolPath.length-1);
    }
  }

  pause() {}
  unpause() {}

  stepTool() {}
};
