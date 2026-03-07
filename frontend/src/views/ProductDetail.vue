<template>
  <!-- 商品详情页面 - 高端时尚版 -->
  <div class="product-detail-page" v-if="product">
    <!-- 顶部导航 -->
    <header class="detail-header">
      <button class="back-btn" @click="goBack">
        <van-icon name="arrow-left" size="20" />
      </button>
      <div class="header-actions">
        <button class="action-btn" @click="goToCart">
          <van-icon name="shopping-cart-o" size="20" />
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </button>
        <button class="action-btn" @click="handleShare">
          <van-icon name="share-o" size="20" />
        </button>
      </div>
    </header>
    
    <!-- 商品图片轮播 -->
    <section class="gallery-section">
      <van-swipe 
        class="product-swipe" 
        :autoplay="4000" 
        @change="onSwipeChange"
      >
        <van-swipe-item v-for="(image, index) in product.images" :key="index">
          <div class="gallery-slide">
            <img :src="image" :alt="product.name" class="gallery-image" />
          </div>
        </van-swipe-item>
      </van-swipe>
      <div class="gallery-indicator">
        <span 
          v-for="(_, index) in product.images" 
          :key="index" 
          class="indicator-dot"
          :class="{ active: currentSlide === index }"
        ></span>
      </div>
    </section>
    
    <!-- 商品信息卡片 -->
    <section class="info-card">
      <!-- 价格区域 -->
      <div class="price-section">
        <div class="price-main">
          <span class="currency">¥</span>
          <span class="amount">{{ product.price }}</span>
        </div>
        <div class="price-meta">
          <span class="original-price" v-if="product.originalPrice > product.price">
            ¥{{ product.originalPrice }}
          </span>
          <span class="discount-tag" v-if="product.originalPrice > product.price">
            省 ¥{{ (product.originalPrice - product.price).toFixed(1) }}
          </span>
        </div>
      </div>
      
      <!-- 商品标题 -->
      <h1 class="product-title font-display">{{ product.name }}</h1>
      <p class="product-subtitle">{{ product.description }}</p>
      
      <!-- 标签 -->
      <div class="tags-row">
        <span v-for="tag in product.tags" :key="tag" class="product-tag">
          {{ tag }}
        </span>
        <span class="unit-tag">{{ product.unit }}</span>
      </div>
      
      <!-- 销量库存 -->
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-value">{{ product.sales }}</span>
          <span class="stat-label">已售</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ product.stock }}</span>
          <span class="stat-label">库存</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">4.9</span>
          <span class="stat-label">评分</span>
        </div>
      </div>
    </section>
    
    <!-- 服务保障 -->
    <section class="service-card">
      <div class="service-item">
        <div class="service-icon">🚀</div>
        <div class="service-content">
          <span class="service-title">极速配送</span>
          <span class="service-desc">30分钟送达</span>
        </div>
      </div>
      <div class="service-item">
        <div class="service-icon">✨</div>
        <div class="service-content">
          <span class="service-title">品质保证</span>
          <span class="service-desc">源头直采</span>
        </div>
      </div>
      <div class="service-item">
        <div class="service-icon">🔄</div>
        <div class="service-content">
          <span class="service-title">无忧售后</span>
          <span class="service-desc">7天退换</span>
        </div>
      </div>
    </section>
    
    <!-- 商品详情 -->
    <section class="detail-card">
      <div class="card-header">
        <span class="header-line"></span>
        <h3 class="card-title">商品详情</h3>
        <span class="header-line"></span>
      </div>
      <div class="detail-list">
        <div class="detail-item" v-for="(line, index) in detailLines" :key="index">
          <span class="detail-label">{{ line.label }}</span>
          <span class="detail-value">{{ line.value }}</span>
        </div>
      </div>
    </section>
    
    <!-- 底部操作栏 -->
    <footer class="action-footer">
      <div class="footer-icons">
        <button class="icon-btn" @click="callService">
          <van-icon name="service-o" />
          <span>客服</span>
        </button>
      </div>
      <div class="footer-buttons">
        <button class="cart-btn" @click="addToCart">
          <van-icon name="shopping-cart-o" />
          加入购物袋
        </button>
        <button class="buy-btn" @click="buyNow">立即购买</button>
      </div>
    </footer>
  </div>
  
  <!-- 商品不存在 -->
  <div class="not-found" v-else>
    <header class="detail-header">
      <button class="back-btn" @click="goBack">
        <van-icon name="arrow-left" size="20" />
      </button>
    </header>
    <div class="not-found-content">
      <div class="not-found-icon">🔍</div>
      <h3 class="not-found-title font-display">商品不存在</h3>
      <p class="not-found-desc">该商品可能已下架或不存在</p>
      <button class="home-btn" @click="goHome">返回首页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { getProductById } from '@/data/products'
import LazyImage from '@/components/LazyImage.vue'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const userStore = useUserStore()

const product = ref(null)
const currentSlide = ref(0)
const cartCount = computed(() => cartStore.totalCount)

// 解析商品详情为数组
const detailLines = computed(() => {
  if (!product.value?.detail) return []
  return product.value.detail.split('\n').map(line => {
    const [label, value] = line.split('：')
    return { label, value }
  })
})

