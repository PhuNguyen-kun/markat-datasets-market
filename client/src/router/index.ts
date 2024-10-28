import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('access_token')
//
//   if (to.name !== 'login' && !isAuthenticated) {
//     next({ name: 'login' })
//   } else if (to.name === 'login' && isAuthenticated) {
//     next({ path: '/' })
//   } else {
//     next()
//   }
// })
router.beforeEach((to, from, next) => {
  const isAuthenticated = Boolean(localStorage.getItem('access_token'))

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
