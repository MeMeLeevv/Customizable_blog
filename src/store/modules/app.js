import Cookies from 'js-cookie'

const state = {
  showLogin0Regis: false,
  showLogin: true,
  isEditState: true,
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium'
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  SET_ISEDITSTATE: (state, isEditState) => {
    state.isEditState = isEditState
  },
  SET_SHOWLOGIN0REGIS: (state, showLogin0Regis) => {
    state.showLogin0Regis = showLogin0Regis
  },
  SET_SHOWLOGIN: (state, showLogin) => {
    state.showLogin = showLogin
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  }
}

const actions = {
  isEditState ({ commit }, isEditState) {
    commit('SET_ISEDITSTATE', isEditState)
  },
  setLogin0Regis ({ commit }, setLogin0Regis) {
    commit('SET_SHOWLOGIN0REGIS', setLogin0Regis)
  },
  setLogin ({ commit }, setLogin) {
    commit('SET_SHOWLOGIN', setLogin)
  },
  toggleSideBar ({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar ({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice ({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize ({ commit }, size) {
    commit('SET_SIZE', size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
