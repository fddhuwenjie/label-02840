<template>
  <!-- 应用根组件 - 高端时尚版 -->
  <div class="app-container">
    <!-- 路由视图 -->
    <router-view v-slot="{ Component }">
      <keep-alive :include="['Home', 'Category', 'Cart', 'Profile']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    
    <!-- 底部导航栏 -->
    <nav v-if="showTabbar" class="luxury-tabbar">
      <div 
        v-for="tab in tabs" 
        :key="tab.path"
        class="tab-item"
        :class="{ active: route.path === tab.path }"
        @click="navigateTo(tab.path)"
      >
        <div class="tab-icon-wrapper">
          <van-icon :name="tab.icon" />
          <span v-if="tab.badge && cartCount > 0" class="tab-badge">{{ cartCount }}</span>
        </div>
        <span class="tab-label">{{ tab.label }}</span>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const cartCount = computed(() => cartStore.totalCount)

const tabs = [
  { path: '/', icon: 'wap-home-o', label: '首页' },
  { path: '/category', icon: 'apps-o', label: '分类' },
  { path: '/cart', icon: 'shopping-cart-o', label: '购物袋', badge: true },
  { path: '/profile', icon: 'user-o', label: '我的' }
]

const tabbarRoutes = ['/', '/category', '/cart', '/profile']
const showTabbar = computed(() => tabbarRoutes.includes(route.path))

const navigateTo = (path) => {
  if (route.path !== path) {
    router.push(path)
  }
}
</script>

<style lang="scss">
.app-container {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

// 高端底部导航栏
.luxury-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 64px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-light);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  color: var(--text-muted);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &.active {
    color: var(--text-primary);
    
    .tab-label {
      font-weight: 500;
    }
  }
}

.tab-icon-wrapper {
  position: relative;
  font-size: 22px;
}

.tab-badge {
  position: absolute;
  top: 0px;
  right: -10px;
  min-width: 16px;
  height: 16px;
  padding: 0 5px;
  background: var(--primary-color);
  color: #fff;
  font-size: 10px;
  font-weight: 500;
  line-height: 16px;
  text-align: center;
  border-radius: 10px;
}

.tab-label {
  font-size: 10px;
  letter-spacing: 0.02em;
}

// 隐藏默认 Vant tabbar
.van-tabbar {
  display: none !important;
}
</style>
