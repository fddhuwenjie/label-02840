/**
 * 购物车状态管理
 * 管理购物车商品列表、数量计算和相关操作
 */
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { createModuleLogger } from '@/utils/logger'
import { validateQuantity } from '@/utils/validator'
import { useUserStore } from '@/stores/user'

const logger = createModuleLogger('CartStore')

export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  
  // 获取当前用户的存储key
  const getStorageKey = () => {
    const userId = userStore.userInfo?.id || 'guest'
    return `cartItems_${userId}`
  }
  
  // 购物车商品列表
  const items = ref([])
  
  // 初始化加载当前用户的购物车
  const loadCart = () => {
    const key = getStorageKey()
    items.value = JSON.parse(localStorage.getItem(key) || '[]')
  }
  
  // 监听用户变化，切换购物车数据
  watch(() => userStore.userInfo?.id, () => {
    loadCart()
  }, { immediate: true })
  
  // 购物车商品总数量
  const totalCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })
  
  // 选中商品的总价格
  const totalPrice = computed(() => {
    return items.value
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
  })
  
  // 选中商品数量
  const selectedCount = computed(() => {
    return items.value
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.quantity, 0)
  })
  
  // 是否全选
  const isAllSelected = computed(() => {
    return items.value.length > 0 && items.value.every(item => item.selected)
  })
  
  // 选中的商品列表
  const selectedItems = computed(() => {
    return items.value.filter(item => item.selected)
  })
  
  /**
   * 保存购物车到本地存储
   */
  const saveToStorage = () => {
    try {
      const key = getStorageKey()
      localStorage.setItem(key, JSON.stringify(items.value))
    } catch (e) {
      logger.error('保存购物车失败', e)
    }
  }
  
  /**
   * 添加商品到购物车
   */
  const addItem = (product, quantity = 1) => {
    if (!product || !product.id) {
      logger.warn('添加商品失败：商品信息无效', { product })
      throw new Error('商品信息无效')
    }
    
    const qtyValidation = validateQuantity(quantity, { min: 1, max: 99 })
    if (!qtyValidation.valid) {
      logger.warn('添加商品失败：数量无效', { quantity })
      throw new Error(qtyValidation.message)
    }
    
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      const newQty = existingItem.quantity + qtyValidation.value
      if (newQty > 99) {
        logger.warn('添加商品失败：超出最大数量', { productId: product.id, currentQty: existingItem.quantity })
        throw new Error('单个商品最多购买99件')
      }
      existingItem.quantity = newQty
      logger.info('更新购物车商品数量', { productId: product.id, quantity: newQty })
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        unit: product.unit || '份',
        quantity: qtyValidation.value,
        selected: true
      })
      logger.info('添加商品到购物车', { productId: product.id, name: product.name })
    }
    
    saveToStorage()
  }
  
  /**
   * 从购物车移除商品
   */
  const removeItem = (productId) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index !== -1) {
      const removed = items.value.splice(index, 1)[0]
      logger.info('从购物车移除商品', { productId, name: removed.name })
      saveToStorage()
    } else {
      logger.warn('移除商品失败：商品不存在', { productId })
    }
  }
  
  /**
   * 更新商品数量
   */
  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(item => item.id === productId)
    if (!item) {
      logger.warn('更新数量失败：商品不存在', { productId })
      return
    }
    
    if (quantity <= 0) {
      removeItem(productId)
    } else {
      const qtyValidation = validateQuantity(quantity, { min: 1, max: 99 })
      if (qtyValidation.valid) {
        item.quantity = qtyValidation.value
        logger.info('更新商品数量', { productId, quantity: qtyValidation.value })
        saveToStorage()
      }
    }
  }
  
  /**
   * 切换商品选中状态
   */
  const toggleSelect = (productId) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      item.selected = !item.selected
      saveToStorage()
    }
  }
  
  /**
   * 全选/取消全选
   */
  const toggleSelectAll = () => {
    const newState = !isAllSelected.value
    items.value.forEach(item => {
      item.selected = newState
    })
    saveToStorage()
    logger.action(newState ? '全选商品' : '取消全选')
  }
  
  /**
   * 清空购物车
   */
  const clearCart = () => {
    items.value = []
    saveToStorage()
    logger.action('清空购物车')
  }
  
  /**
   * 移除选中的商品
   */
  const removeSelected = () => {
    const count = selectedCount.value
    items.value = items.value.filter(item => !item.selected)
    saveToStorage()
    logger.action('移除选中商品', { count })
  }
  
  return {
    items,
    totalCount,
    totalPrice,
    selectedCount,
    isAllSelected,
    selectedItems,
    addItem,
    removeItem,
    updateQuantity,
    toggleSelect,
    toggleSelectAll,
    clearCart,
    removeSelected
  }
})
