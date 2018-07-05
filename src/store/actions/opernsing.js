import { createAction } from 'redux-actions'

import {
  GET_OPERN_INFO_BY_OPERN_ID_ACTION,
  UPLOAD_RECORDING_FILE_ACTION,
  REMOVE_RECORDING_ANALYSIS_RESULT_ACTION,
} from '../types/opernsing'

import {
  getOpernInfoByOpernId,
  uploadRecordingFile,
} from '../sources/opernsing'

export const getOpernInfoByOpernIdAction = createAction(
  GET_OPERN_INFO_BY_OPERN_ID_ACTION,
  getOpernInfoByOpernId
)

export const uploadRecordingFileAction = createAction(
  UPLOAD_RECORDING_FILE_ACTION,
  uploadRecordingFile
)