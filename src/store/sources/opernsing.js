import { HTTP, TIPS } from '@/libs'

export function getOpernInfoByOpernId({
  opernId
}) {
  TIPS.loading()
  return HTTP.get(`opern/info?id=${opernId}`).then((res) => {
    TIPS.loaded()
    let data = {
      noteInfo: res.data.noteInfo,
      pictureInfo: res.data.pictureInfo,
    }
    return data
  })
}

export function uploadRecordingFile({
  filePath
}) {
  TIPS.loading('解析录音')
  return HTTP.uploadFile('recording', filePath, 'mp3')
    .then((res) => {
      let data = JSON.parse(res)
      TIPS.loaded()
      return data.data
    })
}