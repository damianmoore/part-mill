import { combineReducers } from 'redux'
import { TOGGLE_TOOLBOX_VISIBILITY, TOGGLE_GENERATE_PATH } from './actions'


function toolboxVisibility(state = true, action) {
  switch (action.type) {
    case TOGGLE_TOOLBOX_VISIBILITY:
      return !state
    default:
      return state
  }
}

function generatingPath(state = false, action) {
  switch (action.type) {
    case TOGGLE_GENERATE_PATH:
      return !state
    default:
      return state
  }
}

const app = combineReducers({
  toolboxVisibility,
  generatingPath,
})

export default app
