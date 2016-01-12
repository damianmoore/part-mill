export function calculateBoundingBox(model) {
  var minX = 0, minY = 0, minZ = 0, maxX = 0, maxY = 0, maxZ = 0
  var mesh = model.toMesh()

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
  return boundingBox
}

export function calculateBoundingBoxDimensions(boundingBox) {
  var bbox = boundingBox
  return [
    bbox[1][0] - bbox[0][0],
    bbox[1][1] - bbox[0][1],
    bbox[1][2] - bbox[0][2],
  ]
}

export function calculateIntialToolPos(boundingBox, toolDiameter) {
  return [boundingBox[0][0] + toolDiameter/2, boundingBox[0][1] + toolDiameter/2, boundingBox[1][2]]
}

export function generateTool(scene) {
  var pos = scene.toolPos;
  var height = scene.boundingBox[1][2] - scene.boundingBox[0][2]
  return CSG.cylinder({ radius: scene.toolAndProcess.toolDiameter/2, slices: 8, start: pos, end: [pos[0], pos[1], pos[2]+height] })
}
