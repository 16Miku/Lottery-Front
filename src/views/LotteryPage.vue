<!-- lottery-frontend/src/views/LotteryPage.vue -->

<template>
  <div class="lottery-page">
    <h2>幸运大抽奖</h2>
    <p v-if="username" class="welcome-message">欢迎，{{ username }}！您今天还可抽奖 <span class="highlight">{{ remainingDraws }}</span> 次。</p>
    <button @click="drawLottery" :disabled="isDrawing || remainingDraws <= 0">{{ isDrawing ? '抽奖中...' : '点击抽奖' }}</button>

    <p v-if="message" :class="messageClass">{{ message }}</p>
    <p v-if="prizeDisplay" class="prize-display">{{ prizeDisplay }}</p>

    <router-link to="/records" class="action-link">查看抽奖历史</router-link>
    <router-link to="/" class="action-link">返回认证页</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // 导入 ref 和 onMounted
import { useRouter } from 'vue-router'; // 导入 useRouter

const router = useRouter(); // 获取路由器实例

const username = ref(localStorage.getItem('username') || ''); // 当前登录用户名
const userId = ref(localStorage.getItem('user_id') || null); // 当前登录用户ID
const isDrawing = ref(false); // 抽奖状态，防止重复点击
const message = ref(''); // 提示消息
const messageClass = ref(''); // 提示消息的样式类
const prizeDisplay = ref(''); // 中奖奖品显示
const remainingDraws = ref(0); // 剩余抽奖次数

// 辅助函数：获取 JWT Token
const getAuthHeader = () => {
  const token = localStorage.getItem('jwt_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// 获取用户剩余抽奖次数
const fetchRemainingDraws = async () => {
  if (!userId.value) {
    remainingDraws.value = 0;
    return;
  }
  try {
    const response = await fetch(`http://localhost:8080/lottery/user/draw-count`, { // 调用后端接口
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
    });
    const data = await response.json();

    if (response.status === 401 || response.status === 403) {
        alert('登录状态已失效，请重新登录。');
        router.push('/');
        return;
    }

    if (data.code === 200) {
      remainingDraws.value = data.data.remaining; // 更新剩余次数
      if (remainingDraws.value <= 0) {
        message.value = '您今日的抽奖次数已用完。';
        messageClass.value = 'warning';
      }
    } else {
      console.error('获取抽奖次数失败:', data.message);
      message.value = data.message || '获取抽奖次数失败。';
      messageClass.value = 'error';
      remainingDraws.value = 0;
    }
  } catch (error) {
    console.error('获取抽奖次数请求失败:', error);
    message.value = '网络错误或获取抽奖次数失败。';
    messageClass.value = 'error';
    remainingDraws.value = 0;
  }
};

// 抽奖逻辑
const drawLottery = async () => {
  if (isDrawing.value || remainingDraws.value <= 0) return;

  isDrawing.value = true;
  message.value = '抽奖中...';
  messageClass.value = 'info';
  prizeDisplay.value = '';

  try {
    const response = await fetch('http://localhost:8080/lottery/draw', {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } // 确保携带 JWT Token
    });
    const data = await response.json();

    if (response.status === 401 || response.status === 403) {
        // Token 过期或无权限
        alert('登录状态已失效，请重新登录。');
        router.push('/');
        return;
    }

    if (data.code === 200) {
      message.value = data.message;
      messageClass.value = 'success';
      prizeDisplay.value = `恭喜您获得：${data.data}`;
      remainingDraws.value--; // 抽奖成功，剩余次数减少
    } else if (data.code === 404) {
      // 未中奖
      message.value = data.message;
      messageClass.value = 'warning'; // 未中奖用警告色
      prizeDisplay.value = '';
      remainingDraws.value--; // 抽奖成功，剩余次数减少
    } else {
      // 其他业务错误，例如抽奖次数已用完
      message.value = data.message || '抽奖失败，请重试。';
      messageClass.value = 'error';
    }
  } catch (error) {
    console.error('抽奖请求失败:', error);
    message.value = '网络错误或服务器无响应。';
    messageClass.value = 'error';
  } finally {
    isDrawing.value = false;
    // 每次抽奖后，重新获取一下最新的抽奖次数（更准确的做法）
    // await fetchRemainingDraws();
  }
};

// 组件挂载时获取剩余抽奖次数
onMounted(() => {
  fetchRemainingDraws();
});
</script>

<style scoped>
.lottery-page {
  padding: 20px;
  max-width: 600px;
  margin: 50px auto;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  text-align: center;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.welcome-message {
    font-size: 1.1em;
    color: #555;
    margin-bottom: 20px;
}

.highlight {
    color: #007bff;
    font-weight: bold;
}

button {
  padding: 12px 25px;
  font-size: 1.1em;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 20px;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.info {
  color: #007bff;
  margin-top: 15px;
}

.success {
  color: #28a745;
  margin-top: 15px;
}

.warning {
    color: #ffc107;
    margin-top: 15px;
}

.error {
  color: #dc3545;
  margin-top: 15px;
}

.prize-display {
    font-size: 1.8em;
    font-weight: bold;
    color: #e44d26; /* 突出奖品 */
    margin-top: 20px;
}

.action-link {
  display: block;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
}
.action-link:hover {
  text-decoration: underline;
}
</style>
