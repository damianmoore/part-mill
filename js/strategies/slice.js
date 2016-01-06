"use strict";

class SliceStrategy {
  constructor(model, boundingBox) {
    this.model = model;
    this.boundingBox = boundingBox;
    this.calculatingStep = false;
    this.gridPos = [0, 0];  // X, Y

    var arraySize = [
      parseInt((boundingBox[1][0] - boundingBox[0][0]) / resolution, 10),
      parseInt((boundingBox[1][1] - boundingBox[0][1]) / resolution, 10),
    ];
    this.noFlyZone = Array.apply(0, Array(arraySize[0])).map(function() {
      return Array.apply(0, Array(arraySize[1])).map(function() {
        return false;
      });
    });
  }

  pause() {
    subModel = null;
  }
  unpause() {
    this.calculateSubModel(toolPos[2]);
  }

  calculateSubModel(zPos) {
    var subBox = CSG.box({bbox: [
      [this.boundingBox[0][0], this.boundingBox[0][1], zPos],
      [this.boundingBox[1][0], this.boundingBox[1][1], zPos + resolution],
    ]});
    subModel = model.intersect(subBox);
  }

  stepTool() {
    if (this.calculatingStep) {
      return;
    }
    this.calculatingStep = true;

    var pos = toolPos;
    if ((toolDirectionX == 1 &&
          pos[0] + ((resolution + (toolDiameter/2)) * toolDirectionX) <= boundingBox[1][0]) ||
        (toolDirectionX == -1 &&
          pos[0] + ((resolution + (toolDiameter/2)) * toolDirectionX) >= boundingBox[0][0])
        ) {
      // Continue moving in the same direction left or right
      pos[0] += resolution * toolDirectionX;
      this.gridPos[0] += 1 * toolDirectionX;
    }
    else if ((toolDirectionY == 1 &&
               pos[1] + ((resolution + (toolDiameter/2)) * toolDirectionY) <= boundingBox[1][1]) ||
             (toolDirectionY == -1 &&
               pos[1] + ((resolution + (toolDiameter/2)) * toolDirectionY) >= boundingBox[0][1])
             ) {
      // Move tool away from us and change X direction
      pos[1] += resolution * toolDirectionY;
      this.gridPos[1] += 1 * toolDirectionY;
      toolDirectionX = toolDirectionX * -1;
    }
    else if (pos[2] - resolution >= boundingBox[0][2]) {
      // Move tool down a layer and change X & Y direction
      pos[2] -= resolution;
      this.calculateSubModel(pos[2]);
      toolDirectionX = toolDirectionX * -1;
      toolDirectionY = toolDirectionY * -1;
    }
    else {
      // Completed path as got to the bottom of the bounding boundingBox
      return 'COMPLETE';
    }

    var prevPoint = toolPath[toolPath.length-1]
    if (prevPoint[2] == boundingBox[1][2] && pos[2] != boundingBox[1][2]) {
      toolPath.push([pos[0], pos[1], boundingBox[1][2]]);
    }

    tool = CSG.cylinder({ radius: toolDiameter/2, slices: 8, start: pos, end: [pos[0], pos[1], pos[2]+50] });
    var zpos = pos[2];
    if (this.noFlyZone[this.gridPos[0]][this.gridPos[1]] || hasCollided()) {
      this.noFlyZone[this.gridPos[0]][this.gridPos[1]] = true;

      // Add extra toolPath node directly above last one
      zpos = boundingBox[1][2];
      toolPath.push([prevPoint[0], prevPoint[1], zpos]);

      tool = CSG.cylinder({ radius: toolDiameter/2, slices: 8, start: [pos[0], pos[1], zpos], end: [pos[0], pos[1], zpos+50] });
      tool.setColor(1, 0, 0);
    }
    toolPos = pos;

    // Optimise the path by removing points that are along a straight line
    var minusOne = toolPath[toolPath.length-1];
    var minusTwo = toolPath[toolPath.length-2];
    if (minusOne && minusTwo && pos[1] == minusOne[1] && pos[1] == minusTwo[1] && pos[2] == minusOne[2] && pos[2] == minusTwo[2]) {
      toolPath.splice(toolPath.length-1);
    }

    toolPath.push([pos[0], pos[1], zpos]);
    this.calculatingStep = false;
  }
};
