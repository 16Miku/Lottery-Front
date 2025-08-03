// lottery-frontend/src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';

// 导入基础页面组件 (这些组件将在下一步创建)
import AuthPage from '../views/AuthPage.vue';
import LotteryPage from '../views/LotteryPage.vue';
import RecordsPage from '../views/RecordsPage.vue';

// 定义路由数组
const routes = [
  {
    path: '/', // 根路径
    name: 'Auth', // 路由名称
    component: AuthPage // 对应的组件
  },
  {
    path: '/lottery', // 抽奖页面路径
    name: 'Lottery',
    component: LotteryPage,
    meta: { requiresAuth: true } // 元信息：标记此路由需要认证
  },
  {
    path: '/records', // 历史记录页面路径
    name: 'Records',
    component: RecordsPage,
    meta: { requiresAuth: true } // 元信息：标记此路由需要认证
  },
  // 可以添加一个通配符路由来处理未匹配的路径（404页面）
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/' // 未匹配的路径重定向到认证页
  }
];

// 创建路由器实例
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式（推荐）
  routes // 路由配置
});


// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查路由的 meta 字段是否需要认证
  if (to.meta.requiresAuth) {
    // 检查 localStorage 中是否存在 JWT Token
    const token = localStorage.getItem('jwt_token');
    if (token) {
      // 如果 Token 存在，则允许访问
      next();
    } else {
      // 如果 Token 不存在，则重定向到登录/注册页
      alert('请先登录才能访问此页面！'); // 简单提示
      next({ name: 'Auth' }); // 重定向到 Auth 页面
    }
  } else {
    // 对于不需要认证的路由，直接放行
    next();
  }
});



// 导出路由器实例
export default router;
