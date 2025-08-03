// lottery-frontend/src/main.js

import { createApp } from 'vue';
import './style.css'; // 引入全局样式
import App from './App.vue';
import router from './router'; // 导入我们创建的路由器实例

// 创建 Vue 应用实例
const app = createApp(App);

// 将路由器挂载到应用实例上
app.use(router);

// 将应用实例挂载到 HTML 页面中的 #app 元素上
app.mount('#app');
