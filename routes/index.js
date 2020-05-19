/* 
req.query

// GET /search?q=tobi+ferret  
req.query.q  
// => "tobi ferret"  

// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse  
req.query.order  
// => "desc"  

req.query.shoe.color  
// => "blue"  

req.query.shoe.type  
// => "converse"  
req.body

// POST user[name]=tobi&user[email]=tobi@learnboost.com  
req.body.user.name  
// => "tobi"  

req.body.user.email  
// => "tobi@learnboost.com"  

// POST { "name": "tobi" }  
req.body.name  
// => "tobi"  
req.params

// GET /user/tj  
req.params.name  
// => "tj"  

// GET /file/javascripts/jquery.js  
req.params[0]  
// => "javascripts/jquery.js" 
req.param(name)

// ?name=tobi  
req.param('name')  
// => "tobi"  

// POST name=tobi  
req.param('name')  
// => "tobi"  

// /user/tobi for /user/:name   
req.param('name')  
// => "tobi"  
不难看出：

req.query： 处理 get 请求，获取 get 请求参数
req.params： 处理 /:xxx 形式的 get 或 post 请求，获取请求参数
req.body： 处理 post 请求，获取 post 请求体
req.param()： 处理 get 和 post 请求，但查找优先级由高到低为 req.params→req.body→req.query
*/
var shortid = require('shortid');
var _ = require('lodash');

