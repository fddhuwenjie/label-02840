<template>
  <!-- 购物车页面 - 高端时尚版 -->
  <div class="cart-page">
    <!-- 顶部导航 -->
    <header class="cart-header">
      <div class="header-content">
        <h1 class="page-title font-display">购物袋</h1>
        <button 
          v-if="cartStore.items.length > 0" 
          class="clear-btn" 
          @click="handleClearCart"
        >
          清空
        </button>
      </div>
      <p class="header-subtitle" v-if="cartStore.items.length > 0">
        共 {{ cartStore.totalCount }} 件商品
      </p>
    </header>
    
    <!-- 购物车列表 -->
    <div class="cart-content" v-if="cartStore.items.length > 0">
      <van-checkbox-group v-model="checkedIds">
        <div 
          v-for="(item, index) in cartStore.items" 
          :key="item.id"
          class="cart-item animate-fadeInUp"
          :class="`animate-delay-${(index % 6) + 1}`"
        >
          <div class="item-select">
            <van-checkbox :name="item.id" @click="toggleItem(item.id)">
              <template #icon="{ checked }">
                <div class="custom-checkbox" :class="{ checked }">
                  <van-icon v-if="checked" name="success" />
                </div>
              </template>
            </van-checkbox>
          </div>
          <div class="item-image-wrapper" @click="goToProduct(item.id)">
            <LazyImage :src="item.image" :alt="item.name" radius="12px" />
          </div>
          <div class="item-info">
            <h3 class="item-name" @click="goToProduct(item.id)">{{ item.name }}</h3>
            <p class="item-spec">{{ item.unit }}</p>
            <div class="item-footer">
              <span class="item-price">¥{{ item.price }}</span>
              <div class="quantity-control">
                <button class="qty-btn" @click="decreaseQuantity(item.id, item.quantity)">
                  <van-icon name="minus" />
                </button>
                <span class="qty-value">{{ item.quantity }}</span>
                <button class="qty-btn" @click="increaseQuantity(item.id)">
                  <van-icon name="plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </van-checkbox-group>
    </div>
    
    <!-- 空购物车 -->
    <div class="empty-cart" v-else>
      <div class="empty-content">
        <div class="empty-icon">🛍️</div>
        <h3 class="empty-title font-display">购物袋是空的</h3>
        <p class="empty-desc">快去挑选心仪的商品吧</p>
        <button class="shop-btn" @click="goShopping">开始购物</button>
      </div>
    </div>
    
    <!-- 底部结算栏 -->
    <footer class="cart-footer" v-if="cartStore.items.length > 0">
      <div class="footer-left">
        <div class="select-all" @click="toggleSelectAll">
          <div class="custom-checkbox" :class="{ checked: isAllSelected }">
            <van-icon v-if="isAllSelected" name="success" />
          </div>
          <span class="select-text">全选</span>
        </div>
      </div>
      <div class="footer-right">
        <div class="total-info">
          <span class="total-label">合计</span>
          <span class="total-price">¥{{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
        <button 
          class="checkout-btn" 
          :class="{ disabled: cartStore.selectedCount === 0 }"
          @click="handleSubmit"
        >
          结算 ({{ cartStore.selectedCount }})
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'
import { useCartStore } from '@/stores/cart'
import LazyImage from '@/components/LazyImage.vue'

const router = useRouter()
const cartStore = useCartStore()

const checkedIds = ref([])
const isAllSelected = computed(() => cartStore.isAllSelected)

watch(() => cartStore.items, (items) => {
  checkedIds.value = items.filter(item => item.selected).map(item => item.id)
}, { immediate: true, deep: true })

const toggleItem = (id) => { cartStore.toggleSelect(id) }
const toggleSelectAll = () => { cartStore.toggleSelectAll() }

const handleClearCart = async () => {
  try {
    await showConfirmDialog({ 
      title: '清空购物袋', 
      message: '确定要清空购物袋中的所有商品吗？',
      confirmButtonColor: '#1a1a1a'
    })
    cartStore.clearCart()
    showToast('已清空购物袋')
  } catch {}
}

const increaseQuantity = (id) => {
  const item = cartStore.items.find(i => i.id === id)
  if (item) cartStore.updateQuantity(id, item.quantity + 1)
}

const decreaseQuantity = (id, currentQty) => {
  if (currentQty > 1) {
    cartStore.updateQuantity(id, currentQty - 1)
  } else {
    // 数量为1时，点击减号删除商品
    cartStore.removeItem(id)
    showToast('已移除商品')
  }
}

const goToProduct = (id) => router.push(`/product/${id}`)
const goShopping = () => router.push('/')

const handleSubmit = async () => {
  if (cartStore.selectedCount === 0) { 
    showToast('请选择要结算的商品')
    return 
  }
  router.push('/order')
}
</script>

<style lang="scss" scoped>
.cart-page {
  min-height: 100vh;
  background: var(--bg-secondary);
}

.cart-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg-primary);
  padding: 20px;
  border-bottom: 1px solid var(--border-light);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 24px;
  font-weight: 500;
  color: var(--text-primary);
}

.clear-btn {
  font-size: 13px;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
}

.header-subtitle {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}

.cart-content { 
  padding: 16px;
  padding-bottom: 140px; // 只在有商品时添加底部间距
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--bg-primary);
  border-radius: 16px;
  margin-bottom: 12px;
}

.custom-checkbox {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  transition: var(--transition-base);
  font-size: 12px;
  color: #fff;
  &.checked { background: var(--primary-color); border-color: var(--primary-color); }
}

.item-image-wrapper {
  flex-shrink: 0;
  width: 90px;
  height: 90px;
  cursor: pointer;
}

.item-info { flex: 1; min-width: 0; }

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-spec { font-size: 12px; color: var(--text-muted); margin-bottom: 12px; }

.item-footer { display: flex; justify-content: space-between; align-items: center; }

.item-price { font-size: 16px; font-weight: 600; color: var(--text-primary); }

.quantity-control {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-secondary);
  border-radius: 24px;
  padding: 4px;
}

.qty-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border-radius: 50%;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
}

.qty-value { min-width: 24px; text-align: center; font-size: 14px; font-weight: 500; }

.empty-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 100px);
  padding: 40px 20px;
  padding-bottom: 80px; // 底部导航栏高度
}

.empty-content { text-align: center; }
.empty-icon { font-size: 64px; margin-bottom: 24px; }
.empty-title { font-size: 20px; font-weight: 500; margin-bottom: 8px; }
.empty-desc { font-size: 14px; color: var(--text-muted); margin-bottom: 32px; }

.shop-btn {
  padding: 14px 48px;
  background: var(--primary-color);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  border-radius: 30px;
  cursor: pointer;
}

.cart-footer {
  position: fixed;
  bottom: 64px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-light);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
}

.select-all { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.select-text { font-size: 13px; color: var(--text-secondary); }
.footer-right { display: flex; align-items: center; gap: 20px; }
.total-info { display: flex; flex-direction: column; align-items: flex-end; }
.total-label { font-size: 11px; color: var(--text-muted); }
.total-price { font-size: 20px; font-weight: 600; }

.checkout-btn {
  padding: 14px 28px;
  background: var(--primary-color);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  &.disabled { background: var(--border-color); color: var(--text-muted); }
}

:deep(.van-checkbox__icon) { display: none; }
</style>
