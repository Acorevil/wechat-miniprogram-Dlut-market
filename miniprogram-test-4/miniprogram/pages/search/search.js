var app = getApp()

var touchDot = 0;//触摸时的原点 
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = "";// 记录/清理时间记录 


Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    feed: [],
    feed_length: 0,
    searchValue: '',
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  nLoad: function(options) {
    wx.cloud.init();
    // if (!wx.cloud) {
    //   wx.redirectTo({
    //     url: '../chooseLib/chooseLib',
    //   })
    //   return
    // }
    console.log('onLoad');
    var that = this;
    //调用应用实例的方法获取全局数据
    // this.getData();
    const db = wx.cloud.database();
    var content_array = new Array();
    var keyword = options.searchValue;
    this.setData({
      searchValue: keyword
    });

    var content_array = [];
    var search_res_list = [];
    db.collection('goods').get().then(res => {
      // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
      content_array = res.data;
      console.log('content_array: ', content_array);
      var one_good;
      for (var i = 0; i < content_array.length; i++) {
        one_good = content_array[i];
        console.log('one_good: ', one_good);
        console.log('one_good-content: ', one_good["good_content"]);
        if (one_good["good_content"].indexOf(keyword) >= 0 ||
          one_good["good_brief"].indexOf(keyword) >= 0 ||
          one_good["user_name"].indexOf(keyword) >= 0) {
          search_res_list.push(one_good);
          console.log('list: ', search_res_list);
          continue;
        }
        for (var j = 0; j < one_good["good_tags"].length; j++) {
          if (one_good["good_tags"][j].indexOf(keyword) >= 0) {
            search_res_list.push(one_good);
            console.log('list: ', search_res_list);
            break;
          }
        }
      }
      this.setData({
        feed: search_res_list
      });
    });　　
  },

  upper: function() {
    wx.showNavigationBarLoading()
    this.refresh();
    console.log("upper");
    setTimeout(function() {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 2000);
  },
  lower: function(e) {
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function() {
      wx.hideNavigationBarLoading();
      that.nextLoad();
    }, 1000);
    console.log("lower")
  },

  /*方案一：跳转到comment
  bindItemTap: function () {
     wx.navigateTo({
       url: '../comment/comment'
     })
  },*/
  /*方案二：跳转到posts*/
  bindItemTap: function(event) {
    let str = JSON.stringify(event.currentTarget.dataset.itemValue);
    wx.navigateTo({
      url: '../goods/goods?jsonstr=' + str,
    })
  },

  //网络请求数据, 实现首页刷新
  refresh0: function() {
    var index_api = '';
    util.getData(index_api)
      .then(function(data) {
        //this.setData({
        //
        //});
        console.log(data);
      });
  },

  //使用本地 fake 数据实现刷新效果
  getData: function() {
    var feed = util.getData2();
    console.log("loaddata");
    var feed_data = feed.data;
    this.setData({
      feed: feed_data,
      feed_length: feed_data.length
    });
  },
  refresh: function() {
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 2000
    });
    var feed = util.getData2();
    console.log("loaddata");
    var feed_data = feed.data;
    this.setData({
      feed: feed_data,
      feed_length: feed_data.length
    });
    setTimeout(function() {
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 2000
      })
    }, 3000)

  },

  //使用本地 fake 数据实现继续加载效果
  nextLoad: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 3000
    })
    var next = util.getNext();
    console.log("continueload");
    var next_data = next.data;
    this.setData({
      feed: this.data.feed.concat(next_data),
      feed_length: this.data.feed_length + next_data.length
    });
    setTimeout(function() {
      wx.showToast({
        title: '加载成功',
        icon: 'success',
        duration: 2000
      })
    }, 3000)
  },

  searchValueInput: function(e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
    });
  },

  start_search: function(e) {
    var keyword = this.data.searchValue;
    var list = this.data.list;
    for (var index in list) {
      var t = list[index];
      if (t.indexOf(keyword) >= 0) {
        console.log('success' + t);
        this.setData({
          res: t,
        });
      } else {
        console.log("fail");
      }
    }
  },

  start_search_db: function(e) {
    var keyword = this.data.searchValue;
    wx.navigateTo({
      url: '/pages/search/search?searchValue=' + keyword
    });
  },
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点 
    // 使用js计时器记录时间  
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  touchEnd: function (e) {
    clearInterval(interval); // 清除setInterval 
    time = 0;
  },
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点 
    // 使用js计时器记录时间  
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件 
  touchMove: function (e) {
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
  touchEnd: function (e) {
    clearInterval(interval); // 清除setInterval 
    time = 0;
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