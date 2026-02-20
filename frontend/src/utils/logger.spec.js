/**
 * 日志工具单元测试
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createModuleLogger, getLogHistory, clearLogHistory, exportLogs, logger } from './logger'

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearLogHistory()
  })

  describe('createModuleLogger', () => {
    it('应该创建带模块名的logger', () => {
      const moduleLogger = createModuleLogger('TestModule')
      
      expect(moduleLogger).toBeDefined()
      expect(typeof moduleLogger.info).toBe('function')
      expect(typeof moduleLogger.warn).toBe('function')
      expect(typeof moduleLogger.error).toBe('function')
      expect(typeof moduleLogger.debug).toBe('function')
    })

    it('logger应该有action方法', () => {
      const moduleLogger = createModuleLogger('Test')
      expect(typeof moduleLogger.action).toBe('function')
    })

    it('logger应该有pageView方法', () => {
      const moduleLogger = createModuleLogger('Test')
      expect(typeof moduleLogger.pageView).toBe('function')
    })
  })

  describe('默认logger', () => {
    it('应该导出默认logger', () => {
      expect(logger).toBeDefined()
      expect(typeof logger.info).toBe('function')
    })
  })

  describe('getLogHistory', () => {
    it('应该返回日志历史数组', () => {
      const history = getLogHistory()
      expect(Array.isArray(history)).toBe(true)
    })
  })

  describe('clearLogHistory', () => {
    it('应该清空日志历史', () => {
      clearLogHistory()
      const history = getLogHistory()
      expect(history.length).toBe(0)
    })
  })

  describe('exportLogs', () => {
    it('应该返回JSON字符串', () => {
      const exported = exportLogs()
      expect(typeof exported).toBe('string')
      expect(() => JSON.parse(exported)).not.toThrow()
    })
  })
})
