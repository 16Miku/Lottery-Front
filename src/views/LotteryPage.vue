<!-- lottery-frontend/src/views/LotteryPage.vue -->

<template>
  <div class="lottery-page">
    <h2>幸运大抽奖</h2>
    <p>这里将是抽奖按钮和结果显示</p>
    <router-link to="/records">查看抽奖历史</router-link>
    <br>
    <router-link to="/">返回登录/注册</router-link>
  </div>
</template>

<script setup>
// 抽奖页面的逻辑
// 暂时留空，后续会在这里添加抽奖逻辑
</script>

<style scoped>
.lottery-page {
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
