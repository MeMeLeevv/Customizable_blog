import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/comment/list',
    method: 'get',
    params: query
  })
}

export function fetchcomment (id) {
  return request({
    url: '/comment/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv (pv) {
  return request({
    url: '/comment/pv',
    method: 'get',
    params: { pv }
  })
}

export function createPacomment (data) {
  return request({
    url: '/comment/createPa',
    method: 'post',
    data
  })
}
export function createSoncomment (data) {
  return request({
    url: '/comment/createSon',
    method: 'post',
    data
  })
}

export function updatePacomment (data) {
  return request({
    url: '/comment/updatePa',
    method: 'post',
    data
  })
}

export function updateSoncomment (data) {
  return request({
    url: '/comment/updateSon',
    method: 'post',
    data
  })
}
