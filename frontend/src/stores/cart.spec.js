/**
 * 购物车Store单元测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from './cart'

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: vi.fn((key) => localStorageMock.store[key] || null),
  setItem: vi.fn((key, value) => { localStorageMock.store[key] = value }),
  clear: vi.fn(() => { localStorageMock.store = {} })
}
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

describe('CartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
    localStorageMock.store = {}
  })

  describe('addItem', () => {
    it('应该添加新商品到购物车', () => {
      const cart = useCartStore()
      const product = { id: 1, name: '苹果', price: 10, image: '/apple.jpg' }
      
      cart.addItem(product, 2)
      
      expect(cart.items.length).toBe(1)
      expect(cart.items[0].id).toBe(1)
      expect(cart.items[0].quantity).toBe(2)
    })

    it('应该增加已存在商品的数量', () => {
      const cart = useCartStore()
      const product = { id: 1, name: '苹果', price: 10, image: '/apple.jpg' }
      
      cart.addItem(product, 2)
      cart.addItem(product, 3)
      
      expect(cart.items.length).toBe(1)
      expect(cart.items[0].quantity).toBe(5)
    })

    it('应该拒绝无效商品', () => {
      const cart = useCartStore()
      
      expect(() => cart.addItem(null)).toThrow('商品信息无效')
      expect(() => cart.addItem({})).toThrow('商品信息无效')
    })

    it('应该拒绝超出最大数量', () => {
      const cart = useCartStore()
      const product = { id: 1, name: '苹果', price: 10, image: '/apple.jpg' }
      
      cart.addItem(product, 50)
      expect(() => cart.addItem(product, 50)).toThrow('单个商品最多购买99件')
    })
  })

  describe('removeItem', () => {
    it('应该从购物车移除商品', () => {
      const cart = useCartStore()
      const product = { id: 1, name: '苹果', price: 10, image: '/apple.jpg' }
      
      cart.addItem(product)
      cart.removeItem(1)
      
      expect(cart.items.length).toBe(0)
    })
  })

  describe('updateQuantity', () => {
    it('应该更新商品数量', () => {
      const cart = useCartStore()
      const product = { id: 1, name: '苹果', price: 10, image: '/apple.jpg' }
      
      cart.addItem(product, 1)
      cart.updateQuantity(1, 5)
      
      expect(cart.items[0].quantity).toBe(5)
    })

    it('数量为0时应该移除商品', () => {
      const cart = useCartStore()
      const product = { id: 1, name: '苹果', price: 10, image: '/apple.jpg' }
      
      cart.addItem(product, 1)
      cart.updateQuantity(1, 0)
      
      expect(cart.items.length).toBe(0)
    })
  })

  describe('computed properties', () => {
    it('应该正确计算总数量', () => {
      const cart = useCartStore()
      cart.addItem({ id: 1, name: '苹果', price: 10, image: '/a.jpg' }, 2)
      cart.addItem({ id: 2, name: '香蕉', price: 5, image: '/b.jpg' }, 3)
      
      expect(cart.totalCount).toBe(5)
    })

    it('应该正确计算选中商品总价', () => {
      const cart = useCartStore()
      cart.addItem({ id: 1, name: '苹果', price: 10, image: '/a.jpg' }, 2)
      cart.addItem({ id: 2, name: '香蕉', price: 5, image: '/b.jpg' }, 3)
      
      // 默认全选
      expect(cart.totalPrice).toBe(35) // 10*2 + 5*3
    })

    it('应该正确判断全选状态', () => {
      const cart = useCartStore()
      cart.addItem({ id: 1, name: '苹果', price: 10, image: '/a.jpg' })
      cart.addItem({ id: 2, name: '香蕉', price: 5, image: '/b.jpg' })
      
      expect(cart.isAllSelected).toBe(true)
      
      cart.toggleSelect(1)
      expect(cart.isAllSelected).toBe(false)
    })
  })

  describe('toggleSelectAll', () => {
    it('应该切换全选状态', () => {
      const cart = useCartStore()
      cart.addItem({ id: 1, name: '苹果', price: 10, image: '/a.jpg' })
      cart.addItem({ id: 2, name: '香蕉', price: 5, image: '/b.jpg' })
      
      cart.toggleSelectAll() // 取消全选
      expect(cart.items.every(i => !i.selected)).toBe(true)
      
      cart.toggleSelectAll() // 全选
      expect(cart.items.every(i => i.selected)).toBe(true)
    })
  })

  describe('clearCart', () => {
    it('应该清空购物车', () => {
      const cart = useCartStore()
      cart.addItem({ id: 1, name: '苹果', price: 10, image: '/a.jpg' })
      cart.addItem({ id: 2, name: '香蕉', price: 5, image: '/b.jpg' })
      
      cart.clearCart()
      
      expect(cart.items.length).toBe(0)
    })
  })

  describe('removeSelected', () => {
    it('应该移除选中的商品', () => {
      const cart = useCartStore()
      cart.addItem({ id: 1, name: '苹果', price: 10, image: '/a.jpg' })
      cart.addItem({ id: 2, name: '香蕉', price: 5, image: '/b.jpg' })
      
      cart.toggleSelect(1) // 取消选中苹果
      cart.removeSelected()
      
      expect(cart.items.length).toBe(1)
      expect(cart.items[0].id).toBe(1)
    })
  })
})