module.exports = function (app, gfs, upload, dbFun) {
  // @route GET /
  // @desc Loads form
/*   var http = require('http').Server(app);
  var io = require('socket.io')(http);

  io.on('connection',(socket)=>{
    console.log('ws connect!!!!')
    socket.on('login', () => {
      socket.emit('getMsg', {
        msg: `你好朋友`,
        code: 200
      }); 
      });   
    socket.on('disconnect',()=>{
      console.log('ws disConnect!!!!')
    })
}) */

  app.post('/', (req, res) => {
    var sess = req.session;

    if (!!sess.auth) { // 以req.session.auth为标记，标记是否已经通过登录验证
      res.status(200).send({
        code: 200,
        data: {
          userId: sess.userId,// 通过验证，取出session保存的数据返回给前端
          blogId: sess.blogId,// 通过验证，取出session保存的数据返回给前端
        },
        msg: '验证登录态成功！'
      })
    } else { // 以req.session.auth为标记，标记是否已经通过登录验证
      res.status(200).send({
        code: 201,
        data: {
          data: '',// 通过验证，取出session保存的数据返回给前端
        },
        msg: '验证登录态失败，请登录或注册！'

      })
    }
  })

  // 注册,同时需要往博客表里插入新集合
  app.post('/register', (req, res) => {
    //首先先查找是否存在重复注册状况
    let findData = {
      collectName: 'userDatas',
      condition: { account: req.body.account } // 按账号去查询
    }
    let userId = shortid.generate()
    let blogId = shortid.generate()
    req.body.userId = userId
    req.body.blogId = blogId
    let insertUserData = {
      collectName: 'userDatas',
      data: [req.body] // insertMany需要Array
    }
    let insertBlogData = {
      collectName: 'blogDatas',
      data: [
        {
          bloggerId: userId,
          blogId: blogId,
          UIModuleIdArr: [], // 可以考虑加个分类所属，效率查找 [{classify: String,id: String}]
          tapsArr: [],
          socialLink: [],
          fontStyle: '',
          theme: '#bbd3f9',
          live2d: {
            show: false,
            msgs: [],
            chats: [],
            showModel: 'bilibili_1'
          }
        }
      ]
    }

    dbFun.finddbData(findData).then(ress => { //{ collectName：xxx, condition:xxx } //先查询数据
      //res.status(200).send(ress[0]._id)
      //  console.log(ress, 'app.js get data!!!!!!!!!!!!!!')
      if (ress.length === 0) { // 新用户,新博客，插入新数据，可能是多条，所以传入array
        dbFun.insertdbData([insertUserData, insertBlogData]).then(ress => { //ress范回对象数组这里还需要状态区分，如果是空对象status就需要返回其他error状态
          res.status(200).send({
            code: 200,
            data: {
              userId: userId,
              blogId: blogId,
            },
            msg: '注册成功！'

          })
          // console.log(ress, 'register get data!!!!!!!!!!!!!!')
        })
      } else { // 重复注册！
        res.status(200).send({
          code: 2,
          data: {
          },
          msg: '重复注册!请返回登陆！'

        })
        // console.log(ress, '重复注册!请返回登陆！')
      }
    })
  })

  // 登录
  app.post('/login', (req, res) => { // 在这里的请求的session每次都不一样
    //首先先查找是否有此账户，有则直接登陆
    //没有则跳转到注册页面
    var body = req.body
    let findData = {
      collectName: 'userDatas',
      condition: { account: body.account } // 按账号去查询
    }
    dbFun.finddbData(findData).then(ress => { //{ collectName：xxx, condition:xxx } //先查询数据
      // 存在此用户，检测密码
      if (ress.length === 0) {
        return res.status(200).send({
          code: 0,
          data: {
          },
          msg: '账号不存在，请注册！'

        })
      }
      if (ress[0].password === body.password) {
        req.session.regenerate(function (err) {// 重新生成新的session
          if (err) {
            return res.status(200).send({
              code: 2,
              data: {
              },
              msg: '登陆失败！请重试！'

            })
          }
          req.session.userId = ress[0].userId;
          req.session.blogId = ress[0].blogId;
          req.session.auth = true // 登录成功设置标记为true
          res.status(200).send({
            code: 200,
            data: ress[0],
            msg: '登陆成功！'
          })
        });
      } else {
        res.status(200).send({
          code: 1,
          data: {
          },
          msg: '账号或者密码错误！请重试！'

        })
      }
    })
  })

  // 获取blog信息
  app.get('/getBlogSetting', (req, res) => { // 在这里的请求的session每次都不一样
    //首先先查找是否有此账户，有则直接登陆
    //没有则跳转到注册页面
    var body = req.query // 路由是key-value形式传参； params是像router /api/:id，获取id直接params.id
    let findData = {
      collectName: 'blogDatas',
      condition: { blogId: body.blogId } // 按userId即id去查询
    }
    dbFun.finddbData(findData).then(ress => { //{ collectName：xxx, condition:xxx } //先查询数据
      // 存在此用户，检测密码
      if (ress.length === 0) {
        return res.status(200).send({
          code: 0,
          data: [],
          msg: 'blogSetting数据不存在！'

        })
      } else {
        res.status(200).send({
          code: 200,
          data: ress[0],
          msg: '获取blogSetting数据成功!'

        })
      }
    }).catch(err => {
      res.status(200).send({
        code: 0,
        data: {
          data: err,
        },
        msg: '查询blogSetting数据失败！'

      })
    })
  })

  // 更新用户数据
  app.post('/blogSetting/update', (req, res) => {

    let updateArticleData = {
      collectName: 'blogDatas',
      condition: { blogId: req.body.blogId },
      updata: req.body
    }


    dbFun.findOneAndUpdate(updateArticleData).then(ress => { //ress范回对象数组这里还需要状态区分，如果是空对象status就需要返回其他error状态
      // console.log(ress, 'ress!!!!!!!!!!!!')

      if (ress) {
        res.status(200).send({
          code: 200,
          data: ress,
          msg: '更新blogSetting成功'
        })
      } else {
        res.status(200).send({
          code: 100,
          data: ress,
          msg: '更新blogSetting失败，请重试！'
        })
      }
      // console.log(ress, 'register get data!!!!!!!!!!!!!!')
    })
  })


  // 获取登陆者信息
  app.get('/getUserInfo', (req, res) => { // 在这里的请求的session每次都不一样
    //首先先查找是否有此账户，有则直接登陆
    //没有则跳转到注册页面
    var body = req.query // 路由是key-value形式传参； params是像router /api/:id，获取id直接params.id
    let findData = {
      collectName: 'userDatas',
      condition: { userId: body.userId } // 按userId即id去查询
    }
    dbFun.finddbData(findData).then(ress => { //{ collectName：xxx, condition:xxx } //先查询数据
      // 存在此用户，检测密码
      if (ress.length === 0) {
        return res.status(200).send({
          code: 0,
          data: '',
          msg: '用户不存在，请注册！'

        })
      } else {
        res.status(200).send({
          code: 200,
          data: ress[0],
          msg: '获取用户数据成功!'

        })
      }
    }).catch(err => {
      res.status(200).send({
        code: 0,
        data: {
          data: err,
        },
        msg: '查询数据失败！'

      })
    })
  })

  // 获取登陆者信息
  app.get('/getInfoByBlogId', (req, res) => { // 在这里的请求的session每次都不一样
    //首先先查找是否有此账户，有则直接登陆
    //没有则跳转到注册页面
    var body = req.query // 路由是key-value形式传参； params是像router /api/:id，获取id直接params.id
    let findData = {
      collectName: 'userDatas',
      condition: { blogId: body.blogId } // 按userId即id去查询
    }
    dbFun.finddbData(findData).then(ress => { //{ collectName：xxx, condition:xxx } //先查询数据
      // 存在此用户，检测密码
      if (ress.length === 0) {
        return res.status(200).send({
          code: 0,
          data: '',
          msg: '用户不存在！'

        })
      } else {
        res.status(200).send({
          code: 200,
          data: ress[0],
          msg: '通过blogId获取用户数据成功!'

        })
      }
    }).catch(err => {
      res.status(200).send({
        code: 0,
        data: {
          data: err,
        },
        msg: '查询数据失败！'

      })
    })
  })

    // 更新用户数据
    app.post('/userInfo/update', (req, res) => {

      let updateArticleData = {
        collectName: 'userDatas',
        condition: { userId: req.body.userId },
        updata: req.body
      }
  
  
      dbFun.findOneAndUpdate(updateArticleData).then(ress => { //ress范回对象数组这里还需要状态区分，如果是空对象status就需要返回其他error状态
        console.log(ress, 'ress!!!!!!!!!!!!')
  
        if (ress) {
          res.status(200).send({
            code: 200,
            data: ress,
            msg: '更新用户数据成功'
          })
        } else {
          res.status(200).send({
            code: 100,
            data: ress,
            msg: '更新用户数据失败，请重试！'
          })
        }
        // console.log(ress, 'register get data!!!!!!!!!!!!!!')
      })
    })


  /* GET logout page. */
  app.post("/logout", function (req, res) {    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
    req.session.userId = null;
    req.session.blogId = null;
    req.session.auth = false
    res.status(200).send({
      code: 200,
      data: {
      },
      msg: '登出成功！'

    })
  });

  // @route POST /upload
  // @desc  Uploads file to DB
  app.post('/uploadFile', upload.single('file'), (req, res) => { // 每次只能上传一个文件
    //res.send({ file: req.file }); // 对应着name = file 来取得具体file的信息
    res.status(200).send({
      filename: res.req.file.filename,
      id: res.req.file.id
    })
    //res.redirect('/');//继续回到根目录
  });


  // 获取文章信息
  app.get('/article/list', (req, res) => { // 在这里的请求的session每次都不一样
    //首先先查找是否有此账户，有则直接登陆
    //没有则跳转到注册页面
    let findData = {
      collectName: 'articleDatas',
      condition: { blogId: req.query.blogId } // 按userId即id去查询
    }
    dbFun.finddbData(findData).then(ress => { //{ collectName：xxx, condition:xxx } //先查询数据
      // 存在此用户，检测密码
      if (ress.length === 0) {
        return res.status(200).send({
          code: 200,
          data: [],
          msg: '暂无文章数据'

        })
      } else {
        res.status(200).send({
          code: 200,
          data: ress,
          msg: '获取文章数据成功!'

        })
      }
    }).catch(err => {
      res.status(200).send({
        code: 0,
        data: {
          data: err,
        },
        msg: '查询数据失败！'

      })
    })
  })

    // 获取文章信息
    app.get('/article/detail', (req, res) => { // 在这里的请求的session每次都不一样
      //首先先查找是否有此账户，有则直接登陆
      //没有则跳转到注册页面
      let findData = {
        collectName: 'articleDatas',
        condition: { articleId: req.query.articleId } // 按userId即id去查询
      }
      dbFun.finddbData(findData).then(ress => { //{ collectName：xxx, condition:xxx } //先查询数据
        // 存在此用户，检测密码
        if (ress.length === 0) {
          return res.status(200).send({
            code: 200,
            data: [],
            msg: '暂无文章数据'
  
          })
        } else {
          res.status(200).send({
            code: 200,
            data: ress,
            msg: '获取该文章数据成功!'
  
          })
        }
      }).catch(err => {
        res.status(200).send({
          code: 0,
          data: {
            data: err,
          },
          msg: '查询数据失败！'
  
        })
      })
    })

  // 插入新的文章数据
  app.post('/article/create', (req, res) => {

    let insertArticleData = {
      collectName: 'articleDatas',
      data: [
        {
          blogId: req.body.blogId,
          articleId: shortid.generate(),
          Summary: '',
          pubilcTime: '', // 最近更新时间
          tapsArr: [],
          postTypeValue: '1',
          ReprintURL: '', // 转载或者翻译的url
          commentValue: '1',
          categoryValue: [],
          statusValue: '1', // 是发布还是为草稿
          content: '',
          starIdArr: []
        }
      ]
    }

    dbFun.insertdbData([insertArticleData]).then(ress => { //ress范回对象数组这里还需要状态区分，如果是空对象status就需要返回其他error状态
      if (Array.isArray(ress)) {
        res.status(200).send({
          code: 200,
          data: ress[0],
          msg: '创建文章成功'
        })
      } else {
        res.status(200).send({
          code: 100,
          data: ress,
          msg: '创建文章失败，请重试！'
        })
      }
      // console.log(ress, 'register get data!!!!!!!!!!!!!!')
    })
  })

  // 更新文章数据
  app.post('/article/update', (req, res) => {

    let updateArticleData = {
      collectName: 'articleDatas',
      condition: { articleId: req.body.articleId },
      updata: req.body
    }


    dbFun.findOneAndUpdate(updateArticleData).then(ress => { //ress范回对象数组这里还需要状态区分，如果是空对象status就需要返回其他error状态
      console.log(ress, 'ress!!!!!!!!!!!!')

      if (ress) {
        res.status(200).send({
          code: 200,
          data: ress,
          msg: '更新文章成功'
        })
      } else {
        res.status(200).send({
          code: 100,
          data: ress,
          msg: '更新文章失败，请重试！'
        })
      }
      // console.log(ress, 'register get data!!!!!!!!!!!!!!')
    })
  })

    // 获取通知信息
    app.get('/notice/list', (req, res) => { // 在这里的请求的session每次都不一样
      //首先先查找是否有此账户，有则直接登陆
      //没有则跳转到注册页面
      let findData = {
        collectName: 'noticeDatas',
        condition: { blogId: req.query.blogId } // 按userId即id去查询
      }
      dbFun.finddbData(findData).then(ress => { //{ collectName：xxx, condition:xxx } //先查询数据
        // 存在此用户，检测密码
        if (ress.length === 0) {
          return res.status(200).send({
            code: 200,
            data: [],
            msg: '暂无通知数据'
  
          })
        } else {
          res.status(200).send({
            code: 200,
            data: ress,
            msg: '获取通知数据成功!'
  
          })
        }
      }).catch(err => {
        res.status(200).send({
          code: 0,
          data: {
            data: err,
          },
          msg: '查询通知数据失败！'
  
        })
      })
    })
  
// 更新通知数据
app.post('/notice/update', (req, res) => {

  let updateArticleData = {
    collectName: 'noticeDatas',
    condition: { _id: req.body._id },
    updata: req.body
  }


  dbFun.findOneAndUpdate(updateArticleData).then(ress => { //ress范回对象数组这里还需要状态区分，如果是空对象status就需要返回其他error状态
    console.log(ress, 'ress!!!!!!!!!!!!')

    if (ress) {
      res.status(200).send({
        code: 200,
        data: ress,
        msg: '更新文章成功'
      })
    } else {
      res.status(200).send({
        code: 100,
        data: ress,
        msg: '更新文章失败，请重试！'
      })
    }
    // console.log(ress, 'register get data!!!!!!!!!!!!!!')
  })
})

// 插入新的通知数据
app.post('/notice/create', (req, res) => {

  let insertArticleData = {
    collectName: 'noticeDatas',
    data: [
      req.body
    ]
  }

  dbFun.insertdbData([insertArticleData]).then(ress => { //ress范回对象数组这里还需要状态区分，如果是空对象status就需要返回其他error状态
    if (Array.isArray(ress)) {
      res.status(200).send({
        code: 200,
        data: ress[0],
        msg: '创建通知成功'
      })
    } else {
      res.status(200).send({
        code: 100,
        data: ress,
        msg: '创建通知失败，请重试！'
      })
    }
    // console.log(ress, 'register get data!!!!!!!!!!!!!!')
  })
})

  
  // 获取父级评论信息
  app.get('/paComment/list', (req, res) => { // 在这里的请求的session每次都不一样
    //首先先查找是否有此账户，有则直接登陆
    //没有则跳转到注册页面
    let findData = {
      collectName: 'paCommentDatas',
      condition: { articleId: req.query.articleId } // 按userId即id去查询
    }
    dbFun.finddbData(findData).then(ress => { //{ collectName：xxx, condition:xxx } //先查询数据
      // 存在此用户，检测密码
      if (ress.length === 0) {
        return res.status(200).send({
          code: 200,
          data: [],
          msg: '暂无评论数据'

        })
      } else {
        res.status(200).send({
          code: 200,
          data: ress,
          msg: '获取评论数据成功!'

        })
      }
    }).catch(err => {
      res.status(200).send({
        code: 0,
        data: {
          data: err,
        },
        msg: '查询评论数据失败！'

      })
    })
  })

  // 获取父级评论信息
  app.get('/sonComment/list', (req, res) => { // 在这里的请求的session每次都不一样
    //首先先查找是否有此账户，有则直接登陆
    //没有则跳转到注册页面
      console.log(req.query.PaPaCommentId, 'req.query.PaPaCommentId')
      let findData = {
      collectName: 'sonCommentDatas',
      condition: { PaPaCommentId: req.query.PaPaCommentId } // 按userId即id去查询
    }
    dbFun.finddbData(findData).then(ress => { //{ collectName：xxx, condition:xxx } //先查询数据
      // 存在此用户，检测密码
      if (ress.length === 0) {
        return res.status(200).send({
          code: 200,
          data: [],
          msg: '暂无子级评论数据'

        })
      } else {
        res.status(200).send({
          code: 200,
          data: ress,
          msg: '获取子级评论数据成功!'
        })
      }
    }).catch(err => {
      res.status(200).send({
        code: 0,
        data: {
          data: err,
        },
        msg: '查询子级评论数据失败！'

      })
    })
  })

  // 插入新的父级数据
  app.post('/comment/createPa', (req, res) => {
    req.body.commentId = shortid.generate()
    let insertCommentData = {
      collectName: 'paCommentDatas',
      data: [
        req.body
      ]
    }
    console.log(req.body, 'req.body!!!!!!!!')

    dbFun.insertdbData([insertCommentData]).then(ress => { //ress范回对象数组这里还需要状态区分，如果是空对象status就需要返回其他error状态
      if (Array.isArray(ress)) {
        res.status(200).send({
          code: 200,
          data: ress[0],
          msg: '发表评论成功'
        })
      } else {
        res.status(200).send({
          code: 100,
          data: ress,
          msg: '发表评论失败，请重试！'
        })
      }
      // console.log(ress, 'register get data!!!!!!!!!!!!!!')
    })
  })

  // 插入新的子级数据
  app.post('/comment/createSon', (req, res) => {
    req.body.commentId = shortid.generate()
    let insertCommentData = {
      collectName: 'sonCommentDatas',
      data: [
        req.body
      ]
    }
    console.log(req.body, 'req.body!!!!!!!!')

    dbFun.insertdbData([insertCommentData]).then(ress => { //ress范回对象数组这里还需要状态区分，如果是空对象status就需要返回其他error状态
      if (Array.isArray(ress)) {
        res.status(200).send({
          code: 200,
          data: ress[0],
          msg: '发表评论成功'
        })
      } else {
        res.status(200).send({
          code: 100,
          data: ress,
          msg: '发表评论失败，请重试！'
        })
      }
      // console.log(ress, 'register get data!!!!!!!!!!!!!!')
    })
  })


  // 更新文章数据
  app.post('/comment/updatePa', (req, res) => {

    let updateArticleData = {
      collectName: 'paCommentDatas',
      condition: { commentId: req.body.commentId },
      updata: req.body
    }


    dbFun.findOneAndUpdate(updateArticleData).then(ress => { //ress范回对象数组这里还需要状态区分，如果是空对象status就需要返回其他error状态
      console.log(ress, 'ress!!!!!!!!!!!!')

      if (ress) {
        res.status(200).send({
          code: 200,
          data: ress,
          msg: '操作成功'
        })
      } else {
        res.status(200).send({
          code: 100,
          data: ress,
          msg: '操作失败，请重试！'
        })
      }
      // console.log(ress, 'register get data!!!!!!!!!!!!!!')
    })
  })

  // 更新子评论数据
  app.post('/comment/updateSon', (req, res) => {

    let updateArticleData = {
      collectName: 'sonCommentDatas',
      condition: { commentId: req.body.commentId },
      updata: req.body
    }


    dbFun.findOneAndUpdate(updateArticleData).then(ress => { //ress范回对象数组这里还需要状态区分，如果是空对象status就需要返回其他error状态
      console.log(ress, 'ress!!!!!!!!!!!!')

      if (ress) {
        res.status(200).send({
          code: 200,
          data: ress,
          msg: '操作成功'
        })
      } else {
        res.status(200).send({
          code: 100,
          data: ress,
          msg: '操作失败，请重试！'
        })
      }
      // console.log(ress, 'register get data!!!!!!!!!!!!!!')
    })
  })

  // @route GET /files
  // @desc  Display all files in JSON
  app.get('/videos', (req, res) => { // 访问所有文件，输入到前端界面
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }

      // Files exist
      return res.json(files);
    });
  });

  // @route GET /files/:filename
  // @desc  Display single file object
  app.get('/videos/:filename', (req, res) => { // 利用filename取得具体的文件
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // File exists
      if (file.contentType === 'video/mp4') {
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
        // return res.json(file);
      } else {
        res.status(404).json({
          err: 'Not an video'
        });
      }
    });
  });

  // @route GET /image/:filename
  // @desc Display Image
  app.get('/images/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });

  // @route DELETE /files/:id
  // @desc  Delete file
  app.delete('/videos/:id', (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }

      //res.redirect('/');
    });
  });
}
