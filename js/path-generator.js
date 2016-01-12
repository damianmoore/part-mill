

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
      this.events.setToolPath(this.toolPath)
      //updateStats();
    }
    else {
      this.toolPath = this.toolPath.concat(retVal)
      //setToolPath(this.toolPath)
    }
  }
  update(scene) {
    if (scene.generating != this.generating) {
      if (scene.generating && !this.animationInterval) {
        this.animationInterval = setInterval(function() {
          this.events.setToolPath(this.toolPath)
          this.events.setSubModel(this.strategy.subModel)
        }.bind(this), 500);
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
      console.log('no gen')
      clearInterval(this.stepInterval)
      this.stepInterval = null
      if (this.strategy) {
        this.strategy.pause()
      }
    }
  }
}
