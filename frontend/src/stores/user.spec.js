/**
 * 用户Store单元测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './user'

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: vi.fn((key) => localStorageMock.store[key] || null),
  setItem: vi.fn((key, value) => { localStorageMock.store[key] = value }),
  removeItem: vi.fn((key) => { delete localStorageMock.store[key] }),
  clear: vi.fn(() => { localStorageMock.store = {} })
}
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

describe('UserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('login', () => {
    it('应该成功登录有效用户', async () => {
      const user = useUserStore()
      const loginPromise = user.login('test', '123456')
      
      vi.advanceTimersByTime(500)
      const result = await loginPromise
      
      expect(result.success).toBe(true)
      expect(user.isLoggedIn).toBe(true)
      expect(user.username).toBe('test')
    })

    it('应该拒绝无效凭据', async () => {
      const user = useUserStore()
      const loginPromise = user.login('test', 'wrongpassword')
      
      vi.advanceTimersByTime(500)
      
      await expect(loginPromise).rejects.toEqual({
        success: false,
        message: '用户名或密码错误'
      })
    })

    it('登录后应该持久化到localStorage', async () => {
      const user = useUserStore()
      const loginPromise = user.login('test', '123456')
      
      vi.advanceTimersByTime(500)
      await loginPromise
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('userInfo', expect.any(String))
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', expect.any(String))
    })
  })

  describe('register', () => {
    it('应该成功注册新用户', async () => {
      const user = useUserStore()
      const registerPromise = user.register({
        username: 'newuser',
        password: 'password123',
        phone: '13800000000'
      })
      
      vi.advanceTimersByTime(500)
      const result = await registerPromise
      
      expect(result.success).toBe(true)
      expect(result.message).toBe('注册成功')
    })

    it('应该拒绝已存在的用户名', async () => {
      const user = useUserStore()
      const registerPromise = user.register({
        username: 'test', // 已存在
        password: 'password123'
      })
      
      vi.advanceTimersByTime(500)
      
      await expect(registerPromise).rejects.toEqual({
        success: false,
        message: '用户名已存在'
      })
    })
  })

  describe('logout', () => {
    it('应该清除用户状态', async () => {
      const user = useUserStore()
      
      // 先登录
      const loginPromise = user.login('test', '123456')
      vi.advanceTimersByTime(500)
      await loginPromise
      
      expect(user.isLoggedIn).toBe(true)
      
      // 登出
      user.logout()
      
      expect(user.isLoggedIn).toBe(false)
      expect(user.username).toBe('')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userInfo')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
    })
  })

  describe('updateUserInfo', () => {
    it('应该更新用户信息', async () => {
      const user = useUserStore()
      
      // 先登录
      const loginPromise = user.login('test', '123456')
      vi.advanceTimersByTime(500)
      await loginPromise
      
      user.updateUserInfo({ avatar: 'new-avatar.jpg' })
      
      expect(user.avatar).toBe('new-avatar.jpg')
    })
  })

  describe('computed properties', () => {
    it('未登录时isLoggedIn应为false', () => {
      const user = useUserStore()
      expect(user.isLoggedIn).toBe(false)
    })

    it('未登录时username应为空', () => {
      const user = useUserStore()
      expect(user.username).toBe('')
    })
  })
})
