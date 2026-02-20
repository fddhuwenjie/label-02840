/**
 * 错误处理工具单元测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ErrorType, getErrorType, safeAsync, withRetry } from './errorHandler'

// Mock vant
vi.mock('vant', () => ({
  showToast: vi.fn(),
  showDialog: vi.fn()
}))

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', { value: true, writable: true })

describe('ErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('ErrorType', () => {
    it('应该包含所有错误类型', () => {
      expect(ErrorType.NETWORK).toBe('network')
      expect(ErrorType.TIMEOUT).toBe('timeout')
      expect(ErrorType.SERVER).toBe('server')
      expect(ErrorType.AUTH).toBe('auth')
      expect(ErrorType.VALIDATION).toBe('validation')
      expect(ErrorType.UNKNOWN).toBe('unknown')
    })
  })

  describe('getErrorType', () => {
    it('应该识别超时错误', () => {
      const error = { name: 'AbortError' }
      expect(getErrorType(error)).toBe(ErrorType.TIMEOUT)
    })

    it('应该识别服务器错误', () => {
      const error = { response: { status: 500 } }
      expect(getErrorType(error)).toBe(ErrorType.SERVER)
    })

    it('应该识别认证错误', () => {
      const error = { response: { status: 401 } }
      expect(getErrorType(error)).toBe(ErrorType.AUTH)
    })

    it('应该识别验证错误', () => {
      const error = { response: { status: 400 } }
      expect(getErrorType(error)).toBe(ErrorType.VALIDATION)
    })

    it('未知错误应返回UNKNOWN', () => {
      const error = { message: 'some error' }
      expect(getErrorType(error)).toBe(ErrorType.UNKNOWN)
    })
  })

  describe('safeAsync', () => {
    it('成功时应返回数据', async () => {
      const asyncFn = vi.fn().mockResolvedValue('success')
      const result = await safeAsync(asyncFn, { showErrorToast: false })
      
      expect(result.success).toBe(true)
      expect(result.data).toBe('success')
    })

    it('失败时应返回错误', async () => {
      const error = new Error('test error')
      const asyncFn = vi.fn().mockRejectedValue(error)
      const result = await safeAsync(asyncFn, { showErrorToast: false })
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(error)
    })

    it('应该管理loading状态', async () => {
      const loading = { value: false }
      const asyncFn = vi.fn().mockResolvedValue('done')
      
      await safeAsync(asyncFn, { loading, showErrorToast: false })
      
      expect(loading.value).toBe(false)
    })

    it('应该调用onError回调', async () => {
      const error = new Error('test')
      const onError = vi.fn()
      const asyncFn = vi.fn().mockRejectedValue(error)
      
      await safeAsync(asyncFn, { onError, showErrorToast: false })
      
      expect(onError).toHaveBeenCalledWith(error)
    })
  })

  describe('withRetry', () => {
    it('成功时应直接返回', async () => {
      const asyncFn = vi.fn().mockResolvedValue('success')
      const result = await withRetry(asyncFn, 3, 10)
      
      expect(result).toBe('success')
      expect(asyncFn).toHaveBeenCalledTimes(1)
    })

    it('失败后应重试', async () => {
      const asyncFn = vi.fn()
        .mockRejectedValueOnce(new Error('fail1'))
        .mockRejectedValueOnce(new Error('fail2'))
        .mockResolvedValue('success')
      
      const result = await withRetry(asyncFn, 3, 10)
      
      expect(result).toBe('success')
      expect(asyncFn).toHaveBeenCalledTimes(3)
    })

    it('超过重试次数应抛出错误', async () => {
      const error = new Error('persistent error')
      const asyncFn = vi.fn().mockRejectedValue(error)
      
      await expect(withRetry(asyncFn, 2, 10)).rejects.toThrow('persistent error')
      expect(asyncFn).toHaveBeenCalledTimes(2)
    })
  })
})

