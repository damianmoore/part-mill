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

var resolution = 4;
var toolDiameter = 4;
var toolPos = [0, 0, 0];

var stepInterval = null;
var statsInterval = null;
var animationInterval = null;
var duration = 0;
var start = null;


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
    //rebuild();
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
        clearInterval(animationInterval);
        animationInterval = null;
        //rebuild();
        updateStats();
      }
    }, 1);

    statsInterval = setInterval(updateStats, 200);
    animationInterval = setInterval(rebuild, 33);
  }
}

/*
function stepTool() {
  strategy.stepTool();
  //rebuild();
  updateStats();
}
*/

function updateStats() {
  var time = ((new Date().getTime() - start)/1000).toFixed(3) + ' secs';
  var pathPoints = toolPath.length + ' points'
  $('#stats').html(time + ' &nbsp; ' + pathPoints);
}

var timeout = null;


//rebuild();
//loadMonkey();
//loadTool();
