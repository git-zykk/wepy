const baseURL = 'https://sing.mamasousuo.com/wechat/'

var Http = {
  /**
   * [HTTP GET 请求]
   * @param [第1种使用方法是URL不带参数。第2种使用方法是在请求URL后带参数，如：?id=1&name=ming]
   * 1. HTTP.get(url).then((data) => {}).catch((error) => {})
   * 2. HTTP.get({url: url, params: [JSON Object] }).then((data) => {}).catch((error) => {})
   */
  get: function (requestHandler) {
    if (typeof requestHandler === 'string') {
      requestHandler = {
        url: String(requestHandler),
        params: {}
      }
    }
    return this.Request('GET', requestHandler)
  },

  /**
   * [HTTP POST 请求]
   * @param [可自定义 headers，如需 Authorization 等，默认：'Content-Type': 'application/json']
   * HTTP.post({url: url, params: [JSON Object], headers: [JSON Object] }).then((data) => {}).catch((error) => {})
   */
  post: function (requestHandler) {
    return this.Request('POST', requestHandler)
  },

  /**
   * [HTTP PATCH 请求]
   * HTTP.patch({url: url, params: [JSON Object], headers: [JSON Object] }).then((data) => {}).catch((error) => {})
   */
  patch: function (requestHandler) {
    return this.Request('PATCH', requestHandler)
  },

  /**
   * [HTTP PUT 请求]
   * HTTP.put({url: url, params: [JSON Object], headers: [JSON Object] }).then((data) => {}).catch((error) => {})
   */
  put: function (requestHandler) {
    return this.Request('PUT', requestHandler)
  },

  /**
   * [HTTP DELETE 请求]
   * HTTP.delete({url: url, params: [JSON Object], headers: [JSON Object] }).then((data) => {}).catch((error) => {})
   */
  delete: function (requestHandler) {
    return this.Request('DELETE', requestHandler)
  },

  // request
  Request: function (method, requestHandler) {
    const { url, params, headers } = requestHandler

    //   wx.showLoading && wx.showLoading({title: 'Loading...'})

    return new Promise((resolve, reject) => {
      wx.request({
        url: baseURL + url,
        data: params,
        method: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].indexOf(method) > -1 ? method : 'GET',
        header: Object.assign({
          'Content-Type': 'application/json'
          /*
          这里可以自定义全局的头信息，这是一个栗子
          'Authorization': 'Bearer ' + wx.getStorageSync('token'),
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded'
          */
        }, headers),
        success: function (res) {
          const { data, statusCode } = res
          // 处理数据
          statusCode === 200 ? resolve(data) : reject(data, statusCode)
        },
        fail: function () {
          reject('Network request failed')
        },
        complete: function () {
          // wx.hideLoading && wx.hideLoading()
        }
      })
    })
  },

  /**
   * [UPLOAD FILE 上传文件]
   * @param [可自定义 headers，如需 Authorization 等，默认：'Content-Type': 'multipart/form-data']
   * HTTP.uploadFile({url: url, filePath: String, headers: [JSON Object], formData: [JSON Object] }).then((data) => {}).catch((error) => {})
   */
  // TODO: 
  uploadFile: function (url, filePath, name = 'file', header = {}, formData = {}) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: baseURL + url,
        filePath,
        name,
        header,
        formData,
        success: (res) => {
          const { data, statusCode } = res;
          (statusCode === 200) ? resolve(data) : reject(data, statusCode)
        },
        fail: () => {
          reject('Network request failed')
        },
        complete: function () {
        }
      })
    })
  },

  /**
  * [下载单个临时文件 - wx.downloadFile]
  * @param {string} [url] [需要下载的文件地址]
  * HTTP.downloadTempFile({url:[string],success:[Fuction],fail:[Fuction]})
  */

  downloadTempFile: function (fileUrl) {
    let that = this
      , url = fileUrl

    // obj.id ? id = obj.id : id = url

    // 下载文件
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: fileUrl,
        success: (res) => {
          const {tempFilePath, statusCode} = res
          if(statusCode === 200) {
            resolve(tempFilePath)
          } else {
            reject(e)
          }
        },
        fail: (e) => {
          console.info("下载一个文件失败")
          reject(e)
        },
        complete: (e) => {
        }
      })
    })
  },
}

module.exports = Http;