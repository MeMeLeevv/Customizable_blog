import request from '@/utils/request'

export function fetchList (blogId) {
  return request({
    url: '/notice/list',
    method: 'get',
    params: { blogId }
  })
}

export function createNotice (data) {
  return request({
    url: '/notice/create',
    method: 'post',
    data
  })
}

export function updateNotice (data) {
  return request({
    url: '/notice/update',
    method: 'post',
    data
  })
}
