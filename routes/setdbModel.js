// const { connectMongodb } = require('./connectMongodb')
const mongoose = require('mongoose')
// const { gfs } = connectMongodb() // 连接数据库


const initSchema = async () => {
  var Schema = mongoose.Schema
  // 用户信息
  var userDatas // model实例承载者！！！！！！！这个对应collectName，
  var userDataschema = new Schema({ // 制定lessonInfo的数据规则
    account: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    avatar: String,
    starIdArr: Array, //收藏
    desc: String, // 个性签名
    blogId: { type: String, required: true },
    userId: { type: String, required: true }
  }, { collection: 'userDatas' })/* 设定collection的名字，否则数据库会自动帮你的名字复数 */

  // 博客信息
  var blogDatas // model实例承载者！！！！！！！这个对应collectName，
  var blogDataschema = new Schema({ // 制定lessonInfo的数据规则
    bloggerId: { type: String, required: true },
    blogId: { type: String, required: true },
    UIModuleIdArr: Array, // 可以考虑加个分类所属，效率查找 [{classify: String,id: String}]
    tagsArr: Array, // [name: String],
    socialLink: Array,
    fontStyle: String,
    theme: String,
    live2d: {
      show: Boolean,
      msgs: Array,
      chats: Array,
      showModel: String
    }
  }, { collection: 'blogDatas' })/* 设定collection的名字，否则数据库会自动帮你的名字复数 */


  // 文章信息
  var articleDatas // model实例承载者！！！！！！！这个对应collectName，
  var articleDataschema = new Schema({ // 制定lessonInfo的数据规则
    blogId: { type: String, required: true },
    articleId: String,
    Summary: String, // 摘要
    publicTime: String, // 最近更新时间
    tapsArr: Array,
    postTypeValue: String,
    ReprintURL: String, // 转载或者翻译的url
    commentValue: String,
    categoryValue: Array,
    statusValue: String, // 是发布还是为草稿
    content: String,
    cover: String,
    starIdArr: Array, //收藏该文章的用户id
  }, { collection: 'articleDatas' })/* 设定collection的名字，否则数据库会自动帮你的名字复数 */

  // 父级评论信息
  var paCommentDatas // model实例承载者！！！！！！！这个对应collectName，
  var paCommentDataschema = new Schema({ // 制定lessonInfo的数据规则
    articleId: { type: String, required: true },
    commentId: String,
    content: String,
    time: String,
    userId: String,
    likes: Array,
    name: String,
    avatar: String,
    reports: Array,
    hasSon: Boolean, // 如果为true就去拉请求
    commentsSonMsg: Array
  }, { collection: 'paCommentDatas' })/* 设定collection的名字，否则数据库会自动帮你的名字复数 */


  // 子级评论信息
  var sonCommentDatas // model实例承载者！！！！！！！这个对应collectName，
  var sonCommentDataschema = new Schema({ // 制定lessonInfo的数据规则
    PaPaCommentId: { type: String, required: true },
    userId: String,
    commentId: String,
    time: String,
    content: String,
    likes: Array,
    reports: Array,
    beReply: {
      name: String,
      content: String,
      userId: String,
      commentId: String
    },
    name: String,
    avatar: String
  }, { collection: 'sonCommentDatas' })/* 设定collection的名字，否则数据库会自动帮你的名字复数 */

  // 通知信息 // 模仿youtube的通知信息 （首页logo）已读未读红点+icon+commentContent+cover+time
  var noticeDatas // model实例承载者！！！！！！！这个对应collectName，
  var noticeDataschema = new Schema({ // 制定lessonInfo的数据规则
    hasRead: { type: Boolean, required: true },
    whoDidId: String, // 该发起人
    whatReceiveId: String, // 该博主
    time: String,
    content: String, // 被操作的评论
    action: Number, // 1-点赞、2-举报、3-评论
    articleId: String, // 被操作的文章
    cover: String, // 被操作的文章图片
    new: Boolean // 是否是新增的，红点提示
  }, { collection: 'noticeDatas' })/* 设定collection的名字，否则数据库会自动帮你的名字复数 */




  try { // 防止刷新重复加载服务器导致数据库一直被改写而报的错
    userDatas = await mongoose.model('userDatas')
    blogDatas = await mongoose.model('blogDatas')
    articleDatas = await mongoose.model('articleDatas')
    paCommentDatas = await mongoose.model('paCommentDatas')
    sonCommentDatas = await mongoose.model('sonCommentDatas')
    noticeDatas = await mongoose.model('noticeDatas')
  } catch (err) {
    userDatas = await mongoose.model('userDatas', userDataschema) // 第一次渲染模型需要初始化规则
    blogDatas = await mongoose.model('blogDatas', blogDataschema) // 第一次渲染模型需要初始化规则
    articleDatas = await mongoose.model('articleDatas', articleDataschema) // 第一次渲染模型需要初始化规则
    paCommentDatas = await mongoose.model('paCommentDatas', paCommentDataschema) // 第一次渲染模型需要初始化规则
    sonCommentDatas = await mongoose.model('sonCommentDatas', sonCommentDataschema) // 第一次渲染模型需要初始化规则
    noticeDatas = await mongoose.model('noticeDatas', noticeDataschema) // 第一次渲染模型需要初始化规则
  }
  return {
    userDatas,
    blogDatas,
    articleDatas,
    paCommentDatas,
    sonCommentDatas,
    noticeDatas
  }

  /*
  数据库层面达到，批量插入数据，去重问题。
  1.设置key为unique index
  2.insertMany插入多条文档，使用{ordered:false}跳过插入错误的文档，避免插入中断
  3.最后对插入重复值抛出的异常做处理。
  */
}

// export { initSchema }
module.exports.initSchema = initSchema
// module.exports.gfs = gfs
