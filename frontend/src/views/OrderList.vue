<template>
  <!-- 订单列表页面 -->
  <div class="order-list-page">
    <!-- 顶部导航 -->
    <van-nav-bar 
      title="我的订单" 
      left-arrow 
      @click-left="goBack"
    />
    
    <!-- 订单状态标签 -->
    <van-tabs v-model:active="activeTab" sticky>
      <van-tab title="全部" name="all" />
      <van-tab title="待付款" name="pending" />
      <van-tab title="待收货" name="shipped" />
      <van-tab title="已完成" name="completed" />
    </van-tabs>
    
    <!-- 订单列表 -->
    <div class="order-list">
      <div 
        v-for="order in filteredOrders" 
        :key="order.id"
        class="order-card"
      >
        <div class="order-header">
          <span class="order-no">订单号：{{ order.id }}</span>
          <span class="order-status" :class="order.status">{{ getStatusText(order.status) }}</span>
        </div>
        
        <div class="order-address">
          <span class="address-icon">📍</span>
          <div class="address-info">
            <span class="address-contact">{{ order.address.name }} {{ order.address.phone }}</span>
            <span class="address-detail">{{ order.address.detail }}</span>
          </div>
        </div>
        
        <div class="order-goods" @click="goToOrderDetail(order.id)">
          <div 
            v-for="item in order.items.slice(0, 2)" 
            :key="item.id"
            class="goods-item"
          >
            <img :src="item.image" :alt="item.name" class="goods-image" />
            <div class="goods-info">
              <div class="goods-name ellipsis">{{ item.name }}</div>
              <div class="goods-spec">{{ item.unit }} x{{ item.quantity }}</div>
            </div>
            <div class="goods-price">¥{{ item.price }}</div>
          </div>
          <div class="view-more" v-if="order.items.length > 2">
            <span>查看全部 {{ order.items.length }} 件商品</span>
            <van-icon name="arrow" />
          </div>
        </div>
        
        <div class="order-footer">
          <div class="order-total">
            共{{ order.totalCount }}件商品，合计：<span class="total-price">¥{{ order.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="order-actions">
            <van-button v-if="order.status === 'pending'" size="small" type="danger" round @click="handlePay(order)">去付款</van-button>
            <van-button v-if="order.status === 'shipped'" size="small" type="success" round @click="handleConfirm(order)">确认收货</van-button>
            <van-button v-if="order.status === 'completed'" size="small" round @click="handleRebuy(order)">再次购买</van-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <van-empty v-if="filteredOrders.length === 0" description="暂无订单">
      <van-button type="success" round @click="goShopping">去购物</van-button>
    </van-empty>
  </div>
</template>

<script setup>
/**
 * 订单列表页面组件
 * 展示用户的所有订单
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showConfirmDialog, showLoadingToast, closeToast } from 'vant'
import { useOrderStore } from '@/stores/order'
import { useCartStore } from '@/stores/cart'
import { showError } from '@/utils/errorHandler'

const router = useRouter()
const route = useRoute()
const orderStore = useOrderStore()
const cartStore = useCartStore()

// 当前激活的标签
const activeTab = ref('all')

// 筛选后的订单
const filteredOrders = computed(() => {
  return orderStore.getOrdersByStatus(activeTab.value)
})

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待付款',
    shipped: '待收货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 去购物
const goShopping = () => {
  router.push('/')
}

// 查看订单详情
const goToOrderDetail = (orderId) => {
  router.push(`/order-detail/${orderId}`)
}

// 去付款
const handlePay = async (order) => {
  try {
    await showConfirmDialog({
      title: '确认付款',
      message: `订单金额：¥${order.totalPrice.toFixed(2)}`,
      confirmButtonColor: '#1a1a1a'
    })
    showLoadingToast({ message: '支付中...', forbidClick: true })
    // 模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 800))
    closeToast()
    orderStore.updateOrderStatus(order.id, 'shipped')
    showToast({ message: '付款成功', icon: 'success' })
  } catch (e) {
    if (e !== 'cancel' && e?.message !== 'cancel') {
      showError(e, '支付失败，请重试')
    }
  }
}

// 确认收货
const handleConfirm = async (order) => {
  try {
    await showConfirmDialog({
      title: '确认收货',
      message: '确认已收到商品？',
      confirmButtonColor: '#1a1a1a'
    })
    showLoadingToast({ message: '处理中...', forbidClick: true })
    await new Promise(resolve => setTimeout(resolve, 500))
    closeToast()
    orderStore.updateOrderStatus(order.id, 'completed')
    showToast({ message: '收货成功', icon: 'success' })
  } catch (e) {
    if (e !== 'cancel' && e?.message !== 'cancel') {
      showError(e, '操作失败，请重试')
    }
  }
}

// 再次购买
const handleRebuy = (order) => {
  try {
    order.items.forEach(item => {
      cartStore.addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        unit: item.unit
      })
    })
    showToast({ message: '已加入购物袋', icon: 'success' })
    router.push('/cart')
  } catch (e) {
    showError(e, '添加失败，请重试')
  }
}

// 页面加载时检查路由参数
onMounted(() => {
  if (route.query.status) {
    activeTab.value = route.query.status
  }
})
</script>

<style lang="scss" scoped>
.order-list-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding-bottom: 20px;
}

.order-list {
  padding: 16px;
}

.order-card {
  background: var(--bg-primary);
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
}

.order-no {
  font-size: 12px;
  color: var(--text-muted);
}

.order-status {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 20px;
}

.order-status.pending {
  color: var(--warning-color);
  background: rgba(217, 119, 6, 0.1);
}

.order-status.shipped {
  color: var(--success-color);
  background: rgba(5, 150, 105, 0.1);
}

.order-status.completed {
  color: var(--text-muted);
  background: var(--bg-secondary);
}

.order-address {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 20px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-light);
}

.address-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.address-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.address-contact {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.address-detail {
  font-size: 12px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-goods {
  padding: 16px 20px;
  cursor: pointer;
}

.view-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 0 4px;
  font-size: 12px;
  color: var(--text-muted);
  border-top: 1px dashed var(--border-light);
  margin-top: 10px;
}

.goods-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 0;
  border-bottom: 1px dashed var(--border-light);
}

.goods-item:last-child {
  border-bottom: none;
}

.goods-image {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
}

.goods-info {
  flex: 1;
  min-width: 0;
}

.goods-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.goods-spec {
  font-size: 12px;
  color: var(--text-muted);
}

.goods-price {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid var(--border-light);
}

.order-total {
  font-size: 12px;
  color: var(--text-secondary);
}

.total-price {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.order-actions {
  display: flex;
  gap: 10px;
}

:deep(.van-button) {
  padding: 0 20px;
  height: 34px;
  font-size: 12px;
  font-weight: 500;
}

:deep(.van-button--danger) {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

:deep(.van-button--success) {
  background: var(--success-color);
  border-color: var(--success-color);
}

:deep(.van-tabs__nav) {
  background: var(--bg-primary);
}

:deep(.van-tab) {
  color: var(--text-secondary);
  font-size: 14px;
}

:deep(.van-tab--active) {
  color: var(--text-primary);
  font-weight: 500;
}

:deep(.van-tabs__line) {
  background: var(--primary-color);
  width: 24px;
  height: 2px;
}

:deep(.van-empty) {
  padding: 80px 0;
}
</style>
