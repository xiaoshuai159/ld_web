/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const taskManageRouter = [
  {
    path: '/taskManage',
    component: Layout,
    redirect: '/taskManage/bugScript',
    name: 'taskManagePage',
    meta: {
      title: '漏洞资产发现',
      icon: 'MessageBox',
    },
    children: [
      // {
      //   path: '/taskManage/taskConfig',
      //   component: () => import('@/views/taskManage/taskConfig.vue'),
      //   name: 'taskConfig',
      //   meta: { title: '漏洞资产发现', icon: 'Wallet', keepAlive: true },
      // },
      {
        path: '/taskManage/taskConfig',
        component: () => import('@/views/taskManage/taskConfig.vue'),
        name: 'taskConfig',
        meta: { title: '主动探测', icon: 'Aim', keepAlive: true },
      },
      {
        path: '/taskManage/searchConfig',
        component: () => import('@/views/taskManage/searchConfig.vue'),
        name: 'searchConfig',
        meta: { title: '关联入库', icon: 'Connection', keepAlive: true },
      },
    ],
  },
]

export default taskManageRouter
