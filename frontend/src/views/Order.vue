<template>
  <!-- 确认订单页面 - 高端时尚版 -->
  <div class="order-page">
    <!-- 顶部导航 -->
    <header class="order-header">
      <button class="back-btn" @click="goBack">
        <van-icon name="arrow-left" size="20" />
      </button>
      <h1 class="page-title">确认订单</h1>
      <div class="placeholder"></div>
    </header>
    
    <!-- 收货地址 -->
    <section class="address-section" @click="goToAddress">
      <div class="address-card" v-if="selectedAddress">
        <div class="address-icon">📍</div>
        <div class="address-content">
          <div class="address-contact">
            <span class="contact-name">{{ selectedAddress.name }}</span>
            <span class="contact-phone">{{ selectedAddress.phone }}</span>
          </div>
          <p class="address-detail">{{ selectedAddress.fullAddress }}</p>
        </div>
        <van-icon name="arrow" class="address-arrow" />
      </div>
      <div class="no-address" v-else>
        <div class="add-icon">+</div>
        <span class="add-text">添加收货地址</span>
        <van-icon name="arrow" class="address-arrow" />
      </div>
    </section>
    
    <!-- 商品列表 -->
    <section class="goods-section">
      <div class="section-header">
        <h3 class="section-title">商品清单</h3>
        <span class="goods-count">{{ cartStore.selectedCount }} 件</span>
      </div>
      <div class="goods-list">
        <div 
          v-for="item in cartStore.selectedItems" 
          :key="item.id"
          class="goods-item"
        >
          <div class="goods-image-wrapper">
            <LazyImage :src="item.image" :alt="item.name" radius="12px" />
          </div>
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
    
    <!-- 配送信息 -->
    <section class="delivery-section">
      <div class="delivery-item">
        <span class="delivery-label">配送方式</span>
        <span class="delivery-value">快递配送</span>
      </div>
      <div class="delivery-item">
        <span class="delivery-label">预计送达</span>
        <span class="delivery-value">30分钟内</span>
      </div>
    </section>
    
    <!-- 订单备注 -->
    <section class="remark-section">
      <label class="remark-label">订单备注</label>
      <textarea 
        v-model="remark"
        class="remark-input"
        placeholder="选填，告诉我们您的特殊需求"
        rows="2"
      ></textarea>
    </section>
    
    <!-- 金额明细 -->
    <section class="amount-section">
      <div class="amount-item">
        <span class="amount-label">商品金额</span>
        <span class="amount-value">¥{{ cartStore.totalPrice.toFixed(2) }}</span>
      </div>
      <div class="amount-item">
        <span class="amount-label">配送费</span>
        <span class="amount-value">¥{{ deliveryFee.toFixed(2) }}</span>
      </div>
      <div class="amount-item" v-if="discount > 0">
        <span class="amount-label">优惠</span>
        <span class="amount-value discount">-¥{{ discount.toFixed(2) }}</span>
      </div>
    </section>
    
    <!-- 底部结算栏 -->
    <footer class="order-footer">
      <div class="footer-info">
        <span class="total-label">合计</span>
        <span class="total-price">¥{{ totalAmount.toFixed(2) }}</span>
      </div>
      <button class="submit-btn" @click="handleSubmit">提交订单</button>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog, showLoadingToast, closeToast } from 'vant'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { showError } from '@/utils/errorHandler'
import LazyImage from '@/components/LazyImage.vue'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()

const selectedAddress = ref(JSON.parse(localStorage.getItem('selectedAddress') || 'null'))
const remark = ref('')
const discount = ref(0)

const deliveryFee = computed(() => cartStore.totalPrice >= 30 ? 0 : 5)
const totalAmount = computed(() => cartStore.totalPrice + deliveryFee.value - discount.value)

const goBack = () => router.back()
const goToAddress = () => router.push('/address?select=1')

// 从地址页面返回时刷新
onActivated(() => {
  selectedAddress.value = JSON.parse(localStorage.getItem('selectedAddress') || 'null')
})

const handleSubmit = async () => {
  if (!selectedAddress.value) { showToast('请选择收货地址'); return }
  if (cartStore.selectedItems.length === 0) { showToast('请选择商品'); return }
  
  try {
    await showConfirmDialog({
      title: '确认订单',
      message: `订单金额：¥${totalAmount.value.toFixed(2)}\n确认提交订单吗？`,
      confirmButtonColor: '#1a1a1a'
    })
    showLoadingToast({ message: '提交中...', forbidClick: true })
    // 模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 创建订单
    orderStore.createOrder({
      address: {
        name: selectedAddress.value.name,
        phone: selectedAddress.value.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
        detail: selectedAddress.value.fullAddress
      },
      items: cartStore.selectedItems.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        unit: item.unit,
        quantity: item.quantity,
        price: item.price
      })),
      totalCount: cartStore.selectedCount,
      totalPrice: totalAmount.value,
      remark: remark.value
    })
    
    closeToast()
    showToast({ message: '订单提交成功', icon: 'success' })
    cartStore.removeSelected()
    setTimeout(() => router.replace('/order-list'), 1000)
  } catch (e) {
    if (e !== 'cancel' && e?.message !== 'cancel') {
      showError(e, '订单提交失败，请重试')
    }
  }
}
</script>

<style lang="scss" scoped>
.order-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding-bottom: 100px;
}

.order-header {
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

.address-section {
  margin: 16px;
  background: var(--bg-primary);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
}

.address-card, .no-address {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.address-icon { font-size: 24px; }

.address-content { flex: 1; }

.address-contact {
  display: flex;
  gap: 12px;
  margin-bottom: 6px;
}

.contact-name { font-size: 15px; font-weight: 600; color: var(--text-primary); }
.contact-phone { font-size: 14px; color: var(--text-secondary); }
.address-detail { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
.address-arrow { color: var(--text-muted); }

.no-address {
  .add-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    border-radius: 50%;
    font-size: 20px;
    color: var(--text-muted);
  }
  .add-text { flex: 1; font-size: 14px; color: var(--text-muted); }
}

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

.goods-image-wrapper {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
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

.delivery-section {
  margin: 16px;
  padding: 20px;
  background: var(--bg-primary);
  border-radius: 16px;
}

.delivery-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
  &:last-child { border-bottom: none; }
}

.delivery-label { font-size: 14px; color: var(--text-secondary); }
.delivery-value { font-size: 14px; color: var(--text-primary); }

.remark-section {
  margin: 16px;
  padding: 20px;
  background: var(--bg-primary);
  border-radius: 16px;
}

.remark-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.remark-input {
  width: 100%;
  padding: 12px;
  background: var(--bg-secondary);
  border: none;
  border-radius: 12px;
  font-size: 14px;
  color: var(--text-primary);
  resize: none;
  outline: none;
  &::placeholder { color: var(--text-muted); }
}

.amount-section {
  margin: 16px;
  padding: 20px;
  background: var(--bg-primary);
  border-radius: 16px;
}

.amount-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.amount-label { font-size: 14px; color: var(--text-secondary); }
.amount-value { font-size: 14px; color: var(--text-primary); }
.amount-value.discount { color: var(--success-color); }

.order-footer {
  position: fixed;
  bottom: 0;
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

.footer-info { display: flex; align-items: baseline; gap: 8px; }
.total-label { font-size: 13px; color: var(--text-secondary); }
.total-price { font-size: 22px; font-weight: 600; color: var(--text-primary); }

.submit-btn {
  padding: 14px 40px;
  background: var(--primary-color);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.05em;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: var(--transition-base);
  &:active { transform: scale(0.98); }
}
</style>
