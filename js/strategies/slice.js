SliceStrategy = function(model, boundingBox) {
  this.model = model;
  this.boundingBox = boundingBox;
  this.calculatingStep = false;
}

SliceStrategy.stepTool = function() {
  if (this.calculatingStep) {
    return;
  }

  this.calculatingStep = true;
  pos = toolPos;
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
    clearInterval(animationInterval);
    animationInterval = null;
    clearInterval(statsInterval);
    statsInterval = null;
    updateStats();
    return false;
  }

  var prevPoint = toolPath[toolPath.length-1]
  if (prevPoint[2] == boundingBox[1][2] && pos[2] != boundingBox[1][2]) {
    toolPath.push([pos[0], pos[1], boundingBox[1][2]]);
  }

  tool = CSG.cylinder({ radius: toolDiameter/2, slices: 8, start: pos, end: [pos[0], pos[1], pos[2]+50] });
  var zpos = pos[2];
  if (hasCollided()) {
    zpos = boundingBox[1][2];
    // Add extra toolPath node directly above last one
    toolPath.push([prevPoint[0], prevPoint[1], zpos]);

    tool = CSG.cylinder({ radius: toolDiameter/2, slices: 8, start: [pos[0], pos[1], zpos], end: [pos[0], pos[1], zpos+50] });
    tool.setColor(1, 0, 0);
    toolPos = pos;
  }
  toolPos = pos;
  toolPath.push([pos[0], pos[1], zpos]);
  rebuild();
  this.calculatingStep = false;
};
