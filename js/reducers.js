import { combineReducers } from 'redux'
import { TOGGLE_TOOLBOX_VISIBILITY, PLAY_PATH_GENERATION, PAUSE_PATH_GENERATION, COMPLETE_PATH_GENERATION, SET_TOOL_PATH, SET_PATH_AND_SUB_MODEL, SET_TOOL_POS, SET_MODEL, SET_SUB_MODEL, SET_BOUNDING_BOX, SET_TOOL_AND_PROCESS, SET_STEP_MODE, CLEAR_STEP_MODE } from './actions'
import { calculateBoundingBox, calculateBoundingBoxDimensions, calculateIntialToolPos } from './utils'


const toolboxInitialState = {
  visibility: true,
}

function toolbox(state = toolboxInitialState, action) {
  switch (action.type) {
    case TOGGLE_TOOLBOX_VISIBILITY:
      return Object.assign({}, state, {
        visibility: !state.visibility
      })
    default:
      return state
  }
}


const sceneInitialState = {
  model: null,
  subModel: null,
  boundingBox: null,
  boundingBoxDimensions: null,
  toolAndProcess: {
    strategy: 'SliceStrategy',
    resolution: 2,
    toolDiameter: 2,
  },
  generating: false,
  generationStartTime: null,
  path: [],
  toolPos: null,
  stepMode: false,
}

function scene(state = sceneInitialState, action) {
  switch (action.type) {
    case SET_MODEL:
      var boundingBox = calculateBoundingBox(action.model);
      return Object.assign({}, state, {
        model: action.model,
        boundingBox: boundingBox,
        boundingBoxDimensions: calculateBoundingBoxDimensions(boundingBox),
        toolPos: calculateIntialToolPos(boundingBox, state.toolAndProcess.toolDiameter),
      })
    case SET_SUB_MODEL:
      return Object.assign({}, state, {
        subModel: action.subModel,
      })
    case SET_TOOL_AND_PROCESS:
      return Object.assign({}, state, {
        toolAndProcess: action.toolAndProcess,
      })
    case PLAY_PATH_GENERATION:
      return Object.assign({}, state, {
        generating: true,
        generationStartTime: new Date().getTime(),
      })
    case PAUSE_PATH_GENERATION:
      return Object.assign({}, state, {
        generating: false
      })
    case COMPLETE_PATH_GENERATION:
      return Object.assign({}, state, {
        generating: false
      })
    case SET_TOOL_PATH:
      return Object.assign({}, state, {
        path: action.path
      })
    case SET_PATH_AND_SUB_MODEL:
      return Object.assign({}, state, {
        path: action.path,
        subModel: action.subModel,
      })
    case SET_TOOL_POS:
      return Object.assign({}, state, {
        toolPos: action.toolPos
      })
    case SET_STEP_MODE:
      return Object.assign({}, state, {
        stepMode: true
      })
    case CLEAR_STEP_MODE:
      return Object.assign({}, state, {
        stepMode: false
      })
    default:
      return state
  }
}

const reducer = combineReducers({
  toolbox,
  scene,
})

export default reducer
