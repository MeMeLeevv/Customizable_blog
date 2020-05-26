import request from '@/utils/request'

/* export function fetchPaList (query) {
  return request({
    url: '/getPaComment',
    method: 'get',
    params: query
  })
}

export function fetchSonList (query) {
  return request({
    url: '/getSonComment',
    method: 'get',
    params: query
  })
} */

export function fetchPacomment (query) {
  return request({
    url: '/paComment/list',
    method: 'get',
    params: query
  })
}

export function fetchSoncomment (query) {
  return request({
    url: '/sonComment/list',
    method: 'get',
    params: query
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
