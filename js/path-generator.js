export default class PathGenerator {
  constructor(events) {
    this.events = events
    this.generating = false
    this.strategyName = null
    this.strategy = null
    this.stepInterval = null
    this.animationInterval = null
    this.toolPath = []
  }
  handleStepReturn(retVal) {
    if (retVal == 'COMPLETE') {
      this.strategy.pause()
      clearInterval(this.stepInterval)
      this.stepInterval = null
      clearInterval(this.animationInterval)
      this.animationInterval = null
      this.events.setPathAndSubModel(this.toolPath, this.strategy.subModel)
      this.events.completePathGeneration()
      //updateStats();
    }
    else {
      this.toolPath = this.toolPath.concat(retVal)
      //setToolPath(this.toolPath)
    }
  }
  updateStats(scene, path) {
    var time = ((new Date().getTime() - scene.generationStartTime)/1000).toFixed(3) + ' secs';
    var pathPoints = path.length + ' points'
    $('#stats').html(time + ' &nbsp; ' + pathPoints);
  }
  update(scene) {
    if (scene.generating != this.generating) {
      if (scene.generating && !this.animationInterval) {
        this.animationInterval = setInterval(function(scene) {
          //this.events.setToolPath(this.toolPath)
          //this.events.setSubModel(this.strategy.subModel)
          // Combine these action calls as we don't want to re-draw the 3D scene unnescessarily
          this.events.setPathAndSubModel(this.toolPath, this.strategy.subModel)
          this.updateStats(scene, this.toolPath)
        }.bind(this, scene), 500);
        this.generating = true
      }
      else if (!scene.generating) {
        this.generating = false
        if (this.animationInterval) {
          clearInterval(this.animationInterval)
          this.animationInterval = null
        }
        if (this.stepInterval) {
          clearInterval(this.stepInterval)
          this.stepInterval = null
        }
      }
    }

    if (scene.model && scene.toolAndProcess.strategy != this.strategyName) {
      this.strategyName = scene.toolAndProcess.strategy
      this.strategy = new strategies[this.strategyName](scene, this.events)
    }

    if (scene.generating || scene.stepMode) {
      if (this.strategy) {
        this.strategy.unpause();
      }


      if (scene.stepMode) {
        var prevPoint = null
        if (this.toolPath.length > 0) {
          prevPoint = this.toolPath[this.toolPath.length-1]
        }
        var retVal = this.strategy.stepTool(prevPoint)
        this.handleStepReturn(retVal)
        this.events.clearStepMode()
        this.events.setToolPath(this.toolPath)
      }
      else if (!this.stepInterval) {
        this.stepInterval = setInterval(function() {
          var prevPoint = null
          if (this.toolPath.length > 0) {
            prevPoint = this.toolPath[this.toolPath.length-1]
          }
          var retVal = this.strategy.stepTool(prevPoint)
          this.handleStepReturn(retVal)
        }.bind(this), 1)
      }
    }
    else {
      clearInterval(this.stepInterval)
      this.stepInterval = null
      if (this.strategy) {
        this.strategy.pause()
      }
    }
  }
}
