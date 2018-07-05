import { createAction } from 'redux-actions'

import {
  GET_OPERN_LIST_ACTION,
} from '../types/home'

import {
  getOpernList,
} from '../sources/home'//

export const getOpernListAction = createAction(
  GET_OPERN_LIST_ACTION,
  getOpernList
)