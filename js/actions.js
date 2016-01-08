export const TOGGLE_TOOLBOX_VISIBILITY = 'TOGGLE_TOOLBOX_VISIBILITY'
export const TOGGLE_GENERATE_PATH = 'TOGGLE_GENERATE_PATH'
export const GENERATE_PATH_PLAY = 'GENERATE_PATH_PLAY'
export const GENERATE_PATH_PAUSE = 'GENERATE_PATH_PAUSE'


export function toggleToolboxVisibility() {
  return { type: TOGGLE_TOOLBOX_VISIBILITY }
}

export function toggleGeneratePath() {
  return { type: TOGGLE_GENERATE_PATH }
}

export function generatePathPlay() {
  return { type: GENERATE_PATH_PLAY }
}

export function generatePathPause() {
  return { type: GENERATE_PATH_PAUSE }
}