const onSwipeChange = (index) => {
  currentSlide.value = index
}

const goBack = () => router.back()
const goHome = () => router.push('/')
const goToCart = () => router.push('/cart')
const callService = () => {
  showConfirmDialog({
    title: '联系客服',
    message: '确定拨打客服电话 400-888-8888？',
    confirmButtonColor: '#2eb872'
  }).then(() => {
    window.location.href = 'tel:400-888-8888'
  }).catch(() => {})
}
const handleShare = () => { showToast('功能正在开发中') }

const addToCart = () => {
  if (!userStore.isLoggedIn) { 
    router.push(`/login?redirect=${route.fullPath}`)
    return 
  }
  if (!product.value) return
  cartStore.addItem(product.value)
  showToast({ message: '已加入购物袋', icon: 'success', duration: 1000 })
}

const buyNow = () => {
  if (!userStore.isLoggedIn) { router.push(`/login?redirect=${route.fullPath}`); return }
  if (!product.value) return
  cartStore.addItem(product.value)
  router.push('/order')
}

onMounted(() => {
  const productId = route.params.id
  product.value = getProductById(productId)
})
</script>

<style lang="scss" scoped>
.product-detail-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding-bottom: 100px;
}

// ==================== 顶部导航 ====================
.detail-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  
  @media screen and (min-width: 768px) {
    width: 640px;
    left: 50%;
    right: auto;
    margin-left: -320px;
  }
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  color: var(--text-primary);
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.header-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  color: var(--text-primary);
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.cart-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: var(--primary-color);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  line-height: 18px;
  text-align: center;
  border-radius: 10px;
}

// ==================== 图片轮播 ====================
.gallery-section {
  position: relative;
  background: var(--bg-primary);
  width: 100%;
}

.product-swipe {
  width: 100%;
  
  .gallery-slide { 
    height: 400px;
    width: 100%;
  }
  
  :deep(.van-swipe-item) {
    width: 100% !important;
  }
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-indicator {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &.active {
    width: 24px;
    border-radius: 4px;
    background: #fff;
  }
}

// ==================== 商品信息卡片 ====================
.info-card {
  margin: -20px 16px 16px;
  padding: 24px;
  background: var(--bg-primary);
  border-radius: 24px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
}

.price-main {
  display: flex;
  align-items: baseline;
  color: var(--primary-color);
  
  .currency {
    font-size: 18px;
    font-weight: 600;
  }
  
  .amount {
    font-size: 36px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
}

.price-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-card .original-price {
  font-size: 14px;
  color: var(--text-muted);
  text-decoration: line-through;
}

.discount-tag {
  padding: 4px 10px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  border-radius: 12px;
}

.product-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
  margin-bottom: 8px;
}

.product-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.product-tag {
  padding: 6px 14px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  border-radius: 20px;
}

.unit-tag {
  padding: 6px 14px;
  background: var(--accent-light);
  color: var(--accent-dark);
  font-size: 12px;
  font-weight: 500;
  border-radius: 20px;
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  border-top: 1px solid var(--border-light);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: var(--border-light);
}

// ==================== 服务保障 ====================
.service-card {
  display: flex;
  margin: 0 16px 16px;
  padding: 20px;
  background: var(--bg-primary);
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.service-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.service-icon {
  font-size: 28px;
}

.service-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.service-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.service-desc {
  font-size: 11px;
  color: var(--text-muted);
}

// ==================== 商品详情 ====================
.detail-card {
  margin: 0 16px 16px;
  padding: 24px;
  background: var(--bg-primary);
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.header-line {
  width: 40px;
  height: 1px;
  background: var(--border-color);
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.1em;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--border-light);
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.detail-label {
  font-size: 14px;
  color: var(--text-muted);
}

.detail-value {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

// ==================== 底部操作栏 ====================
.action-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: var(--bg-primary);
  border-top: 1px solid var(--border-light);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
  
  @media screen and (min-width: 768px) {
    width: 640px;
    left: 50%;
    right: auto;
    margin-left: -320px;
  }
}

.footer-icons {
  display: flex;
  gap: 4px;
}

.icon-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 14px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 10px;
  cursor: pointer;
  
  .van-icon { font-size: 22px; }
}

.footer-buttons {
  flex: 1;
  display: flex;
  gap: 10px;
}

.cart-btn, .buy-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 0;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 28px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.98);
  }
}

.cart-btn {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  
  .van-icon { font-size: 18px; }
}

.buy-btn {
  background: var(--primary-color);
  color: #fff;
}

// ==================== 商品不存在 ====================
.not-found {
  min-height: 100vh;
  background: var(--bg-secondary);
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px);
  padding: 40px 20px;
  text-align: center;
}

.not-found-icon { font-size: 64px; margin-bottom: 24px; opacity: 0.5; }
.not-found-title { font-size: 20px; margin-bottom: 8px; }
.not-found-desc { font-size: 14px; color: var(--text-muted); margin-bottom: 32px; }

.home-btn {
  padding: 14px 48px;
  background: var(--primary-color);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  border: none;
  border-radius: 30px;
  cursor: pointer;
}
</style>
