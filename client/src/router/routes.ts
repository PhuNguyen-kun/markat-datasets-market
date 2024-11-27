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
        component: () => import('../views/User/Datasets/Datasets.vue'),
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
        component: () => import('../views/User//Project.vue'),
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
      // Dropdown action
      {
        path: '/your-work',
        name: 'your-work',
        component: () => import('../views/User/YourWork/YourWork.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/your-work-detail',
        name: 'your-work-detail',
        component: () => import('../views/User/YourWork/YourWorkDetail.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/labeling',
        name: 'labeling',
        component: () => import('../views/User/Labeling/Labeling.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/labeling-detail',
        name: 'labeling-detail',
        component: () => import('../views/User/Labeling/LabelingDetail.vue'),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: '/datasets/:slug',
        name: 'dataset-detail',
        component: () => import('../views/User/Datasets/DatasetDetail.vue'),
      },
    ],
  },
]

export default routes
