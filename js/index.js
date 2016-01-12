require("../css/main.scss")

import React from 'react'
import { render } from 'react-dom'

import { createStore } from 'redux'
import reducer from './reducers'
import Application from './application'


const store = createStore(reducer)

render(
  <Application store={store} />,
  document.getElementById('root')
)
