<template>
  <!-- 首页 - 高端时尚版 -->
  <div class="home-page">
    <!-- 顶部导航 -->
    <header class="luxury-header">
      <div class="header-content">
        <div class="brand">
          <span class="brand-icon">🌿</span>
          <span class="brand-name font-display">FRESH</span>
        </div>
        <div class="header-actions">
          <div class="search-trigger" @click="goToSearch">
            <van-icon name="search" size="20" />
          </div>
        </div>
      </div>
    </header>

    <!-- 主视觉区域 -->
    <section class="hero-section">
      <van-swipe class="hero-swipe" :autoplay="5000" :show-indicators="true">
        <van-swipe-item v-for="banner in banners" :key="banner.id">
          <div class="hero-slide" @click="handleBannerClick(banner)">
            <LazyImage :src="banner.image" :alt="banner.title" aspect-ratio="2" radius="0" />
            <div class="hero-overlay"></div>
            <div class="hero-content">
              <span class="hero-tag">精选推荐</span>
              <h2 class="hero-title font-display">{{ banner.title }}</h2>
              <button class="hero-btn">探索更多</button>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </section>

    <!-- 分类导航 -->
    <section class="category-section">
      <div class="section-intro">
        <span class="intro-line"></span>
        <span class="intro-text">精选品类</span>
        <span class="intro-line"></span>
      </div>
      <div class="category-scroll">
        <div 
          v-for="category in categories" 
          :key="category.id" 
          class="category-card"
          @click="goToCategory(category.id)"
        >
          <div class="category-icon-wrapper">
            <span class="category-icon">{{ category.icon }}</span>
          </div>
          <span class="category-name">{{ category.name }}</span>
        </div>
      </div>
    </section>

    <!-- 限时特惠 -->
    <section class="flash-section">
      <div class="section-header">
        <div class="header-left">
          <h3 class="section-title font-display">限时特惠</h3>
          <p class="section-subtitle">精选好物 · 限时折扣</p>
        </div>
        <button class="view-all-btn" @click="goToCategory(1)">
          查看全部
          <van-icon name="arrow" />
        </button>
      </div>
      <div class="flash-scroll">
        <div 
          v-for="product in discountProducts" 
          :key="product.id" 
          class="flash-card"
          @click="goToProduct(product.id)"
        >
          <div class="flash-image-wrapper">
            <LazyImage :src="product.image" :alt="product.name" />
            <div class="flash-badge">
              {{ Math.round((1 - product.price / product.originalPrice) * 100) }}% OFF
            </div>
          </div>
          <div class="flash-info">
            <h4 class="flash-name">{{ product.name }}</h4>
            <div class="flash-price">
              <span class="current-price">¥{{ product.price }}</span>
              <span class="original-price">¥{{ product.originalPrice }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 精选推荐 -->
    <section class="recommend-section">
      <div class="section-header centered">
        <span class="header-line"></span>
        <div class="header-center">
          <h3 class="section-title font-display">精选推荐</h3>
          <p class="section-subtitle">为您甄选优质好物</p>
        </div>
        <span class="header-line"></span>
      </div>
      <div class="product-grid">
        <div 
          v-for="product in recommendProducts" 
          :key="product.id" 
          class="product-card"
          @click="goToProduct(product.id)"
        >
          <div class="product-image-wrapper">
            <LazyImage :src="product.image" :alt="product.name" radius="16px 16px 0 0" />
            <div class="product-overlay">
              <button class="quick-add-btn" @click.stop="addToCart(product)">
                <van-icon name="plus" />
              </button>
            </div>
            <div class="product-tags">
              <span v-for="tag in product.tags.slice(0, 1)" :key="tag" class="product-tag">
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="product-info">
            <h4 class="product-name">{{ product.name }}</h4>
            <p class="product-desc">{{ product.description }}</p>
            <div class="product-footer">
              <div class="product-price">
                <span class="current">¥{{ product.price }}</span>
                <span class="unit">/{{ product.unit }}</span>
              </div>
              <span class="product-sales">已售 {{ product.sales }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 品牌故事 -->
    <section class="story-section">
      <div class="story-content">
        <span class="story-tag">OUR STORY</span>
        <h3 class="story-title font-display">源自自然的馈赠</h3>
        <p class="story-desc">
          我们精选全球优质产地，严格把控每一道品质关卡，
          只为将最新鲜、最健康的食材送到您的餐桌。
        </p>
        <div class="story-features">
          <div class="feature-item">
            <span class="feature-icon">🌱</span>
            <span class="feature-text">有机种植</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🚚</span>
            <span class="feature-text">冷链配送</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">✨</span>
            <span class="feature-text">品质保证</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { banners, categories, getDiscountProducts, getRecommendProducts } from '@/data/products'
import LazyImage from '@/components/LazyImage.vue'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const discountProducts = ref(getDiscountProducts(6))
const recommendProducts = ref(getRecommendProducts(8))

const goToSearch = () => router.push('/search')
const handleBannerClick = (banner) => banner.link && router.push(banner.link)
const goToCategory = (categoryId) => router.push(`/category?id=${categoryId}`)
const goToProduct = (productId) => router.push(`/product/${productId}`)

const addToCart = (product) => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  cartStore.addItem(product)
  showToast({ message: '已加入购物袋', icon: 'success', duration: 1000 })
}
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding-bottom: 80px;
}

