/**
 * 用户状态管理
 * 管理用户登录状态、用户信息和认证相关操作
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))
  
  // 登录令牌
  const token = ref(localStorage.getItem('token') || '')
  
  // 是否已登录
  const isLoggedIn = computed(() => !!token.value)
  
  // 用户名
  const username = computed(() => userInfo.value?.username || '')
  
  // 用户头像
  const avatar = computed(() => userInfo.value?.avatar || '')
  
  /**
   * 模拟用户数据库（实际项目中应该从后端获取）
   */
  const mockUsers = ref(JSON.parse(localStorage.getItem('mockUsers') || JSON.stringify([
    { id: 1, username: 'test', password: '123456', phone: '13800138000', avatar: '' },
    { id: 2, username: 'admin', password: 'admin123', phone: '13900139000', avatar: '' }
  ])))
  
  /**
   * 用户登录
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise} 登录结果
   */
  const login = (loginUsername, password) => {
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        const user = mockUsers.value.find(
          u => u.username === loginUsername && u.password === password
        )
        
        if (user) {
          // 登录成功
          const userData = { ...user }
          delete userData.password
          
          userInfo.value = userData
          token.value = `token_${Date.now()}_${user.id}`
          
          // 持久化存储
          localStorage.setItem('userInfo', JSON.stringify(userData))
          localStorage.setItem('token', token.value)
          
          resolve({ success: true, message: '登录成功', data: userData })
        } else {
          reject({ success: false, message: '用户名或密码错误' })
        }
      }, 500)
    })
  }
  
  /**
   * 用户注册
   * @param {Object} userData - 用户注册信息
   * @returns {Promise} 注册结果
   */
  const register = (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 检查用户名是否已存在
        const exists = mockUsers.value.some(u => u.username === userData.username)
        
        if (exists) {
          reject({ success: false, message: '用户名已存在' })
          return
        }
        
        // 创建新用户
        const newUser = {
          id: Date.now(),
          username: userData.username,
          password: userData.password,
          phone: userData.phone || '',
          avatar: ''
        }
        
        mockUsers.value.push(newUser)
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers.value))
        
        resolve({ success: true, message: '注册成功' })
      }, 500)
    })
  }
  
  /**
   * 用户登出
   */
  const logout = () => {
    userInfo.value = null
    token.value = ''
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
  }
  
  /**
   * 更新用户信息
   * @param {Object} data - 要更新的用户信息
   */
  const updateUserInfo = (data) => {
    userInfo.value = { ...userInfo.value, ...data }
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }
  
  return {
    userInfo,
    token,
    isLoggedIn,
    username,
    avatar,
    login,
    register,
    logout,
    updateUserInfo
  }
})
