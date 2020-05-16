import request from '@/utils/request'

export function getBlogSetting (blogId) {
  return request({
    url: '/getBlogSetting',
    method: 'get',
    params: { blogId }
  })
}

export function getInfoByBlogId (blogId) {
  return request({
    url: '/getInfoByBlogId',
    method: 'get',
    params: { blogId }
  })
}

export function login (data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