.luxury-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-light);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-icon { font-size: 24px; }

.brand-name {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--text-primary);
}

.search-trigger {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
  &:active { background: var(--bg-tertiary); }
}

.hero-section { padding-top: 72px; }

.hero-swipe { height: 220px; }

.hero-slide {
  position: relative;
  height: 100%;
  cursor: pointer;
}

.hero-slide :deep(.lazy-image-wrapper) {
  position: absolute;
  inset: 0;
  height: 100%;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%);
  z-index: 1;
}

.hero-content {
  position: absolute;
  bottom: 40px;
  left: 24px;
  right: 24px;
  color: #fff;
  z-index: 2;
}

.hero-tag {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.hero-title {
  font-size: 24px;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.hero-btn {
  padding: 12px 28px;
  background: #fff;
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
}

.category-section { padding: 40px 0; }

.section-intro {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 28px;
}

.intro-line {
  width: 40px;
  height: 1px;
  background: var(--border-color);
}

.intro-text {
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.category-scroll {
  display: flex;
  gap: 12px;
  padding: 0 20px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.category-card {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  background: var(--bg-secondary);
  border-radius: 16px;
  min-width: 80px;
  cursor: pointer;
  transition: transform 0.2s;
  &:active { transform: scale(0.96); }
}

.category-icon-wrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
}

.category-icon { font-size: 24px; }

.category-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
}

.flash-section { padding: 20px 0 40px; }

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 24px;
  &.centered {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
}

.header-left, .header-center {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-center { text-align: center; }

.header-line {
  width: 60px;
  height: 1px;
  background: var(--border-color);
}

.section-title {
  font-size: 22px;
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}

.section-subtitle {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
}

.flash-scroll {
  display: flex;
  gap: 16px;
  padding: 0 20px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.flash-card {
  flex-shrink: 0;
  width: 140px;
  cursor: pointer;
}

.flash-image-wrapper {
  position: relative;
  margin-bottom: 12px;
}

.flash-image-wrapper :deep(.lazy-image-wrapper) {
  border-radius: 12px;
}

.flash-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  background: var(--primary-color);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  border-radius: 4px;
  z-index: 1;
}

.flash-info { padding: 0 4px; }

.flash-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flash-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.current-price {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.flash-price .original-price {
  font-size: 11px;
  color: var(--text-muted);
  text-decoration: line-through;
}

.recommend-section { padding: 20px 0 40px; }

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 0 20px;
}

.product-card {
  background: var(--bg-primary);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s;
  &:active { transform: scale(0.98); }
}

.product-image-wrapper {
  position: relative;
}

.product-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 12px;
}

.quick-add-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border-radius: 50%;
  box-shadow: var(--shadow-md);
  color: var(--text-primary);
  font-size: 16px;
  border: none;
  cursor: pointer;
  &:active {
    background: var(--primary-color);
    color: #fff;
    transform: scale(0.9);
  }
}

.product-tags {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
  z-index: 1;
}

.product-tag {
  padding: 4px 10px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(10px);
  font-size: 10px;
  font-weight: 500;
  color: var(--text-primary);
  border-radius: 4px;
}

.product-info { padding: 16px; }

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-desc {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price {
  .current {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }
  .unit {
    font-size: 11px;
    color: var(--text-muted);
  }
}

.product-sales {
  font-size: 10px;
  color: var(--text-muted);
}

.story-section {
  margin: 20px;
  padding: 40px 24px;
  background: var(--bg-dark);
  border-radius: 20px;
  text-align: center;
}

.story-content { max-width: 300px; margin: 0 auto; }

.story-tag {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--accent-color);
  margin-bottom: 16px;
}

.story-title {
  font-size: 24px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 16px;
}

.story-desc {
  font-size: 13px;
  line-height: 1.8;
  color: rgba(255,255,255,0.7);
  margin-bottom: 32px;
}

.story-features {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.feature-icon { font-size: 24px; }

.feature-text {
  font-size: 11px;
  color: rgba(255,255,255,0.6);
}
</style>
