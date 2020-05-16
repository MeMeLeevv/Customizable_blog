import Vue from 'vue'
import VueRouter from 'vue-router'
/* Layout */
import Layout from '@/layout'
// import store from '@/store'
// import { Message } from 'element-ui'

Vue.use(VueRouter)

export const constantRoutes = [ // 省略了:id,记得补上
  {
    path: '/',
    name: 'Home',
    component: Layout,
    redirect: '/:blogId',
    children: [
      {
        path: '/:blogId',
        name: 'index',
        components: {
          main: () => import('@/views/index/index'),
          default: () => import('@/views/config/index')
        },
        meta: {
          title: 'index',
          icon: 'index'
        }
      },
      {
        path: '/:blogId/articles/:articleId',
        name: 'Blogs',
        components: {
          main: () => import('@/views/detailBlogs/index'),
          default: () => import('@/views/config/index')
        },
        meta: {
          title: 'blogs',
          icon: 'blogs'
        }
      }
    ]
  },
  {
    path: '/error',
    name: 'error',
    component: Layout,
    redirect: '/error/404',
    children: [
      {
        path: '404',
        name: 'error_404',
        components: {
          main: () => import('@/views/error-page/error_404/index')
        },
        meta: {
          title: 'error_404',
          icon: 'error_404'
        }
      },
      {
        path: '403',
        name: 'error_403',
        components: {
          main: () => import('@/views/error-page/error_403/index')
        },
        meta: {
          title: 'error_403',
          icon: 'error_403'
        }
      }
    ]
  }
]

// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRoutes = [ // 此时是登录状态。所以blogId是肯定会有的
  {
    path: '/:blogId/config',
    name: 'config',
    component: Layout,
    redirect: '/:blogId/config/index',
    /* beforeEnter: (to, from, next) => {
      // ...
      if (!store.state.user.hasLogin) {
        Message({
          message: '您暂没有权限访问此页面，请登录！！', // 后台则提示登录已过期，请重新登录
          type: 'error',
          duration: 5 * 1000
        })
        next(false)
      } else {
        next()
      }
    }, */
    children: [
      {
        path: 'index',
        name: 'config-index',
        components: {
          default: () => import('@/views/config/index'),
          main: () => import('@/views/index/index')
        },
        meta: {
          title: 'config-index',
          icon: 'config-index'
        }
      },
      {
        path: 'BlogsSettings',
        name: 'blogs-settings',
        components: {
          default: () => import('@/views/config/blogs-settings/index'),
          main: () => import('@/views/index/index')
        },
        meta: {
          title: 'blogs-settings',
          icon: 'blogs-settings'
        }
      },
      {
        path: 'Design',
        name: 'Design',
        components: {
          default: () => import('@/views/config/design/index'),
          main: () => import('@/views/index/index')
        },
        meta: {
          title: 'design',
          icon: 'design'
        }
      },
      {
        path: 'Design/Fonts',
        name: 'Fonts',
        components: {
          default: () => import('@/views/config/design/fonts/index'),
          main: () => import('@/views/index/index')
        },
        meta: {
          title: 'fonts',
          icon: 'fonts'
        }
      },
      {
        path: 'Design/Colors',
        name: 'Colors',
        components: {
          default: () => import('@/views/config/design/colors/index'),
          main: () => import('@/views/index/index')
        },
        meta: {
          title: 'colors',
          icon: 'colors'
        }
      },
      {
        path: 'Design/Cartoons',
        name: 'Cartoons',
        components: {
          default: () => import('@/views/config/design/cartoons/index'),
          main: () => import('@/views/index/index')
        },
        meta: {
          title: 'cartoons',
          icon: 'cartoons'
        }
      },
      {
        path: 'Design/Cursors',
        name: 'Cursors',
        components: {
          default: () => import('@/views/config/design/cursors/index'),
          main: () => import('@/views/index/index')
        },
        meta: {
          title: 'cursors',
          icon: 'cursors'
        }
      },
      {
        path: 'CommentsSettings',
        name: 'CommentsSettings',
        components: {
          default: () => import('@/views/config/comments-settings/index'),
          main: () => import('@/views/index/index')
        },
        meta: {
          title: 'comments',
          icon: 'CommentsSettings'
        }
      },
      {
        path: 'Likes',
        name: 'Likes',
        components: {
          default: () => import('@/views/config/likes/index'),
          main: () => import('@/views/index/index')
        },
        meta: {
          title: 'likes',
          icon: 'likes'
        }
      }
    ]
  },
  { path: '*', redirect: '/error/404' }
]

const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
