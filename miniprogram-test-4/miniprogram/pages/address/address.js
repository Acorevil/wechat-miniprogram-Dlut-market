Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailAddress: '',
    receiverName: '',
    receiverMobile: '',
    arrayProvince: [],
    arrayCity: [],
    arrayCounty: [],
    provinces: ["海外", "北京市", "天津市", "河北省", "山西省", "内蒙古自治区", "辽宁省", "吉林省", "黑龙江省", "上海市", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省", "湖北省", "湖南省", "广东省", "广西壮族自治区", "海南省", "重庆市", "四川省", "贵州省", "云南省", "西藏自治区", "陕西省", "甘肃省", "青海省", "宁夏回族自治区", "新疆维吾尔自治区", "台湾省", "香港特别行政区", "澳门特别行政区"],
    indexProvince: 0,
    indexCity: 0,
    indexCounty: 0,
  },
  bindChangeProvince: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      indexProvince: e.detail.value
    })
  },
  formSubmit: function(e) {
    this.setData({
      'detailAddress': e.detail.value.inputDetail
    })
    wx.setStorage({
      key: 'detailAddress',
      data: e.detail.value.inputDetail.trim()
    })

    var receiverName = e.detail.value.inputName.trim()
    var receiverMobile = e.detail.value.inputMobile.trim()
    if (!(receiverName && receiverMobile)) {
      this.errorModal('收货人姓名和手机号不能为空')
      return
    }
    if (!receiverMobile.match(/^1[3-9][0-9]\d{8}$/)) {
      this.errorModal('手机号格式不正确，仅支持国内手机号码')
      return
    }
    wx.setStorage({
      key: 'receiverName',
      data: receiverName
    })
    wx.setStorage({
      key: 'receiverMobile',
      data: receiverMobile
    })
    wx.setStorageSync('currentDistrict', [this.data.indexProvince, this.data.indexCity, this.data.indexCounty])
    var pages = getCurrentPages()
    var cartPage = pages[pages.length - 2]
    cartPage.setData({
      refreshAddress: true
    })
    wx.navigateBack()
  },

  errorModal: function(content) {
    wx.showModal({
      title: '出现错误',
      content: content
    })
  },
  bindAgreeChange: function(e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})