export const TOGGLE_TOOLBOX_VISIBILITY = 'TOGGLE_TOOLBOX_VISIBILITY'
export const PLAY_PATH_GENERATION = 'PLAY_PATH_GENERATION'
export const PAUSE_PATH_GENERATION = 'PAUSE_PATH_GENERATION'
export const COMPLETE_PATH_GENERATION = 'COMPLETE_PATH_GENERATION'
export const SET_TOOL_PATH = 'SET_TOOL_PATH'
export const SET_TOOL_POS = 'SET_TOOL_POS'
export const REBUILD_SCENE = 'REBUILD_SCENE'
export const SET_MODEL = 'SET_MODEL'
export const SET_SUB_MODEL = 'SET_SUB_MODEL'
export const SET_BOUNDING_BOX = 'SET_BOUNDING_BOX'
export const SET_TOOL_AND_PROCESS = 'SET_TOOL_AND_PROCESS'
export const SET_STEP_MODE = 'SET_STEP_MODE'
export const CLEAR_STEP_MODE = 'CLEAR_STEP_MODE'


export function toggleToolboxVisibility() {
  return { type: TOGGLE_TOOLBOX_VISIBILITY }
}

export function playPathGeneration() {
  return { type: PLAY_PATH_GENERATION }
}

export function pathPathGeneration() {
  return { type: PAUSE_PATH_GENERATION }
}

export function completePathGeneration() {
  return { type: COMPLETE_PATH_GENERATION }
}

export function setToolPos(toolPos) {
  return { type: SET_TOOL_POS, toolPos }
}

export function setToolPath(path) {
  return { type: SET_TOOL_PATH, path }
}

export function rebuildScene() {
  console.log('rebuildScene')
  return { type: REBUILD_SCENE }
}

export function setModel(model) {
  return { type: SET_MODEL, model }
}

export function setSubModel(subModel) {
  return { type: SET_SUB_MODEL, subModel }
}

export function setToolAndProcess(toolAndProcess) {
  return { type: SET_TOOL_AND_PROCESS, toolAndProcess }
}

export function setStepMode() {
  return { type: SET_STEP_MODE }
}

export function clearStepMode() {
  return { type: CLEAR_STEP_MODE }
}
