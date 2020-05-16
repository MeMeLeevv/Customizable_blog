import request from '@/utils/request'

export function firstShow (data) {
  return request({
    url: '/',
    method: 'post',
    data
  })
}

export function register (data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}

export function login (data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo (userId) {
  return request({
    url: '/getUserInfo',
    method: 'get',
    params: { userId }
  })
}

export function getInfoByBlogId (blogId) {
  return request({
    url: '/getInfoByBlogId',
    method: 'get',
    params: { blogId }
  })
}

export function logout () {
  return request({
    url: '/logout',
    method: 'post'
  })
}
