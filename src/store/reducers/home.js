import { handleActions } from 'redux-actions'
import { TIPS } from '@/libs'
import {
  GET_OPERN_LIST_ACTION,
} from '../types/home'

const initialState = {
  opernList: [],
}

export default handleActions({
  [GET_OPERN_LIST_ACTION]: {
    next(state, action) {
      const opernList = [...action.payload.data]
      return {
        ...state,
        opernList,
      }
    }, throw(state) {
      return state
    }
  }
}, initialState)