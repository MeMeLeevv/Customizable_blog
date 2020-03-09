import Vue from 'vue'
import VueRouter from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(VueRouter)

export const constantRoutes = [ // 省略了:id,记得补上
  {
    path: '/',
    name: 'Home',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'index',
        components: {
          main: () => import('@/views/index/index'),
          default: () => import('@/views/config-index/index')
        },
        meta: {
          title: 'index',
          icon: 'index'
        }
      },
      {
        path: 'Blogs',
        name: 'Blogs',
        components: {
          main: () => import('@/views/blogs/index')
        },
        meta: {
          title: 'blogs',
          icon: 'blogs'
        }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/config',
    name: 'config',
    component: Layout,
    redirect: '/:id/config/index',
    children: [
      {
        path: 'index',
        name: 'config-index',
        components: {
          default: () => import('@/views/config-index/index')
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
          default: () => import('@/views/blogs-settings/index')
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
          default: () => import('@/views/design/index')
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
          default: () => import('@/views/fonts/index')
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
          default: () => import('@/views/colors/index')
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
          default: () => import('@/views/cartoons/index')
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
          default: () => import('@/views/cursors/index')
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
          default: () => import('@/views/comments-settings/index')
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
          default: () => import('@/views/likes/index')
        },
        meta: {
          title: 'likes',
          icon: 'likes'
        }
      },
      { path: '*', redirect: '/404', hidden: true }
    ]
  }
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
