import './normalize.css'
import '@dadi/edit-ui'
import './main.css'
import {applyMiddleware, compose, createStore} from 'redux'
import App from './containers/App/App'
import {enableBatching} from './lib/redux'
import {Provider} from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import reducers from './reducers'
import thunk from 'redux-thunk'

const storeComposer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = storeComposer(applyMiddleware(thunk))(createStore)(
  enableBatching(reducers)
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
