"use strict";

var model = null;
var tool = null;
var boundingBox = null;
var toolPath = [];
var subModel = null;
var strategy = null;

var resolution = 4;
var toolDiameter = 4;
var toolPos = [0, 0, 0];
var toolDirectionX = 1;
var toolDirectionY = 1;

var stepInterval = null;
var statsInterval = null;
var animationInterval = null;
var duration = 0;
var start = null;

function loadSphere() {
  loadModel(CSG.sphere({ radius: 25 }));
}

function loadGourd() {
  console.log(gourdModel)
  var gourd = CSG.fromPolygons(gourdModel.triangles.map(function(tri) {
    return new CSG.Polygon(tri.map(function(i) {
      return new CSG.Vertex(gourdModel.vertices[i], gourdModel.normals[i]);
    }));
  }));
  loadModel(gourd);
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


var holder = document.getElementById('file-drop-zone');

$('#file-drop-zone').bind("drop", function(e) {
  e.preventDefault();
  e.stopPropagation();
  e.originalEvent.preventDefault();
  e.originalEvent.stopPropagation();
  $('#dragBox, #topDiv').hide();
  var dt = e.originalEvent.dataTransfer;
  var files = dt.files;
  handleFileDrop(files);
  return false;
})


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
      [maxX, maxY, maxZ]
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
  tool = CSG.cylinder({ radius: toolDiameter/2, slices: 8, start: pos, end: [pos[0], pos[1], pos[2]+50] });
  rebuild();
}

function hasCollided() {
  if (subModel && subModel.polygons.length > 0 && subModel.intersect(tool).toMesh().vertices.length > 0) {
    return true;
  }
  else if (!subModel && model.intersect(tool).toMesh().vertices.length > 0) {
    return true;
  }
  return false;
}

function playPauseTool() {
  if (stepInterval) {
    clearInterval(stepInterval);
    stepInterval = null;
    clearInterval(statsInterval);
    statsInterval = null;
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
        clearInterval(statsInterval);
        statsInterval = null;
        updateStats();
        rebuild();
      }
    }, 0.01);

    statsInterval = setInterval(updateStats, 200);
    animationInterval = setInterval(rebuild, 33);
  }
}

function updateStats() {
  var time = ((new Date().getTime() - start)/1000).toFixed(3) + ' secs';
  var pathPoints = toolPath.length + ' points'
  $('#stats').html(time + ' &nbsp; ' + pathPoints);
}

var timeout = null;
var viewer = new OpenJsCad.Viewer('#viewer', 100);

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

rebuild();
loadSphere();
loadTool();
//hasCollided();





function handleFileDrop(files) {
    for (var i = 0; i < files.length; i++) {
        var fileName = files[i].name;
        var fileType = files[i].type;
        var fileSize = files[i].size;
        var r = new FileReader();
        r.onload = function(e) {
            var contents = e.target.result;
            var extensionPat = /.*\.(js|txt|html|java|c|cpp|sql|stl)$/i;
            var mimePat = /^text.*/i;
            if (!extensionPat.test(fileName) && !mimePat.test(fileType)) {
                contents = btoa(contents);
                fileSize = contents.length;
            }
            $('#result').val("Got the file.\n" + "name: " + fileName + "\n" + "type: " + fileType + "\n" + "size: " + fileSize + " bytes\n" + "contents:\n\n" + contents);
            loadStl(contents);
        }
        r.readAsBinaryString(files[i]);
    }
}

$('#result').bind("dragenter dragover", function() {
    $('#dragBox, #topDiv').show();
});
$('#topDiv').bind("dragleave dragout", function() {
    $('#dragBox, #topDiv').hide();
});
$('#topDiv').bind("dragenter dragover", function(e) {
    e.preventDefault();
    return false;
});
$('#topDiv').bind("drop", function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.originalEvent.preventDefault();
    e.originalEvent.stopPropagation();
    $('#dragBox, #topDiv').hide();
    var dt = e.originalEvent.dataTransfer;
    var files = dt.files;
    handleFileDrop(files);
    return false;
})
