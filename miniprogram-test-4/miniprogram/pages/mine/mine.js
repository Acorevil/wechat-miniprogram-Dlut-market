//index.js
const app = getApp()

Page({
  data: {
    items: {},
    hidden: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad() {
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },
  bindTapAddress() {
    wx.navigateTo({
      url: '../address/address'
    })
  },
  bindGetUserInfo: function(e) {

    var that = this
    _getUserInfo();

    function _getUserInfo() {
      wx.getUserInfo({
        success: function(res) {
          that.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
    console.log(e.detail.userInfo);
    this.setData({
      hidden: 1
    })
  },
  jumpto_collect: function(e) {
    wx.navigateTo({
      url: '../mine/mycollect/mycollect',
    });
  },

  jumpto_myinterest: function(e) {
    wx.navigateTo({
      url: '../mine/interest/interest',
    });
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
})