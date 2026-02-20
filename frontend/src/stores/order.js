/**
 * 订单状态管理
 * 管理订单列表和订单操作
 */
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'

export const useOrderStore = defineStore('order', () => {
  const userStore = useUserStore()
  
  // 获取当前用户的存储key
  const getStorageKey = () => {
    const userId = userStore.userInfo?.id || 'guest'
    return `orders_${userId}`
  }
  
  // 订单列表
  const orders = ref([])
  
  // 初始化加载当前用户的订单
  const loadOrders = () => {
    const key = getStorageKey()
    orders.value = JSON.parse(localStorage.getItem(key) || '[]')
  }
  
  // 监听用户变化，切换订单数据
  watch(() => userStore.userInfo?.id, () => {
    loadOrders()
  }, { immediate: true })
  
  // 保存到本地存储
  const saveToStorage = () => {
    const key = getStorageKey()
    localStorage.setItem(key, JSON.stringify(orders.value))
  }
  
  // 根据状态筛选订单
  const getOrdersByStatus = (status) => {
    if (status === 'all') return orders.value
    return orders.value.filter(o => o.status === status)
  }
  
  // 创建订单
  const createOrder = (orderData) => {
    const order = {
      id: `${Date.now()}`,
      status: 'pending',
      createTime: new Date().toLocaleString('zh-CN'),
      ...orderData
    }
    orders.value.unshift(order)
    saveToStorage()
    return order
  }
  
  // 更新订单状态
  const updateOrderStatus = (orderId, status) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = status
      saveToStorage()
    }
  }
  
  // 删除订单
  const deleteOrder = (orderId) => {
    const index = orders.value.findIndex(o => o.id === orderId)
    if (index !== -1) {
      orders.value.splice(index, 1)
      saveToStorage()
    }
  }
  
  return {
    orders,
    getOrdersByStatus,
    createOrder,
    updateOrderStatus,
    deleteOrder
  }
})
