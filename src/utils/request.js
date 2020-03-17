import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'

// create an axios instance
const service = axios.create({ // 自定义配置新建一个 axios 实例
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
  // headers: {'X-Custom-Header': 'foobar'}
})

// request interceptor 在请求或响应被 then 或 catch 处理前拦截它们。
service.interceptors.request.use(
  config => {
    // do something before request is sent // 在发送请求之前做些什么

    if (store.getters.userId) {
      // let each request carry userId
      // ['X-userId'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-userId'] = getuserId()
    }
    return config
  },
  error => {
    // do something with request error 对请求错误做些什么
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code === 201) { // 验证登录态失败，需要重新登录
      return Promise.reject(new Error(res.data.msg || 'Error'))
    } else if (res.code !== 200 && res.code !== 304) {
      Message({
        message: res.data.msg || 'Error',
        type: 'error',
        duration: 3 * 1000
      })

      // 403 Forbidden 服务器收到请求，但是拒绝提供服务。服务器通常会在响应正文中给出不提供服务的原因
      if (res.code === 403) { // 权限已过期
        // to re-login
        Message({
          message: '权限以过期，请重新登录！',
          type: 'error',
          duration: 5 * 1000,
          onClose: function () {
            store.dispatch('user/resetUserId').then(() => {
              location.assign(`${location.protocol}//${location.hostname}/error/403`) // 路由重定向到403页面
            })
          }
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      Message({
        message: res.data.msg,
        type: 'success',
        duration: 5 * 1000
      })
      console.log(res)
      return res
    }
  },

  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
