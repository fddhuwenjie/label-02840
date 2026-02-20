<template>
  <!-- 个人中心页面 - 高端时尚版 -->
  <div class="profile-page">
    <!-- 用户信息头部 -->
    <header class="profile-header" :class="{ 'logged-in': userStore.isLoggedIn }">
      <div class="header-bg"></div>
      <div class="user-info" @click="handleUserClick">
        <div class="avatar-wrapper">
          <div class="avatar">
            <van-icon v-if="!userStore.isLoggedIn" name="user-o" size="28" />
            <span v-else class="avatar-text">{{ userStore.username.charAt(0).toUpperCase() }}</span>
          </div>
        </div>
        <div class="user-detail">
          <h2 class="username font-display">
            {{ userStore.isLoggedIn ? userStore.username : '登录 / 注册' }}
          </h2>
          <p class="user-desc">
            {{ userStore.isLoggedIn ? '欢迎回来，尊贵的会员' : '登录享受专属优惠' }}
          </p>
        </div>
        <van-icon name="arrow" class="arrow-icon" />
      </div>
    </header>
    
    <!-- 订单入口 -->
    <section class="order-section">
      <div class="section-header">
        <h3 class="section-title">我的订单</h3>
        <button class="view-all" @click="goToOrderList">
          全部订单 <van-icon name="arrow" />
        </button>
      </div>
      <div class="order-grid">
        <div class="order-item" @click="goToOrderList('pending')">
          <div class="order-icon">📋</div>
          <span class="order-text">待付款</span>
        </div>
        <div class="order-item" @click="goToOrderList('shipped')">
          <div class="order-icon">🚚</div>
          <span class="order-text">待收货</span>
        </div>
        <div class="order-item" @click="goToOrderList('completed')">
          <div class="order-icon">✅</div>
          <span class="order-text">已完成</span>
        </div>
        <div class="order-item" @click="showDeveloping">
          <div class="order-icon">↩️</div>
          <span class="order-text">退换货</span>
        </div>
      </div>
    </section>
    
    <!-- 功能菜单 -->
    <section class="menu-section">
      <div class="menu-group">
        <div class="menu-item" @click="goToAddress">
          <div class="menu-icon">📍</div>
          <span class="menu-text">收货地址</span>
          <van-icon name="arrow" class="menu-arrow" />
        </div>
      </div>
      
      <div class="menu-group">
        <div class="menu-item" @click="showHelpModal = true">
          <div class="menu-icon">💬</div>
          <span class="menu-text">帮助中心</span>
          <van-icon name="arrow" class="menu-arrow" />
        </div>
        <div class="menu-item" @click="callService">
          <div class="menu-icon">📞</div>
          <span class="menu-text">联系客服</span>
          <van-icon name="arrow" class="menu-arrow" />
        </div>
        <div class="menu-item" @click="showAboutModal = true">
          <div class="menu-icon">ℹ️</div>
          <span class="menu-text">关于我们</span>
          <van-icon name="arrow" class="menu-arrow" />
        </div>
      </div>
    </section>
    
    <!-- 退出登录 -->
    <section class="logout-section" v-if="userStore.isLoggedIn">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </section>
    
    <!-- 帮助中心弹窗 -->
    <van-popup v-model:show="showHelpModal" round position="bottom" :style="{ maxHeight: '70%' }">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">帮助中心</h3>
          <van-icon name="cross" @click="showHelpModal = false" />
        </div>
        <div class="modal-body">
          <div class="faq-item">
            <h4 class="faq-question">如何下单？</h4>
            <p class="faq-answer">选择商品加入购物袋，确认收货地址后提交订单即可。</p>
          </div>
          <div class="faq-item">
            <h4 class="faq-question">配送时间？</h4>
            <p class="faq-answer">我们承诺30分钟内送达，超时可申请补偿。</p>
          </div>
          <div class="faq-item">
            <h4 class="faq-question">如何退换货？</h4>
            <p class="faq-answer">收货后7天内如有质量问题，可在订单中申请退换货。</p>
          </div>
          <div class="faq-item">
            <h4 class="faq-question">支付方式？</h4>
            <p class="faq-answer">支持微信支付、支付宝、银行卡等多种支付方式。</p>
          </div>
          <div class="faq-item">
            <h4 class="faq-question">如何联系客服？</h4>
            <p class="faq-answer">您可以拨打客服热线 400-888-8888，服务时间 8:00-22:00。</p>
          </div>
        </div>
      </div>
    </van-popup>
    
    <!-- 关于我们弹窗 -->
    <van-popup v-model:show="showAboutModal" round position="bottom" :style="{ maxHeight: '70%' }">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">关于我们</h3>
          <van-icon name="cross" @click="showAboutModal = false" />
        </div>
        <div class="modal-body about-body">
          <div class="about-logo">🌿</div>
          <h2 class="about-brand font-display">FRESH</h2>
          <p class="about-slogan">源自自然的馈赠</p>
          <p class="about-desc">
            FRESH 致力于为您提供最新鲜、最优质的生鲜食材。我们精选全球优质产地，
            严格把控每一道品质关卡，采用全程冷链配送，只为将最健康的食材送到您的餐桌。
          </p>
          <div class="about-info">
            <p>版本：v1.0.0</p>
            <p>客服热线：400-888-8888</p>
            <p>服务时间：8:00 - 22:00</p>
          </div>
          <p class="about-copyright">© 2024 FRESH. All rights reserved.</p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const showHelpModal = ref(false)
