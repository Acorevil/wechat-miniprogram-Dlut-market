// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
  try {
    await db.collection('goods').where({
        _id: event.major_item._id
      })
      .update({
        data: {
          follow_posts: _.push(event.follow_item)
        },
      })
  } catch (e) {
    console.error(e)
  };
}