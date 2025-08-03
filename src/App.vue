<!-- lottery-frontend/src/App.vue -->

<template>
  <div id="app">
    <header class="app-header">
      <nav>
        <router-link to="/">首页/认证</router-link>
        <router-link to="/lottery">抽奖</router-link>
        <router-link to="/records">历史</router-link>
        <span v-if="loggedInUsername" class="user-info">
          欢迎, {{ loggedInUsername }}!
          <button @click="logout" class="logout-btn">退出</button>
        </span>
      </nav>
    </header>
    <main class="app-main">
      <!-- 路由视图，根据当前 URL 渲染对应的组件 -->
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'; // 导入 ref 和 watchEffect
import { useRouter } from 'vue-router'; // 导入 useRouter

const router = useRouter();
const loggedInUsername = ref(localStorage.getItem('username') || ''); // 从 localStorage 获取用户名

// 监听 localStorage 中的 username 变化，实时更新显示
watchEffect(() => {
  loggedInUsername.value = localStorage.getItem('username') || '';
});

// 退出登录
const logout = () => {
  localStorage.removeItem('jwt_token'); // 移除 Token
  localStorage.removeItem('user_id'); // 移除用户ID
  localStorage.removeItem('username'); // 移除用户名
  loggedInUsername.value = ''; // 清空显示
  router.push('/'); // 跳转回认证页面
  alert('您已退出登录。');
};
</script>

<style>
/* 全局样式可以放在这里，或者 style.css 中 */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; 移除或调整，因为有了 header */
}

.app-header {
  background-color: #333;
  padding: 15px 0;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.app-header nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center; /* 垂直居中 */
}

.app-header a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.app-header a:hover,
.app-header a.router-link-active {
  background-color: #555;
}

.user-info {
  margin-left: 20px;
  font-weight: bold;
  color: #4CAF50; /* 欢迎信息颜色 */
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #c82333;
}

.app-main {
  padding: 20px;
  margin-top: 20px; /* 给主内容区域留出上边距，避免被 header 遮挡 */
}
</style>
