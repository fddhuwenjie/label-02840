<template>
  <!-- 404页面 -->
  <div class="not-found-page">
    <van-nav-bar title="页面不存在" left-arrow @click-left="goBack" />
    <van-empty image="error" description="页面不存在">
      <van-button type="success" round @click="goHome">返回首页</van-button>
    </van-empty>
  </div>
</template>

<script setup>
/**
 * 404页面组件
 * 当访问不存在的路由时显示
 */
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回上一页
const goBack = () => {
  router.back()
}

// 返回首页
const goHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.not-found-page {
  min-height: 100vh;
  background: #f5f5f5;
  
  .van-empty {
    padding-top: 100px;
  }
}
</style>
