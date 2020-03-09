import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
/* console.log(req, 'req')
ƒ webpackContext(req) {
  var id = webpackContextResolve(req);
  return __webpack_require__(id);
}
console.log(req.keys(), 'req.keys()')
(20) ["./icon-注册头像.svg", "./text.svg", "./个人信息.svg", "./主页.svg", "./减号.svg", "./删除.svg", "./加.svg", "./手机.svg", "./搜索.svg", "./注册.svg", "./添加.svg", "./登录.svg", "./登录页-删除.svg", "./空中花园.svg", "./笔.svg", "./箭头 (1).svg", "./箭头.svg", "./编辑.svg", "./设置.svg", "./评论.svg"] "req.keys()"
*/
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
