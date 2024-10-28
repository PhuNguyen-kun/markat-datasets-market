import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Auth/LoginView.vue'),
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/components/User/Layout/Layout.vue'),
    redirect: '/user/home',
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('../views/User/HomeView.vue'),
      },
      {
        path: '/datasets',
        name: 'datasets',
        component: () => import('../views/User/Datasets.vue'),
      },
      {
        path: '/new-dataset',
        name: 'new-dataset',
        component: () => import('../views/User/NewDataset.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/project',
        name: 'project',
        component: () => import('../views/User/Project.vue'),
      },
      {
        path: '/report',
        name: 'report',
        component: () => import('../views/User/Report.vue'),
      },
      {
        path: '/help',
        name: 'help',
        component: () => import('../views/User/Help.vue'),
      },
    ],
  },
]

export default routes
