/* eslint-disable camelcase */
// 当前博客应该展示的信息，即保存的是非登录用户的信息，只做读取，不做修改
const state = {
  userInfo: {}, // 已存在blogId和userId
  blogSetting: {
    theme: '#bbd3f9',
    blogListSetting: {
    }
  },
  noticeArr: [],
  hasNewMsg: false,
  fullPage: false,
  scrollTop: 0,
  blogWasFresh: false,
  showHeadlines: false
}

const mutations = {
  SET_HEADLINES: (state, value) => {
    state.showHeadlines = value
  },
  SET_BLOGWASFRESH: (state, value) => {
    state.blogWasFresh = value
  },
  SET_SCROLLTOP: (state, value) => {
    state.scrollTop = value
  },
  SETFULLPAGE: (state, value) => {
    state.fullPage = value
  },
  SETTHEME: (state, value) => {
    state.blogSetting.theme = value
  },
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
    state.blogSetting.blogListSetting = value
  }
}

const actions = {
  setHeadlines ({ commit }, value) {
    commit('SET_HEADLINES', value)
  },
  setBlogFresh ({ commit }, value) {
    commit('SET_BLOGWASFRESH', value)
  },
  setScrollTop ({ commit }, value) {
    commit('SET_SCROLLTOP', value)
  },
  setFullPage ({ commit }, value) {
    commit('SETFULLPAGE', value)
  },
  setTheme ({ commit }, value) {
    commit('SETTHEME', value)
  },
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
