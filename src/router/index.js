import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/wind',
    children: [{
      path: 'wind',
      name: 'wind',
      component: () => import('@/views/wind/index2'),
      meta: { title: '风', icon: 'feng' }
    }]
  },
  {
    path: '/forecast',
    component: Layout,
    children: [{
      path: '',
      name: 'forecast',
      component: () => import('@/views/forecast/Forecast'),
      meta: { title: '预警', icon: 'yujing' }
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
