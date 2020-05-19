import { firstShow, login, logout, getInfo, register } from '@/api/user'
import router, { resetRouter } from '@/router'

const state = {
  hasLogin: false,
  userId: '',
  blogId: '',
  name: '',
  avatar: '',
  desc: '',
  isBlogger: false,
  configNow: false // 当前用户是否处于config页面
}

const mutations = {
  SET_CONFIGNOW: (state, configNow) => {
    state.configNow = configNow
  },
  SET_BLOGGER: (state, isBlogger) => {
    state.isBlogger = isBlogger
  },
  SET_HASLOGIN: (state, hasLogin) => {
    state.hasLogin = hasLogin
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_BLOGID: (state, blogId) => {
    state.blogId = blogId
  },
  SET_DESC: (state, desc) => {
    state.desc = desc
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  setConfigNow ({ commit }, value) {
    commit('SET_CONFIGNOW', value)
  },
  setAvatar ({ commit }, value) {
    commit('SET_AVATAR', value)
  },
  setDesc ({ commit }, value) {
    commit('SET_DESC', value)
  },
  setName ({ commit }, value) {
    commit('SET_NAME', value)
  },
  setBlogger ({ commit }, value) {
    commit('SET_BLOGGER', value)
  },
  // the first time user get into this websize
  firstShow ({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      firstShow().then(response => {
        const { data } = response //
        commit('SET_HASLOGIN', true)
        commit('SET_USERID', data.userId)
        commit('SET_BLOGID', data.blogId)
        dispatch('getInfo')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user register
  register ({ commit }, userInfo) {
    const { name, account, password, desc, avatar } = userInfo
    return new Promise((resolve, reject) => {
      register({ name: name, account: account, password: password, desc: desc, avatar: avatar }).then(response => {
        const { data } = response
        console.log(response, 'response')
        commit('SET_HASLOGIN', true)
        commit('SET_USERID', data.userId)
        commit('SET_BLOGID', data.blogId)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_DESC', desc)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user login
  login ({ commit }, userInfo) {
    const { account, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ account: account, password: password }).then(response => {
        const { data } = response
        commit('SET_HASLOGIN', true)
        commit('SET_USERID', data.userId)
        commit('SET_BLOGID', data.blogId)
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        commit('SET_DESC', data.desc)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log(state.userId, 'state.userId')
      getInfo(state.userId).then(response => {
        const { data } = response

        if (!data) {
          reject(new Error('Verification failed, please Login again.'))
        }

        const { name, avatar, desc } = data
        console.log(name, 'name')
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_DESC', desc)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout ({ commit, state, dispatch }) {
    // const blogId = state.blogId
    return new Promise((resolve, reject) => {
      logout(state.userId).then((res) => {
        commit('SET_HASLOGIN', false)
        commit('SET_USERID', '')
        commit('SET_BLOGID', '')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('SET_DESC', '')
        resetRouter()
        console.log(router.currentRoute.path, 'router')

        if (router.currentRoute.path.indexOf('config') !== -1) { // 如果在编辑状态下退出登陆，则默认返回自己的博客首页
          router.push('/')
          // router.push(`/${blogId}`)
        }
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove userId
  resetuserId ({ commit }) {
    return new Promise(resolve => {
      commit('SET_HASLOGIN', false)
      commit('SET_USERID', '')
      commit('SET_BLOGID', '')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
