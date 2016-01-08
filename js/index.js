require("../css/main.scss")

import React from 'react'
import { render } from 'react-dom'

import { createStore } from 'redux'
import app from './reducers'
import Application from './application'


const store = createStore(app)

render(
  <Application store={store} />,
  document.getElementById('toolbox')
)
