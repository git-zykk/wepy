import { combineReducers } from 'redux'
import counter from './counter'
import opernSing from './opernsing'
import home from './home'

export default combineReducers({
  counter,
  opernSing,
  home
})