const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  userId: state => state.user.userId,
  blogId: state => state.user.blogId,
  hasLogin: state => state.user.hasLogin,
  showLogin0Regis: state => state.app.showLogin0Regis,
  showLogin: state => state.app.showLogin,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  desc: state => state.user.desc,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
