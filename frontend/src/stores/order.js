/**
 * 订单状态管理
 * 管理订单列表和订单操作
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOrderStore = defineStore('order', () => {
  // 订单列表
  const orders = ref(JSON.parse(localStorage.getItem('orders') || '[]'))
  
  // 保存到本地存储
  const saveToStorage = () => {
    localStorage.setItem('orders', JSON.stringify(orders.value))
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
