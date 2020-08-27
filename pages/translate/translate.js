// pages/test/test.js
const CryptoJS = require('crypto-js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    history: [],
    inputValue: '',
    output: '',
    objectArray: [
      {
        id: 'zh-CHS',
        name: '中文'
      },
      {
        id: 'en',
        name: '英文'
      },
      {
        id: 'ja',
        name: '日文'
      },
      {
        id: 'ko',
        name: '韩文'
      },
      {
        id: 'fr',
        name: '法文'
      },
      {
        id: 'es',
        name: '西班牙文'
      },
      {
        id: 'pt',
        name: '葡萄牙文'
      },
      {
        id: 'it',
        name: '意大利文'
      },
      {
        id: 'ru',
        name: '俄文'
      },
      {
        id: 'de',
        name: '德文'
      },
    ],
  },

  bindPickerChange(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  truncate(q) {
    var len = q.length;
    if (len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len - 10, len);
  },
  translate(query,index) {
    
    const appKey = '64dc80fc254339df';
    const key = '6cQ69HWC5M0rc8hriHb5cApebbgzjHic';
    const salt = (new Date).getTime();
    const curtime = Math.round(new Date().getTime() / 1000);
    const from = 'auto';
    const to = this.data.objectArray[index].id;
    const str1 = appKey + this.truncate(query) + salt + curtime + key;
    const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);
    
    // 发送请求
    const that = this;
    wx.request({
      url: 'https://openapi.youdao.com/api',
      method: "GET",
      dataType: "json",
      data: {
        q: query,
        appKey: appKey,
        salt: salt,
        from: from,
        to: to,
        sign: sign,
        signType: "v3",
        curtime: curtime,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        let result={'query':query,'translate':res.data.translation[0]}
        
        that.setData({
          output: res.data.translation[0],
          history: that.data.history.concat([result])
        })
        // 存到本地
        wx.setStorage({
          data: that.data.history,
          key: 'history',
        })
        console.log(that.data.history);
        
      }
    })
  },
  formSubmit(e) {
    const index = e.detail.value.picker
    
    // console.log(this.objectArray[index].id);
    
    const query = e.detail.value.textarea;
    
    if (query !== '') {
      this.translate(query,index)
    }
  },
  formReset(){
    this.setData({
      inputValue: '',
      output: ''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.getStorage({
      key: 'history',
      success (res) {
        that.setData({
          history: res.data
        })
      },
      fail(e){
        console.log(e)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})