"use strict";

class SliceStrategy extends Strategy {
  constructor(scene, events) {
    super(scene, events)

    this.toolDirectionX = 1
    this.toolDirectionY = 1

    this.gridPos = [0, 0]  // X, Y

    if (scene.toolAndProcess && scene.toolAndProcess.resolution) {
      var arraySize = [
        parseInt((scene.boundingBox[1][0] - scene.boundingBox[0][0]) / scene.toolAndProcess.resolution, 10),
        parseInt((scene.boundingBox[1][1] - scene.boundingBox[0][1]) / scene.toolAndProcess.resolution, 10),
      ];
      this.noFlyZone = Array.apply(0, Array(arraySize[0])).map(function() {
        return Array.apply(0, Array(arraySize[1])).map(function() {
          return false;
        });
      });
    }
  }

  pause() {
    this.subModel = null;
  }
  unpause() {
    this.calculateSubModel(this.scene.toolPos[2])
  }

  calculateSubModel(zPos) {
    // Slice the model up so we only have to do collision detection with parts that are on the current Z layer.
    // noFlyZone is used in combination with this so we don't go "under" the model.
    var resolution = this.scene.toolAndProcess.resolution
    var boundingBox = this.scene.boundingBox
    var subBox = CSG.box({bbox: [
      [boundingBox[0][0], boundingBox[0][1], zPos],
      [boundingBox[1][0], boundingBox[1][1], zPos + resolution],
    ]})
    this.subModel = this.model.intersect(subBox)
    //this.events.setSubModel(this.subModel)
  }

  stepTool(prevPoint) {
    if (this.calculatingStep) {
      return;
    }
    this.calculatingStep = true;
    var toolPath = []

    var pos = this.scene.toolPos
    var resolution = this.scene.toolAndProcess.resolution
    var boundingBox = this.scene.boundingBox
    var boundingBoxDimensions = this.scene.boundingBoxDimensions

    if ((this.toolDirectionX == 1 &&
          pos[0] + ((resolution + (toolDiameter/2)) * this.toolDirectionX) <= boundingBox[1][0]) ||
        (this.toolDirectionX == -1 &&
          pos[0] + ((resolution + (toolDiameter/2)) * this.toolDirectionX) >= boundingBox[0][0])
        ) {
      // Continue moving in the same direction left or right
      pos[0] += resolution * this.toolDirectionX;
      this.gridPos[0] += 1 * this.toolDirectionX;
    }
    else if ((this.toolDirectionY == 1 &&
               pos[1] + ((resolution + (toolDiameter/2)) * this.toolDirectionY) <= boundingBox[1][1]) ||
             (this.toolDirectionY == -1 &&
               pos[1] + ((resolution + (toolDiameter/2)) * this.toolDirectionY) >= boundingBox[0][1])
             ) {
      // Move tool away from us and change X direction
      pos[1] += resolution * this.toolDirectionY;
      this.gridPos[1] += 1 * this.toolDirectionY;
      this.toolDirectionX = this.toolDirectionX * -1;
    }
    else if (pos[2] - resolution >= boundingBox[0][2]) {
      // Move tool down a layer and change X & Y direction
      pos[2] -= resolution;
      this.calculateSubModel(pos[2]);
      this.toolDirectionX = this.toolDirectionX * -1;
      this.toolDirectionY = this.toolDirectionY * -1;
    }
    else {
      // Completed path as got to the bottom of the bounding boundingBox
      return 'COMPLETE';
    }

    if (prevPoint && prevPoint[2] == boundingBox[1][2] && pos[2] != boundingBox[1][2]) {
      toolPath.push([pos[0], pos[1], boundingBox[1][2]]);
    }

    this.tool = CSG.cylinder({ radius: toolDiameter/2, slices: 8, start: pos, end: [pos[0], pos[1], pos[2]+boundingBoxDimensions[2]] });
    var zpos = pos[2];
    if (this.noFlyZone[this.gridPos[0]][this.gridPos[1]] || this.hasCollided()) {
      this.noFlyZone[this.gridPos[0]][this.gridPos[1]] = true;

      // Add extra toolPath node directly above last one
      zpos = boundingBox[1][2];
      toolPath.push([prevPoint[0], prevPoint[1], zpos]);

      this.tool = CSG.cylinder({ radius: toolDiameter/2, slices: 8, start: [pos[0], pos[1], zpos], end: [pos[0], pos[1], zpos+boundingBoxDimensions[2]] });
      this.tool.setColor(1, 0, 0);
    }
    toolPos = pos;
    this.optimisePath([pos[0], pos[1], zpos]);
    toolPath.push([pos[0], pos[1], zpos]);
    this.calculatingStep = false;

    console.log(this.scene.toolPos[0] + ' -> ' + toolPos[0])

    return toolPath
  }
};
