"use strict";


var model = null;
var tool = null;
var boundingBox = null;
var boundingBoxDimensions = [0, 0, 0];
var toolPath = [];
var subModel = null;
var strategies = {
  'SliceStrategy': SliceStrategy,
  'SurfaceStrategy': SurfaceStrategy,
  'ProgressiveSurfaceStrategy': ProgressiveSurfaceStrategy,
}
var strategy = null;

var resolution = 2;
var toolDiameter = 2;
var toolPos = [0, 0, 0];
var toolDirectionX = 1;
var toolDirectionY = 1;

var stepInterval = null;
var animationInterval = null;
var duration = 0;
var start = null;

function loadSphere() {
  loadModel(CSG.sphere({ radius: 25 }));
}

function loadMonkey() {
  var monkey = CSG.fromPolygons(monkeyModel.triangles.map(function(tri) {
    return new CSG.Polygon(tri.map(function(i) {
      return new CSG.Vertex(monkeyModel.vertices[i], monkeyModel.normals[i]);
    }));
  }));
  loadModel(monkey);
}

function loadStl(contents) {
  var polygons = ParseStl.parse(contents);
  var model = CSG.fromPolygons(polygons.map(function(tri) {
    return new CSG.Polygon(tri.vertices);
  }));
  loadModel(model);
}

function pickFile(elemId) {
  var elem = document.getElementById(elemId);
  if (elem && document.createEvent) {
     var evt = document.createEvent("MouseEvents");
     evt.initEvent("click", true, false);
     elem.dispatchEvent(evt);
  }
}

function loadModel(newModel) {
  if (newModel) {
    model = newModel;
    model.setColor(0, 0.5, 1);
  }
  else {
    model = null;
  }
  calculateBoundingBox();
  loadTool();
  strategy = new SliceStrategy(model, boundingBox);
  rebuild();
}

function calculateBoundingBox() {
  if (model) {
    var minX = 0, minY = 0, minZ = 0, maxX = 0, maxY = 0, maxZ = 0;
    var mesh = model.toMesh();
    for (var i=0; i < mesh.vertices.length; i++) {
      if (mesh.vertices[i][0] < minX) {
        minX = mesh.vertices[i][0];
      }
      if (mesh.vertices[i][1] < minY) {
        minY = mesh.vertices[i][1];
      }
      if (mesh.vertices[i][2] < minZ) {
        minZ = mesh.vertices[i][2];
      }
      if (mesh.vertices[i][0] > maxX) {
        maxX = mesh.vertices[i][0];
      }
      if (mesh.vertices[i][1] > maxY) {
        maxY = mesh.vertices[i][1];
      }
      if (mesh.vertices[i][2] > maxZ) {
        maxZ = mesh.vertices[i][2];
      }
    }
    boundingBox = [
      [minX, minY, minZ],
      [maxX, maxY, maxZ],
    ]
    boundingBoxDimensions = [
      maxX - minX,
      maxY - minY,
      maxZ - minZ,
    ]
  }
}

function loadTool() {
  var pos = [boundingBox[0][0] + toolDiameter/2, boundingBox[0][1] + toolDiameter/2, boundingBox[1][2]];
  toolPath = [[pos[0], pos[1], pos[2]]];
  toolPos = pos;
  toolDirectionX = 1;
  toolDirectionY = 1;
  duration = 0;
  tool = CSG.cylinder({ radius: toolDiameter/2, slices: 8, start: pos, end: [pos[0], pos[1], pos[2]+boundingBoxDimensions[2]] });
  rebuild();
}

function playPauseTool() {
  if (stepInterval) {
    clearInterval(stepInterval);
    stepInterval = null;
    clearInterval(animationInterval);
    animationInterval = null;

    strategy.pause();
    updateStats();
    rebuild();
  }
  else {
    start = new Date().getTime();
    strategy.unpause();
    stepInterval = setInterval(function() {
      var retVal = strategy.stepTool();
      if (retVal == 'COMPLETE') {
        strategy.pause();
        clearInterval(stepInterval);
        stepInterval = null;
        clearInterval(animationInterval);
        animationInterval = null;
        rebuild();
        updateStats();
      }
    }, 1);

    animationInterval = setInterval(function() {
      rebuild();
      updateStats()
    }, 500);
  }
}

function stepTool() {
  strategy.stepTool();
  rebuild();
  updateStats();
}

function updateStats() {
  var time = ((new Date().getTime() - start)/1000).toFixed(3) + ' secs';
  var pathPoints = toolPath.length + ' points'
  $('#stats').html(time + ' &nbsp; ' + pathPoints);
}

var timeout = null;
var viewer = new OpenJsCad.Viewer('#viewer', 40);

function rebuild() {
  viewer.meshes = []

  if (subModel) {
    viewer.meshes.push(subModel.toMesh());
  }
  else if (model) {
    viewer.meshes.push(model.toMesh());
  }

  if (tool) {
    viewer.meshes.push(tool.toMesh());
  }

  viewer.boundingBox = boundingBox;
  viewer.toolPath = toolPath;
  viewer.gl.ondraw();
}

function changeStrategy(e) {
  strategy = new strategies[e.target.value](model, boundingBox);
  loadTool();
}

function changeResolution(e) {
  resolution = parseFloat(e.target.value);
  loadTool();
}

function changeToolDiameter(e) {
  toolDiameter = parseFloat(e.target.value);
  rebuild();
  if (model) {
    loadTool();
  }
}


rebuild();
loadMonkey();
loadTool();
