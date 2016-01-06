"use strict";

class ProgressiveSurfaceStrategy extends Strategy {

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
    }
    else if ((toolDirectionY == 1 &&
               pos[1] + ((resolution + (toolDiameter/2)) * toolDirectionY) <= boundingBox[1][1]) ||
             (toolDirectionY == -1 &&
               pos[1] + ((resolution + (toolDiameter/2)) * toolDirectionY) >= boundingBox[0][1])
             ) {
      // Move tool away from us and change X direction
      pos[1] += resolution * toolDirectionY;
      toolDirectionX = toolDirectionX * -1;
    }
    else if (pos[2] - resolution >= boundingBox[0][2]) {
      // Move tool down a layer and change X & Y direction
      pos[2] -= resolution;
      toolDirectionX = toolDirectionX * -1;
      toolDirectionY = toolDirectionY * -1;
    }
    else {
      // Completed path as got to the bottom of the bounding boundingBox
      return 'COMPLETE';
    }

    tool = CSG.cylinder({ radius: toolDiameter/2, slices: 8, start: pos, end: [pos[0], pos[1], pos[2]+50] });
    var zpos = pos[2];
    while (hasCollided()) {
      zpos += resolution;
      tool = CSG.cylinder({ radius: toolDiameter/2, slices: 8, start: [pos[0], pos[1], zpos], end: [pos[0], pos[1], zpos+50] });
      tool.setColor(1, 0, 0);
      toolPos = pos;
    }
    toolPos = pos;
    this.optimisePath([pos[0], pos[1], zpos]);
    toolPath.push([pos[0], pos[1], zpos]);
    rebuild();
    this.calculatingStep = false;
  }
};
