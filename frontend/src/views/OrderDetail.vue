<template>
  <!-- 订单详情页面 -->
  <div class="order-detail-page" v-if="order">
    <!-- 顶部导航 -->
    <header class="detail-header">
      <button class="back-btn" @click="goBack">
        <van-icon name="arrow-left" size="20" />
      </button>
      <h1 class="page-title">订单详情</h1>
      <div class="placeholder"></div>
    </header>
    
    <!-- 订单状态 -->
    <section class="status-section" :class="order.status">
      <div class="status-icon">
        <span v-if="order.status === 'pending'">💳</span>
        <span v-else-if="order.status === 'shipped'">🚚</span>
        <span v-else>✅</span>
      </div>
      <div class="status-info">
        <h2 class="status-text">{{ getStatusText(order.status) }}</h2>
        <p class="status-desc">{{ getStatusDesc(order.status) }}</p>
      </div>
    </section>
    
    <!-- 收货地址 -->
    <section class="address-section">
      <div class="address-icon">📍</div>
      <div class="address-content">
        <div class="address-contact">
          <span class="contact-name">{{ order.address.name }}</span>
          <span class="contact-phone">{{ order.address.phone }}</span>
        </div>
        <p class="address-detail">{{ order.address.detail }}</p>
      </div>
    </section>
    
    <!-- 商品列表 -->
    <section class="goods-section">
      <div class="section-header">
        <h3 class="section-title">商品清单</h3>
        <span class="goods-count">共 {{ order.totalCount }} 件</span>
      </div>
      <div class="goods-list">
        <div 
          v-for="item in order.items" 
          :key="item.id"
          class="goods-item"
        >
          <img :src="item.image" :alt="item.name" class="goods-image" />
          <div class="goods-info">
            <h4 class="goods-name">{{ item.name }}</h4>
            <p class="goods-spec">{{ item.unit }}</p>
            <div class="goods-footer">
              <span class="goods-price">¥{{ item.price }}</span>
              <span class="goods-quantity">×{{ item.quantity }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 订单信息 -->
    <section class="info-section">
      <div class="info-item">
        <span class="info-label">订单编号</span>
        <span class="info-value">{{ order.id }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">下单时间</span>
        <span class="info-value">{{ order.createTime }}</span>
      </div>
      <div class="info-item" v-if="order.remark">
        <span class="info-label">订单备注</span>
        <span class="info-value">{{ order.remark }}</span>
      </div>
    </section>
    
    <!-- 金额明细 -->
    <section class="amount-section">
      <div class="amount-item">
        <span class="amount-label">商品金额</span>
        <span class="amount-value">¥{{ order.totalPrice.toFixed(2) }}</span>
      </div>
      <div class="amount-item total">
        <span class="amount-label">实付金额</span>
        <span class="amount-value">¥{{ order.totalPrice.toFixed(2) }}</span>
      </div>
    </section>
    
    <!-- 底部操作 -->
    <footer class="detail-footer" v-if="order.status !== 'completed'">
      <van-button v-if="order.status === 'pending'" type="danger" round block @click="handlePay">
        立即付款
      </van-button>
      <van-button v-if="order.status === 'shipped'" type="success" round block @click="handleConfirm">
        确认收货
      </van-button>
    </footer>
  </div>
  
  <!-- 订单不存在 -->
  <div class="not-found" v-else>
    <header class="detail-header">
      <button class="back-btn" @click="goBack">
        <van-icon name="arrow-left" size="20" />
      </button>
      <h1 class="page-title">订单详情</h1>
      <div class="placeholder"></div>
    </header>
    <van-empty description="订单不存在" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showConfirmDialog, showLoadingToast, closeToast } from 'vant'
import { useOrderStore } from '@/stores/order'

const router = useRouter()
const route = useRoute()
const orderStore = useOrderStore()

const order = ref(null)

const goBack = () => router.back()

const getStatusText = (status) => {
  const map = { pending: '待付款', shipped: '待收货', completed: '已完成' }
  return map[status] || status
}

const getStatusDesc = (status) => {
  const map = {
    pending: '请尽快完成付款',
    shipped: '商品正在配送中',
    completed: '感谢您的购买'
  }
  return map[status] || ''
}

const handlePay = async () => {
  try {
    await showConfirmDialog({
      title: '确认付款',
      message: `订单金额：¥${order.value.totalPrice.toFixed(2)}`,
      confirmButtonColor: '#1a1a1a'
    })
    showLoadingToast({ message: '支付中...', forbidClick: true })
    await new Promise(resolve => setTimeout(resolve, 800))
    closeToast()
    orderStore.updateOrderStatus(order.value.id, 'shipped')
    order.value.status = 'shipped'
    showToast({ message: '付款成功', icon: 'success' })
  } catch {}
}

const handleConfirm = async () => {
  try {
    await showConfirmDialog({
      title: '确认收货',
      message: '确认已收到商品？',
      confirmButtonColor: '#1a1a1a'
    })
    showLoadingToast({ message: '处理中...', forbidClick: true })
    await new Promise(resolve => setTimeout(resolve, 500))
    closeToast()
    orderStore.updateOrderStatus(order.value.id, 'completed')
    order.value.status = 'completed'
    showToast({ message: '收货成功', icon: 'success' })
  } catch {}
}

onMounted(() => {
  const orderId = route.params.id
  order.value = orderStore.orders.find(o => o.id === orderId)
})
</script>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding-bottom: 100px;
}

