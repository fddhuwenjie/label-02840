<template>
  <!-- 搜索页面 - 高端时尚版 -->
  <div class="search-page">
    <!-- 搜索栏 -->
    <header class="search-header">
      <button class="back-btn" @click="goBack">
        <van-icon name="arrow-left" size="20" />
      </button>
      <div class="search-input-wrapper">
        <van-icon name="search" class="search-icon" />
        <input 
          v-model="keyword"
          type="text"
          class="search-input"
          placeholder="搜索商品"
          @keyup.enter="handleSearch"
          autofocus
        />
        <van-icon v-if="keyword" name="clear" class="clear-icon" @click="keyword = ''" />
      </div>
      <button class="search-btn" @click="handleSearch">搜索</button>
    </header>
    
    <!-- 搜索历史 -->
    <section class="history-section" v-if="!keyword && searchHistory.length > 0">
      <div class="section-header">
        <h3 class="section-title">搜索历史</h3>
        <button class="clear-btn" @click="clearHistory">
          <van-icon name="delete-o" />
        </button>
      </div>
      <div class="tag-list">
        <button 
          v-for="(item, index) in searchHistory" 
          :key="index"
          class="tag-item"
          @click="searchByHistory(item)"
        >
          {{ item }}
        </button>
      </div>
    </section>
    
    <!-- 热门搜索 -->
    <section class="hot-section" v-if="!keyword">
      <div class="section-header">
        <h3 class="section-title">热门搜索</h3>
      </div>
      <div class="tag-list">
        <button 
          v-for="item in hotKeywords" 
          :key="item"
          class="tag-item hot"
          @click="searchByHistory(item)"
        >
          {{ item }}
        </button>
      </div>
    </section>
    
    <!-- 搜索结果 -->
    <section class="search-result" v-if="keyword">
      <div class="result-header" v-if="searchResults.length > 0">
        <span class="result-count">找到 {{ searchResults.length }} 件商品</span>
      </div>
      
      <div class="product-list">
        <div 
          v-for="(product, index) in searchResults" 
          :key="product.id"
          class="product-item animate-fadeInUp"
          :class="`animate-delay-${(index % 6) + 1}`"
          @click="goToProduct(product.id)"
        >
          <div class="product-image-wrapper">
            <LazyImage :src="product.image" :alt="product.name" radius="12px" />
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
      
      <!-- 无结果 -->
      <div class="empty-result" v-if="searchResults.length === 0">
        <div class="empty-icon">🔍</div>
        <p class="empty-text">未找到相关商品</p>
        <p class="empty-hint">换个关键词试试吧</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useCartStore } from '@/stores/cart'
import { searchProducts } from '@/data/products'
import { createModuleLogger } from '@/utils/logger'
import { validateSearchKeyword } from '@/utils/validator'
import LazyImage from '@/components/LazyImage.vue'

const logger = createModuleLogger('Search')
const router = useRouter()
const cartStore = useCartStore()

const keyword = ref('')
const searchResults = ref([])
const searchHistory = ref(JSON.parse(localStorage.getItem('searchHistory') || '[]'))
const hotKeywords = ['苹果', '香蕉', '西兰花', '胡萝卜', '鸡蛋', '三文鱼', '大米', '红枣']

const goBack = () => router.back()

const handleSearch = () => {
  const validation = validateSearchKeyword(keyword.value)
  if (!validation.valid) return
  
  const searchTerm = validation.value
  logger.action('搜索', { keyword: searchTerm })
  
  // 更新历史记录
  const history = searchHistory.value.filter(item => item !== searchTerm)
  history.unshift(searchTerm)
  searchHistory.value = history.slice(0, 10)
  
  try {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
  } catch (e) {
    logger.warn('保存搜索历史失败', e)
  }
  
  searchResults.value = searchProducts(searchTerm)
  logger.info('搜索完成', { keyword: searchTerm, resultCount: searchResults.value.length })
}

const searchByHistory = (item) => {
  keyword.value = item
  handleSearch()
}

const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
  logger.action('清空搜索历史')
}

const goToProduct = (productId) => router.push(`/product/${productId}`)

const addToCart = (product) => {
  try {
    cartStore.addItem(product)
    showToast({ message: '已加入购物袋', icon: 'success', duration: 1000 })
    logger.action('加入购物车', { productId: product.id, productName: product.name })
  } catch (e) {
    logger.error('加入购物车失败', e, { productId: product.id })
    showToast('添加失败，请重试')
  }
}

watch(keyword, (val) => {
  const validation = validateSearchKeyword(val)
  if (validation.valid) {
    searchResults.value = searchProducts(validation.value)
  } else {
    searchResults.value = []
  }
})
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.search-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: var(--bg-secondary);
  border-radius: 24px;
}

.search-icon { color: var(--text-muted); font-size: 16px; }

.search-input {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
  background: transparent;
  border: none;
  outline: none;
  &::placeholder { color: var(--text-muted); }
}

.clear-icon {
  color: var(--text-muted);
  font-size: 16px;
  cursor: pointer;
}

.search-btn {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
}

.history-section, .hot-section {
  padding: 24px 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.clear-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  padding: 8px 16px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 13px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:active { background: var(--bg-tertiary); color: var(--text-primary); }
  &.hot { background: var(--bg-tertiary); }
}

.search-result { padding: 16px 20px; }

.result-header { margin-bottom: 16px; }
.result-count { font-size: 12px; color: var(--text-muted); }

.product-list { display: flex; flex-direction: column; gap: 16px; }

.product-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 16px;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:active { transform: scale(0.98); }
}

.product-image-wrapper {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
}

.product-info { flex: 1; display: flex; flex-direction: column; min-width: 0; }

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
  .current { font-size: 16px; font-weight: 600; color: var(--text-primary); }
  .unit { font-size: 11px; color: var(--text-muted); }
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
  border: none;
  cursor: pointer;
}

.empty-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
.empty-text { font-size: 14px; color: var(--text-primary); margin-bottom: 8px; }
.empty-hint { font-size: 12px; color: var(--text-muted); }
</style>
