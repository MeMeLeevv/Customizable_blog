/* eslint-disable camelcase */
// 当前博客应该展示的信息，即保存的是非登录用户的信息，只做读取，不做修改
const state = {
  userInfo: {}, // 已存在blogId和userId
  blogSetting: {},
  blogListSetting: {
    layout: '4', // 1为单列
    align: '2',
    columns: '3',
    imgPlace: '2'
  },
  noticeArr: [],
  hasNewMsg: false
}

const mutations = {
  SETNEWMSG: (state, value) => {
    state.hasNewMsg = value
  },
  SET_NOTICEARR: (state, value) => {
    state.noticeArr = value
  },
  SET_USERINFO: (state, value) => {
    state.userInfo = value
  },
  SET_BLOGSETTING: (state, value) => {
    state.blogSetting = value
  },
  SET_BLOGlISTSETTING: (state, value) => {
    state.blogListSetting = value
  }
}

const actions = {
  setNewMsg ({ commit }, value) {
    commit('SETNEWMSG', value)
  },
  setNoticeArr ({ commit }, value) {
    commit('SET_NOTICEARR', value)
  },
  setBlogSetting ({ commit }, value) {
    commit('SET_BLOGSETTING', value)
  },
  setUserInfo ({ commit }, value) {
    commit('SET_USERINFO', value)
  },
  setBlogListSetting ({ commit }, value) {
    commit('SET_BLOGlISTSETTING', value)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
