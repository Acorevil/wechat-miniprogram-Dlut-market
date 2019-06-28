Page({
  data: {
    motto: '商品',
    userInfo: {},
    item: {},
    viewBg: 'grey'
  },
  //事件处理函数
  onLoad: function (options) {
    let item_value = JSON.parse(options.jsonstr);
    this.setData({ item: item_value });
    console.log('onLoad');
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    this.list = [{
      ///'author': 'xiongcf',
      //'info': 'just for example praise list item.',
      //'praise': 0,
      'hasChange': false
    }]
    this.setData({
      list: this.list
    })
  },

  onShow: function (options) {
    var that = this;
    var db = wx.cloud.database();
    db.collection('posts').doc(that.data.item._id).get({
      success(res) {
        console.log('follow-res', res);
        // res.data 包含该记录的数据
        that.setData({ item: res.data });
      }
    });
    console.log('onShow');
  },

  tapName: function (event) {
    console.log(event)
  },

  ////////////////////////////关注按钮事件///////////////////////////////////////////
  add_like: function (e) {
    ///点赞
    num++;
    var result = num / 2;
    if (num % 2 == 0) {
      //希望添加取消关注的数据库操作///





      this.setData({
        viewBg: 'green'
      })
    } else {

      ///////////////////////////////////////////////////////////////////
      var itemc = this.data.item;
      var that = this;
      var db = wx.cloud.database();
      wx.cloud.callFunction({
        // 云函数名称
        name: 'update_post_like',
        // 传给云函数的参数
        data: {
          item_cloud: itemc
        },
        success(res) {
          // console.log('res', res);
          db.collection('posts').doc(itemc._id).get({
            success(res) {
              // res.data 包含该记录的数据
              console.log('like-res', res);
              that.setData({ item: res.data });
            }
          })

        },
        fail: console.error
      });
      var posts_agreed = that.data.item;
      wx.getUserInfo({
        success(res) {
          const userInfo = res.userInfo
          const nickName = userInfo.nickName
          const avatarUrl = userInfo.avatarUrl
          const gender = userInfo.gender // 性别 0：未知、1：男、2：女
          const province = userInfo.province
          const city = userInfo.city
          const country = userInfo.country;
          posts_agreed.owner = nickName;
        }
      });
      db.collection('person').add({
        // data 字段表示需新增的 JSON 数据
        data: posts_agreed,
        success: res => {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res);
        },
        fail(res) {
          console.log(res);
        }
      });
      //////////////////////////////////////////////////////////////////////////////////
      this.setData({
        viewBg: 'gray'
      })
    }
    console.log(num)
    console.log(result)


  },
  // 跟帖按钮事件
  add_follow: function (event) {
    var itemc = this.data.item;
    // var dateString = JSON.stringify(itemc.)
    var that = this;
    var db = wx.cloud.database();
    wx.cloud.callFunction({
      // 云函数名称
      name: 'update_post_follow',
      // 传给云函数的参数
      data: {
        item_cloud: itemc
      },
      success(res) {
        // console.log('res', res);
        db.collection('posts').doc(itemc._id).get({
          success(res) {
            console.log('follow-res', res);
            // res.data 包含该记录的数据
            that.setData({ item: res.data });
          }
        });
        var type = "follow";
        var str = JSON.stringify(itemc);
        wx.navigateTo({
          url: '../release/release?type=' + type + '&item=' + str,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })

      },
      fail: console.error
    });
  },
  changeBg() {
    num++;
    var result = num / 2;
    if (num % 2 == 0) {
      this.setData({
        viewBg: 'green'
      })
    } else {
      this.setData({
        viewBg: 'blue'
      })
    }
    console.log(num)
    console.log(result)
  }



})