const showAboutModal = ref(false)

const handleUserClick = () => {
  if (!userStore.isLoggedIn) router.push('/login')
}

const goToOrderList = (status) => {
  if (!userStore.isLoggedIn) { router.push('/login'); return }
  router.push(`/order-list${status ? `?status=${status}` : ''}`)
}

const goToAddress = () => {
  if (!userStore.isLoggedIn) { router.push('/login'); return }
  router.push('/address')
}

const callService = () => {
  showConfirmDialog({
    title: '联系客服',
    message: '确定拨打客服电话 400-888-8888？',
    confirmButtonColor: '#1a1a1a'
  }).then(() => {
    window.location.href = 'tel:400-888-8888'
  }).catch(() => {})
}

const showDeveloping = () => {
  showToast('功能正在开发中')
}

const handleLogout = async () => {
  try {
    await showConfirmDialog({ 
      title: '提示', 
      message: '确定要退出登录吗？',
      confirmButtonColor: '#1a1a1a'
    })
    userStore.logout()
    showToast('已退出登录')
  } catch {}
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding-bottom: 80px;
}

.profile-header {
  position: relative;
  padding: 60px 24px 40px;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  
  .logged-in & {
    background: linear-gradient(135deg, #1a1a1a 0%, #374151 100%);
  }
}

.user-info {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.avatar-text {
  font-size: 28px;
  font-weight: 600;
}

.user-detail { flex: 1; }

.username {
  font-size: 22px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 4px;
}

.user-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.arrow-icon { color: rgba(255, 255, 255, 0.5); }

.order-section {
  margin: -20px 16px 16px;
  padding: 24px;
  background: var(--bg-primary);
  border-radius: 20px;
  position: relative;
  box-shadow: var(--shadow-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.view-all {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
}

.order-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.order-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 8px;
  background: var(--bg-secondary);
  border-radius: 16px;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:active { transform: scale(0.96); background: var(--bg-tertiary); }
}

.order-icon { font-size: 24px; }
.order-text { font-size: 11px; color: var(--text-secondary); }

.menu-section { padding: 0 16px; }

.menu-group {
  background: var(--bg-primary);
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:not(:last-child) { border-bottom: 1px solid var(--border-light); }
  &:active { background: var(--bg-secondary); }
}

.menu-icon { font-size: 20px; }
.menu-text { flex: 1; font-size: 14px; color: var(--text-primary); }
.menu-badge {
  padding: 2px 10px;
  background: var(--accent-color);
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  border-radius: 12px;
}
.menu-arrow { color: var(--text-muted); font-size: 12px; }

.logout-section { padding: 24px 16px; }

.logout-btn {
  width: 100%;
  padding: 16px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.05em;
  border: 1px solid var(--text-primary);
  border-radius: 30px;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    background: var(--text-primary);
    color: var(--bg-primary);
  }
  
  &:active { 
    background: var(--primary-dark);
    color: #fff;
    transform: scale(0.98);
  }
}

// 弹窗样式
.modal-content {
  padding-bottom: env(safe-area-inset-bottom);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-light);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-body {
  padding: 20px;
}

// 帮助中心
.faq-item {
  padding: 16px 0;
  border-bottom: 1px solid var(--border-light);
  
  &:last-child { border-bottom: none; }
}

.faq-question {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.faq-answer {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

// 关于我们
.about-body {
  text-align: center;
  padding: 32px 24px;
}

.about-logo {
  font-size: 48px;
  margin-bottom: 12px;
}

.about-brand {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.about-slogan {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.about-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
  text-align: left;
  margin-bottom: 24px;
}

.about-info {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 12px;
  margin-bottom: 20px;
  
  p {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 6px 0;
  }
}

.about-copyright {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
