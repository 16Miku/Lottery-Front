<!-- lottery-frontend/src/views/RecordsPage.vue -->

<template>
  <div class="records-page">
    <h2>我的抽奖历史</h2>
    <p>这里将显示用户的抽奖记录</p>
    <router-link to="/lottery">返回抽奖页面</router-link>
    <br>
    <router-link to="/">返回登录/注册</router-link>
  </div>
</template>

<script setup>
// 历史记录页面的逻辑
// 暂时留空，后续会在这里添加记录查询逻辑
</script>

<style scoped>
.records-page {
  padding: 20px;
  text-align: center;
}
a {
  display: block;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>
