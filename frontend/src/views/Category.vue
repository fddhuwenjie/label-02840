<template>
  <!-- 分类页面 - 高端时尚版 -->
  <div class="category-page">
    <!-- 顶部搜索栏 -->
    <header class="category-header">
      <div class="header-content">
        <h1 class="page-title font-display">分类</h1>
        <div class="search-trigger" @click="goToSearch">
          <van-icon name="search" size="20" />
        </div>
      </div>
    </header>
    
    <!-- 分类内容 -->
    <div class="category-content">
      <!-- 左侧分类导航 -->
      <nav class="category-nav">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="nav-item"
          :class="{ active: activeCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          <span class="nav-icon">{{ category.icon }}</span>
          <span class="nav-name">{{ category.name }}</span>
          <span class="nav-indicator"></span>
        </div>
      </nav>
      
      <!-- 右侧商品列表 -->
      <div class="product-list">
        <div class="list-header">
          <h2 class="category-title font-display">{{ currentCategoryName }}</h2>
          <span class="product-count">{{ filteredProducts.length }} 件商品</span>
        </div>
        
        <div class="products" v-if="filteredProducts.length > 0">
          <div 
            v-for="(product, index) in filteredProducts" 
            :key="product.id"
            class="product-item animate-fadeInUp"
            :class="`animate-delay-${(index % 6) + 1}`"
            @click="goToProduct(product.id)"
          >
            <div class="product-image-wrapper">
              <LazyImage :src="product.image" :alt="product.name" radius="12px" />
              <div class="product-badge" v-if="product.price < product.originalPrice">
                {{ Math.round((1 - product.price / product.originalPrice) * 100) }}% OFF
              </div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-desc">{{ product.description }}</p>
              <div class="product-footer">
                <div class="product-price">
                  <span class="current">¥{{ product.price }}</span>
                  <span class="unit">/{{ product.unit }}</span>
                </div>
                <button class="add-btn" @click.stop="addToCart(product)">
                  <van-icon name="plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div class="empty-state" v-else>
          <div class="empty-icon">📦</div>
          <p class="empty-text">暂无商品</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 分类页面组件 - 高端时尚版
 */
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { categories, getProductsByCategory } from '@/data/products'
import LazyImage from '@/components/LazyImage.vue'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const userStore = useUserStore()

const activeCategory = ref(1)

const currentCategoryName = computed(() => {
  const category = categories.find(c => c.id === activeCategory.value)
  return category ? category.name : ''
})

const filteredProducts = computed(() => getProductsByCategory(activeCategory.value))

const selectCategory = (categoryId) => {
  activeCategory.value = categoryId
}

const goToSearch = () => router.push('/search')
const goToProduct = (productId) => router.push(`/product/${productId}`)

const addToCart = (product) => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  cartStore.addItem(product)
  showToast({ message: '已加入购物车', icon: 'success', duration: 1000 })
}

watch(() => route.query.id, (id) => {
  if (id) activeCategory.value = Number(id)
}, { immediate: true })

onMounted(() => {
  if (route.query.id) activeCategory.value = Number(route.query.id)
})
</script>

<style lang="scss" scoped>
.category-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-primary);
  padding-bottom: 64px; // 底部导航栏高度
}

// ==================== 顶部导航 ====================
.category-header {
  flex-shrink: 0;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}

.search-trigger {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition-base);
  
  &:active {
    background: var(--bg-tertiary);
  }
}

// ==================== 分类内容 ====================
.category-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

// ==================== 左侧导航 ====================
.category-nav {
  width: 88px;
  flex-shrink: 0;
  background: var(--bg-secondary);
  overflow-y: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 8px;
  cursor: pointer;
  transition: var(--transition-base);
  
  &.active {
    background: var(--bg-primary);
    
    .nav-name {
      color: var(--text-primary);
      font-weight: 500;
    }
    
    .nav-indicator {
      opacity: 1;
      transform: scaleY(1);
    }
  }
  
  &:active {
    background: var(--bg-tertiary);
  }
}

.nav-icon {
  font-size: 22px;
  margin-bottom: 6px;
}

.nav-name {
  font-size: 11px;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.3;
  transition: var(--transition-base);
}

.nav-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) scaleY(0);
  width: 3px;
  height: 24px;
  background: var(--primary-color);
  border-radius: 0 2px 2px 0;
  opacity: 0;
  transition: var(--transition-base);
}

// ==================== 右侧商品列表 ====================
.product-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
}

.category-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
}

.product-count {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

// ==================== 商品列表 ====================
.products {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 16px;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:active {
    transform: scale(0.98);
    background: var(--bg-tertiary);
  }
}

.product-image-wrapper {
  position: relative;
  flex-shrink: 0;
  width: 100px;
  height: 100px;
}

.product-badge {
  position: absolute;
  top: 6px;
  left: 6px;
  padding: 3px 8px;
  background: var(--primary-color);
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.02em;
  border-radius: 4px;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

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
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 2px;
  
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

.add-btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: #fff;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:active {
    transform: scale(0.9);
    background: var(--primary-dark);
  }
}

// ==================== 空状态 ====================
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}
</style>