.detail-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
}

.back-btn, .placeholder {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
}

.page-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.status-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 20px;
  background: var(--primary-color);
  color: #fff;
  
  &.pending { background: var(--warning-color); }
  &.shipped { background: var(--success-color); }
  &.completed { background: var(--text-secondary); }
}

.status-icon { font-size: 36px; }
.status-text { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
.status-desc { font-size: 13px; opacity: 0.9; }

.address-section {
  display: flex;
  gap: 14px;
  margin: 16px;
  padding: 20px;
  background: var(--bg-primary);
  border-radius: 16px;
}

.address-icon { font-size: 20px; }
.address-content { flex: 1; }
.address-contact { display: flex; gap: 12px; margin-bottom: 6px; }
.contact-name { font-size: 15px; font-weight: 600; color: var(--text-primary); }
.contact-phone { font-size: 14px; color: var(--text-secondary); }
.address-detail { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }

.goods-section {
  margin: 16px;
  padding: 20px;
  background: var(--bg-primary);
  border-radius: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title { font-size: 15px; font-weight: 600; color: var(--text-primary); }
.goods-count { font-size: 12px; color: var(--text-muted); }

.goods-list { display: flex; flex-direction: column; gap: 16px; }

.goods-item {
  display: flex;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
  &:last-child { border-bottom: none; padding-bottom: 0; }
}

.goods-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.goods-info { flex: 1; display: flex; flex-direction: column; }
.goods-name { font-size: 14px; font-weight: 500; color: var(--text-primary); margin-bottom: 4px; }
.goods-spec { font-size: 12px; color: var(--text-muted); margin-bottom: auto; }

.goods-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.goods-price { font-size: 15px; font-weight: 600; color: var(--text-primary); }
.goods-quantity { font-size: 12px; color: var(--text-muted); }

.info-section, .amount-section {
  margin: 16px;
  padding: 20px;
  background: var(--bg-primary);
  border-radius: 16px;
}

.info-item, .amount-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
  &:last-child { border-bottom: none; }
}

.info-label, .amount-label { font-size: 14px; color: var(--text-secondary); }
.info-value, .amount-value { font-size: 14px; color: var(--text-primary); }

.amount-item.total {
  .amount-label { font-weight: 500; color: var(--text-primary); }
  .amount-value { font-size: 18px; font-weight: 600; }
}

.detail-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-light);
  
  @media screen and (min-width: 768px) {
    width: 640px;
    left: 50%;
    right: auto;
    margin-left: -320px;
  }
}

:deep(.van-button--danger) {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.not-found {
  min-height: 100vh;
  background: var(--bg-secondary);
}
</style>
