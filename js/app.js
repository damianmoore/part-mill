
var model = null;
var tool = null;
var boundingBox = null;
var toolPath = []

var resolution = 5;
var toolDiameter = 3;
var toolPos = [0, 0, 0];
var toolDirectionX = '1';
var toolDirectionY = '1';
var animationInterval = null;

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
  polygons = ParseStl.parse(contents);
  console.log(polygons)
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
  rebuild();
}

function calculateBoundingBox() {
  if (model) {
    var minX = minY = minZ = maxX = maxY = maxZ = 0;
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
  pos = [boundingBox[0][0] + toolDiameter/2, boundingBox[0][1] + toolDiameter/2, boundingBox[1][2]];
  toolPath = [[pos[0], pos[1], pos[2]]];
  toolPos = pos;
  tool = CSG.cylinder({ radius: toolDiameter/2, start: pos, end: [pos[0], pos[1], pos[2]+50] });
  tool.setColor(1, 0, 0);
  rebuild();
}

function hasCollided() {
  if (model.intersect(tool).toMesh().vertices.length > 0) {
    return true;
  }
  return false;
}

function stepTool() {
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
    // Move tool down a layer and change Z direction
    pos[2] -= resolution;
    toolDirectionY = toolDirectionY * -1;
  }
  else {
    // Completed path as got to the bottom of the bounding boundingBox
    clearInterval(animationInterval);
    animationInterval = null;
    return false;
  }

  toolPath.push([pos[0], pos[1], pos[2]]);
  toolPos = pos;
  //console.log(toolPos);
  tool = CSG.cylinder({ radius: toolDiameter/2, start: pos, end: [pos[0], pos[1], pos[2]+50] });
  tool.setColor(1, 0, 0);
  if (hasCollided()) {
    console.log('COLLISION');
  }
  rebuild();
}

function playPauseTool() {
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }
  else {
    animationInterval = setInterval(stepTool, 10);
  }
}

var timeout = null;
var viewer = new OpenJsCad.Viewer('#viewer', 100);

function rebuild() {
  viewer.meshes = []
  if (model) {
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
