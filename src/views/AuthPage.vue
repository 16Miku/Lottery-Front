<!-- lottery-frontend/src/views/AuthPage.vue -->

<template>
  <div class="auth-page">
    <h2>{{ isLogin ? '用户登录' : '用户注册' }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div class="form-group">
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">{{ isLogin ? '登录' : '注册' }}</button>
    </form>

    <p class="toggle-link" @click="toggleMode">
      {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
    </p>

    <p v-if="message" :class="messageClass">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'; // 导入 ref 和 computed
import { useRouter } from 'vue-router'; // 导入 useRouter

const router = useRouter(); // 获取路由器实例

const isLogin = ref(true); // 控制显示登录或注册表单，默认为登录
const username = ref(''); // 用户名输入框绑定值
const password = ref(''); // 密码输入框绑定值
const message = ref(''); // 提示消息
const messageClass = ref(''); // 提示消息的样式类

// 计算属性，根据 isLogin 动态改变表单标题
const formTitle = computed(() => (isLogin.value ? '用户登录' : '用户注册'));

// 切换登录/注册模式
const toggleMode = () => {
  isLogin.value = !isLogin.value;
  message.value = ''; // 切换时清空消息
  username.value = ''; // 清空输入
  password.value = '';
};

// 处理表单提交
const handleSubmit = async () => {
  message.value = '处理中...';
  messageClass.value = 'info';

  const url = isLogin.value ? 'http://localhost:8080/auth/login' : 'http://localhost:8080/auth/register';
  const method = 'POST';
  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify({ username: username.value, password: password.value });

  try {
    const response = await fetch(url, { method, headers, body });
    const data = await response.json();

    if (data.code === 200) {
      message.value = data.message;
      messageClass.value = 'success';
      if (isLogin.value) {
        // 登录成功，存储 Token 并跳转
        const token = data.data.token;
        const userId = data.data.userId;
        const loggedInUsername = data.data.username; // 获取登录成功的用户名

        localStorage.setItem('jwt_token', token); // 将 Token 存储到 localStorage
        localStorage.setItem('user_id', userId); // 存储用户ID
        localStorage.setItem('username', loggedInUsername); // 存储用户名

        router.push('/lottery'); // 跳转到抽奖页面
      } else {
        // 注册成功，切换到登录模式
        toggleMode();
      }
    } else {
      message.value = data.message || '操作失败，请重试。';
      messageClass.value = 'error';
    }
  } catch (error) {
    console.error('认证请求失败:', error);
    message.value = '网络错误或服务器无响应。';
    messageClass.value = 'error';
  }
};
</script>

<style scoped>
.auth-page {
  padding: 20px;
  max-width: 400px;
  margin: 50px auto;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="password"] {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

button[type="submit"] {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

.toggle-link {
  margin-top: 15px;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

.toggle-link:hover {
  color: #0056b3;
}

.info {
  color: #007bff;
  margin-top: 15px;
}

.success {
  color: #28a745;
  margin-top: 15px;
}

.error {
  color: #dc3545;
  margin-top: 15px;
}
</style>
