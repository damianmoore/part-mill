// Set the color of all polygons in this solid
CSG.prototype.setColor = function(r, g, b) {
  this.toPolygons().map(function(polygon) {
    polygon.shared = [r, g, b];
  });
};

// Convert from CSG solid to GL.Mesh object
CSG.prototype.toMesh = function() {
  var mesh = new GL.Mesh({ normals: true, colors: true });
  var indexer = new GL.Indexer();
  this.toPolygons().map(function(polygon) {
    var indices = polygon.vertices.map(function(vertex) {
      vertex.color = polygon.shared || [1, 1, 1];
      return indexer.add(vertex);
    });
    for (var i = 2; i < indices.length; i++) {
      mesh.triangles.push([indices[0], indices[i - 1], indices[i]]);
    }
  });
  mesh.vertices = indexer.unique.map(function(v) { return [v.pos.x, v.pos.y, v.pos.z]; });
  mesh.normals = indexer.unique.map(function(v) { return [v.normal.x, v.normal.y, v.normal.z]; });
  mesh.colors = indexer.unique.map(function(v) { return v.color; });
  mesh.computeWireframe();
  return mesh;
};

// Create a cuboid from two bounding box coordinates
CSG.box = function(options) {
  options = options || {};
  var b = options.bbox || [[0, 0, 0], [0, 0, 0]];
  var c = [
    b[0][0] + (b[1][0]-b[0][0]) / 2,
    b[0][1] + (b[1][1]-b[0][1]) / 2,
    b[0][2] + (b[1][2]-b[0][2]) / 2,
  ];
  var r = [
    (b[1][0] - b[0][0]) / 2,
    (b[1][1] - b[0][1]) / 2,
    (b[1][2] - b[0][2]) / 2,
  ];
  return CSG.cube({center: c,  radius: r});
};
