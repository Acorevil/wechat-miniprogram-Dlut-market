//index.js
var app = getApp()

var touchDot = 0; //触摸时的原点 
var time = 0; // 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = ""; // 记录/清理时间记录 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feed: [],
    feed_length: 0,
    list: [],
    items: {},
    slides: {},
    imageurl: [
      '../../images/1.jpg',
      '../../images/2.jpg',
      '../../images/3.jpg'
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: false,
    previousmargin: 0,
    nextmargin: 0,
    duration: 500,
    interval: 5000
  },
  onLoad: function() {
    wx.cloud.init();
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    console.log('onLoad');

  },
  start_search_db: function(e) {
    var keyword = this.data.searchValue;
    wx.navigateTo({
      url: '/pages/search/search?searchValue=' + keyword
    });
  },
  searchValueInput: function(e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
    });
  },
  onShow: function() {
    var that = this;
    //调用应用实例的方法获取全局数据
    // this.getData();
    const db = wx.cloud.database();
    var content_array = new Array();
    // var posts_array = [];
    db.collection('goods').get().then(res => {
      // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
      content_array = res.data;
      this.setData({
        feed: content_array,
      });
    });
    console.log('onShow');
  },


  /*方案：跳转到goods*/
  bindItemTap: function(event) {
    let str = JSON.stringify(event.currentTarget.dataset.itemValue);
    wx.navigateTo({
      url: '../goods/goods?jsonstr=' + str,
    })
  },
  touchStart: function(e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点 
    // 使用js计时器记录时间  
    interval = setInterval(function() {
      time++;
    }, 100);
  },
  // 触摸移动事件 
  touchMove: function(e) {
    var touchMove = e.touches[0].pageX;
    console.log("touchMove:" + touchMove + " touchDot:" + touchDot + " diff:" + (touchMove - touchDot));
    // 向左滑动  
    if (touchMove - touchDot <= -40 && time < 10) {
      wx.switchTab({
        url: '../material/material'
      });
    }
    // 向右滑动 
    if (touchMove - touchDot >= 40 && time < 10) {
      console.log('向右滑动');
      wx.switchTab({
        url: '../index/index'
      });
    }
  },
  // 触摸结束事件 
  touchEnd: function(e) {
    clearInterval(interval); // 清除setInterval 
    time = 0;
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

  },
  onPostClick: function(e) {
    var type = "new";
    wx.navigateTo({
      url: '../release/release?type=' + type,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})