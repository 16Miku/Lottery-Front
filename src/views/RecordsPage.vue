<!-- lottery-frontend/src/views/RecordsPage.vue -->

<template>
  <div class="records-page">
    <h2>我的抽奖历史</h2>

    <div v-if="records.length === 0 && !isLoading">
      <p>您还没有抽奖记录。</p>
    </div>
    <div v-else-if="isLoading">
      <p>加载中...</p>
    </div>
    <div v-else class="records-list">
      <table>
        <thead>
          <tr>
            <th>抽奖时间</th>
            <th>奖品名称</th>
            <th>结果</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id">
            <td>{{ formatDateTime(record.drawTime) }}</td>
            <td>{{ record.prizeName }}</td>
            <td :class="record.isWinning === 1 ? 'winning' : 'not-winning'">
              {{ record.isWinning === 1 ? '中奖' : '未中奖' }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </div>

    <p v-if="message" :class="messageClass">{{ message }}</p>

    <router-link to="/lottery" class="action-link">返回抽奖页面</router-link>
    <router-link to="/" class="action-link">返回认证页</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'; // 导入 ref, onMounted, watch
import { useRouter } from 'vue-router'; // 导入 useRouter

const router = useRouter();

const records = ref([]); // 抽奖记录列表
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页大小
const totalRecords = ref(0); // 总记录数
const totalPages = ref(1); // 总页数
const isLoading = ref(false); // 加载状态
const message = ref(''); // 提示消息
const messageClass = ref(''); // 提示消息的样式类

// 辅助函数：获取 JWT Token
const getAuthHeader = () => {
  const token = localStorage.getItem('jwt_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  return date.toLocaleString(); // 根据本地格式显示日期时间
};

// 获取抽奖历史记录
const fetchLotteryRecords = async () => {
  isLoading.value = true;
  message.value = '加载中...';
  messageClass.value = 'info';

  const userId = localStorage.getItem('user_id');
  if (!userId) {
    message.value = '用户ID未找到，请重新登录。';
    messageClass.value = 'error';
    isLoading.value = false;
    router.push('/'); // 重定向到登录页
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/lottery/records?pageNum=${currentPage.value}&pageSize=${pageSize.value}`, {
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
    });
    const data = await response.json();

    if (response.status === 401 || response.status === 403) {
        alert('登录状态已失效，请重新登录。');
        router.push('/');
        return;
    }

    if (data.code === 200) {
      records.value = data.data; // 绑定记录列表
      totalRecords.value = data.total; // 总记录数
      totalPages.value = data.pages; // 总页数
      message.value = '';
    } else {
      message.value = data.message || '加载记录失败。';
      messageClass.value = 'error';
      records.value = [];
    }
  } catch (error) {
    console.error('获取抽奖记录请求失败:', error);
    message.value = '网络错误或服务器无响应。';
    messageClass.value = 'error';
    records.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 分页：上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// 分页：下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// 监听 currentPage 变化，重新加载数据
watch(currentPage, () => {
  fetchLotteryRecords();
});

// 组件挂载时加载数据
onMounted(() => {
  fetchLotteryRecords();
});
</script>

<style scoped>
.records-page {
  padding: 20px;
  max-width: 800px;
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

.records-list {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.winning {
  color: #28a745; /* 绿色 */
  font-weight: bold;
}

.not-winning {
  color: #dc3545; /* 红色 */
}

.pagination button {
  padding: 8px 15px;
  margin: 0 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  background-color: #0056b3;
}

.pagination button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.pagination span {
    font-weight: bold;
    margin: 0 10px;
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
