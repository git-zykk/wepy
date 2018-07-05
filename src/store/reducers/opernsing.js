import { handleActions } from 'redux-actions'
import { TIPS } from '@/libs'
import {
  GET_OPERN_INFO_BY_OPERN_ID_ACTION,
  UPLOAD_RECORDING_FILE_ACTION,
  REMOVE_RECORDING_ANALYSIS_RESULT_ACTION,
} from '../types/opernsing'

const initialState = {
  noteInfo: {},
  pictureInfo: {},
  recordingAnalysisResult: [],
  recordingUrl: '',
  recordingId: 0,
  recordingEachLineMoveStep: [],
  recordingEachLineTime: []
}

export default handleActions({
  [GET_OPERN_INFO_BY_OPERN_ID_ACTION]: {
    next(state, action) {
      const noteInfo = action.payload.noteInfo
      const pictureInfo = action.payload.pictureInfo

      let systemInfo = wx.getSystemInfoSync()
      let windowWidth = systemInfo.windowWidth
      let noteInfoCopy = [...noteInfo]
      let pictureInfoCopy = Object.assign({}, pictureInfo)
      // 这里算出缩放比，因为对装饰器的写法不太熟悉，所以在这里统一把数据处理了
      // 但是这个做法显然已经违背了redux的三大原则。
      let scaleRatio = windowWidth / (+pictureInfo.pictureWidth)
      //这里是对pictureInfo的处理
      pictureInfoCopy.scaleRatio = scaleRatio
      pictureInfoCopy.pictureWidth = windowWidth
      pictureInfoCopy.pictureHeight = (+pictureInfo.pictureHeight) * scaleRatio
      pictureInfoCopy.marginX = (+pictureInfo.marginX) * scaleRatio
      //这里是对noteInfo的处理，而且因为是传引用，所以直接对noteInfoCopy进行操作就可以了
      noteInfoCopy.forEach((lineValue, lineIndex) => {
        //这里要考虑到一行第一个音符就是休止符的情况
        lineValue.noteList[0].x = (+lineValue.noteList[0].x) || ((+lineValue.startX) + 133)
        //每一行都有自己的lineWidth，减去一个margin和一个第一个音符的偏移量x
        let lineWidth = ((+pictureInfo.pictureWidth) - (+pictureInfo.marginX) - lineValue.noteList[0].x) * scaleRatio
        lineValue.noteList[0].x = lineValue.noteList[0].x * scaleRatio
        lineValue.lineWidth = lineWidth
        lineValue.startX = (+lineValue.startX) * scaleRatio
        lineValue.startY = (+lineValue.startY) * scaleRatio
        let wholeNoteNumber = (+lineValue.beats) / (+lineValue.beatType)
        let wholeNotePix = lineWidth / wholeNoteNumber
        lineValue.noteList.map((noteItem, noteIndex) => {
          if (noteIndex === 0) {
            noteItem.end = noteItem.x + (+noteItem.type) * wholeNotePix
          } else if (noteIndex > 0) {
            noteItem.x = lineValue.noteList[noteIndex - 1].end
            noteItem.end = noteItem.x + (+noteItem.type) * wholeNotePix
          }
          return noteItem
        })
        //按照120ms画一个点来计算的s
        lineValue.moveStep = lineWidth / ((+lineValue.totalDuration) * 1000 / 120)
      })

      return {
        ...state,
        noteInfo: noteInfoCopy,
        pictureInfo: pictureInfoCopy,
      }
    },
    throw(state) {
      // 这些都不是redux写法
      TIPS.fail()
      return state
    }
  },
  [UPLOAD_RECORDING_FILE_ACTION]: {
    next(state, action) {
      let recordingId = 1
      let recordingAnalysisResultCopy = [...action.payload.result]
      let recordingUrl = action.payload.mp3Url
      let recordingDuration = action.payload.mp3Duration
      let noteInfoCopy = state.noteInfo
      let recordingAnalysisResult = []
      let recordingEachLineMoveStep = []
      let recordingEachLineTime = []
      // 这里有一些处理，后面要放到selector里面去
      // 先读取这个谱子我录了多长，然后计算出每一行应该画的点的个数

      let noteTotalDuration = 0
      noteInfoCopy.forEach((element) => {
        noteTotalDuration += parseFloat(element.totalDuration)
      })
      noteInfoCopy.forEach((noteItem, noteIndex) => {
        let eachLineResult = []
        let eachLineRatio = parseFloat(noteItem.totalDuration) / noteTotalDuration
        let hasCountedNum = 0
        recordingAnalysisResult.forEach((element) => {
          hasCountedNum += element.length
        })
        let eachLineMoveStep = noteItem.lineWidth / ((eachLineRatio * recordingDuration) * 1000 / 60)
        eachLineResult = recordingAnalysisResultCopy.slice(hasCountedNum, Math.floor(eachLineRatio * recordingAnalysisResultCopy.length + hasCountedNum) + 1)
        recordingAnalysisResult.push(eachLineResult)
        recordingEachLineMoveStep.push(eachLineMoveStep)
        let eachLineTime = eachLineRatio * recordingDuration * 1000
        recordingEachLineTime.push(eachLineTime)
      })

      return {
        ...state,
        recordingAnalysisResult,
        recordingId,
        recordingUrl,
        recordingEachLineMoveStep,
        recordingEachLineTime
      }
    },
    throw(state) {
      TIPS.fail()
      return state
    }
  },
  [REMOVE_RECORDING_ANALYSIS_RESULT_ACTION]: {
    next(state) {
      return {
        ...state,
        recordingAnalysisResult: [],
        pictureInfo: {},
        noteInfo: {},
        recordingEachLineMoveStep: [],
        recordingEachLineTime: [],
      }
    },
    throw(state) {
      return state
    }
  }
}, initialState)