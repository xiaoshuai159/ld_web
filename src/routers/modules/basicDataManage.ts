/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const basicDataManageRouter = [
  {
    path: '/basicDataManage',
    component: Layout,
    redirect: '/basicDataManage/propertyFeature',
    name: 'basicDataManage',
    meta: {
      title: '基础数据管理',
      icon: 'Refrigerator',
    },
    children: [
      {
        path: '/basicDataManage/propertyFeature',
        component: () => import('@/views/basicDataManage/propertyFeature.vue'),
        name: 'propertyFeature',
        meta: { title: '应用资产特征管理', keepAlive: true, icon: 'Coin' },
      },
      {
        path: '/basicDataManage/property',
        component: () => import('@/views/basicDataManage/property.vue'),
        name: 'property',
        meta: { title: '应用资产管理', keepAlive: true, icon: 'CreditCard' },
      },
      {
        path: '/basicDataManage/bugFeature',
        component: () => import('@/views/basicDataManage/bugFeature.vue'),
        name: 'bugFeature',
        meta: { title: '漏洞攻击特征管理', keepAlive: true, icon: 'Film' },
      },
      {
        path: '/taskManage/bugScript',
        component: () => import('@/views/taskManage/bugScript.vue'),
        name: 'bugScript',
        meta: { title: '漏洞探测脚本管理', icon: 'Cpu', keepAlive: true },
      },
    ],
  },
]

export default basicDataManageRouter
