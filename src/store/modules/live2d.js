/* eslint-disable camelcase */

import bilibili_1 from '../../assets/images/bilibili_1.png'
import haruto from '../../assets/images/haruto.png'
import hibiki from '../../assets/images/hibiki.png'
import koharu from '../../assets/images/koharu.png'
import miku from '../../assets/images/miku.png'
import murakumo from '../../assets/images/murakumo.png'
import pio from '../../assets/images/pio.png'
import seifuku from '../../assets/images/seifuku.png'
import umaru from '../../assets/images/umaru.png'

const state = {
  width: 250,
  height: 400,
  msgBoxW: 100,
  msgBoxH: 200,
  left: 500,
  top: 100,
  model: 'pio',
  models: [ // 配合编辑页面的select
    { value: 'bilibili_1', src: bilibili_1 },
    { value: 'haruto', src: haruto },
    { value: 'hibiki', src: hibiki },
    { value: 'koharu', src: koharu },
    { value: 'miku', src: miku },
    { value: 'murakumo', src: murakumo },
    { value: 'pio', src: pio },
    { value: 'seifuku', src: seifuku },
    { value: 'umaru', src: umaru }], // 可用模型
  messages: [
    '等你好久啦',
    '别戳我啦',
    '再戳我不理你了！',
    '我可以移动的哦，你想把我放在哪里呢？',
    '我的天，还点',
    '宰了你哦',
    '切',
    '我可以左右移动的哦，你想把我放在哪里呢？',
    '懒得动............'
  ],
  chats: [
    '今天没吃药，感觉自己萌萌哒',
    '我允许你比眷属更长久的跟随侍奉我。《野良神》',
    '罪？那是人类们以自己的标准任意决定的。《寄生兽》',
    '小时候害怕的是鬼怪。但是现在害怕的是人。《空之境界》',
    '不要哭啊。因为，你哭的话，我也会不开心的。《名侦探柯南》',
    '他喜欢她，无关爱情。她幸福了，于是他也幸福了。《千与千寻》',
    '无聊的并不是这段时光，而是与别人相似的自己。《樱花庄的宠物女孩》',
    '我可以左右移动的哦，你想把我放在哪里呢？'
  ],
  close: false
}

const mutations = {
  SET_CLOSE: (state, close) => {
    state.close = close
  },
  SET_MODEL: (state, model) => {
    state.model = model
  },
  SET_WIDTH: (state, width) => {
    state.width = width
  },
  SET_HEIGHT: (state, height) => {
    state.height = height
  },
  SET_MSGBOXW: (state, msgBoxW) => {
    state.msgBoxW = msgBoxW
  },
  SETMSGBOXH: (state, msgBoxH) => {
    state.msgBoxH = msgBoxH
  },
  SET_LEFT: (state, left) => {
    state.left = left
  },
  SET_TOP: (state, top) => {
    state.top = top
  },
  SET_MESSAGES: (state, messages) => {
    state.messages = messages
  },
  SET_CHATS: (state, chats) => {
    state.chats = chats
  }
}

const actions = {
  setModel ({ commit }, model) {
    commit('SET_MODEL', model)
  },
  setWidth ({ commit }, width) {
    commit('SET_WIDTH', width)
  },
  setHeight ({ commit }, height) {
    commit('SET_HEIGHT', height)
  },
  setMsgBoxW ({ commit }, msgBoxW) {
    commit('SET_MSGBOXW', msgBoxW)
  },
  setMsgBoxH ({ commit }, msgBoxH) {
    commit('SETMSGBOXH', msgBoxH)
  },
  setLeft ({ commit }, left) {
    commit('SET_LEFT', left)
  },
  setTop ({ commit }, top) {
    commit('SET_TOP', top)
  },
  setMessages ({ commit }, messages) {
    commit('SET_MESSAGES', messages)
  },
  setChats ({ commit }, chats) {
    commit('SET_CHATS', chats)
  },
  setClose ({ commit }, close) {
    commit('SET_CLOSE', close)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
