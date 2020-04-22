/* eslint-disable camelcase */

const state = {
  blogListSetting: {
    layout: '4', // 1为单列
    align: '2',
    columns: '3',
    imgPlace: '2'
  }
}

const mutations = {
  SET_BLOGlISTSETTING: (state, value) => {
    state.blogListSetting = value
  }
}

const actions = {
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
