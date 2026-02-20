/**
 * 统一错误处理工具
 */
import { showToast, showDialog } from 'vant'
import { createModuleLogger } from './logger'

const logger = createModuleLogger('ErrorHandler')

// 错误类型
export const ErrorType = {
  NETWORK: 'network',
  TIMEOUT: 'timeout',
  SERVER: 'server',
  AUTH: 'auth',
  VALIDATION: 'validation',
  UNKNOWN: 'unknown'
}

// 错误消息映射
const errorMessages = {
  [ErrorType.NETWORK]: '网络连接失败，请检查网络设置',
  [ErrorType.TIMEOUT]: '请求超时，请稍后重试',
  [ErrorType.SERVER]: '服务器繁忙，请稍后重试',
  [ErrorType.AUTH]: '登录已过期，请重新登录',
  [ErrorType.VALIDATION]: '数据验证失败',
  [ErrorType.UNKNOWN]: '操作失败，请稍后重试'
}

/**
 * 判断错误类型
 */
export const getErrorType = (error) => {
  if (!navigator.onLine) return ErrorType.NETWORK
  if (error?.name === 'AbortError' || error?.code === 'ECONNABORTED') return ErrorType.TIMEOUT
  if (error?.response?.status >= 500) return ErrorType.SERVER
  if (error?.response?.status === 401 || error?.response?.status === 403) return ErrorType.AUTH
  if (error?.response?.status === 400 || error?.response?.status === 422) return ErrorType.VALIDATION
  return ErrorType.UNKNOWN
}

/**
 * 显示错误提示
 */
export const showError = (error, customMessage) => {
  const type = getErrorType(error)
  const message = customMessage || errorMessages[type]
  
  logger.error(message, error, { type })
  
  showToast({
    message,
    icon: 'warning-o',
    duration: 2500
  })
  
  return type
}

/**
 * 显示错误对话框（严重错误）
 */
export const showErrorDialog = async (title, message) => {
  try {
    await showDialog({
      title: title || '出错了',
      message: message || '操作失败，请稍后重试',
      confirmButtonText: '我知道了'
    })
  } catch {}
}

/**
 * 安全执行异步操作
 */
export const safeAsync = async (asyncFn, options = {}) => {
  const { 
    loading = null, 
    errorMessage = null,
    showErrorToast = true,
    onError = null 
  } = options
  
  try {
    if (loading) loading.value = true
    const result = await asyncFn()
    return { success: true, data: result }
  } catch (error) {
    if (showErrorToast) showError(error, errorMessage)
    if (onError) onError(error)
    return { success: false, error }
  } finally {
    if (loading) loading.value = false
  }
}

/**
 * 重试机制
 */
export const withRetry = async (asyncFn, maxRetries = 3, delay = 1000) => {
  let lastError
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await asyncFn()
    } catch (error) {
      lastError = error
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }
  
  throw lastError
}

/**
 * 全局错误处理器（Vue插件）
 */
export const errorHandlerPlugin = {
  install(app) {
    // 全局错误处理
    app.config.errorHandler = (error, instance, info) => {
      logger.error('Vue组件错误', error, { info, component: instance?.$options?.name })
      showError(error)
    }
    
    // Promise 未捕获错误
    window.addEventListener('unhandledrejection', (event) => {
      logger.error('未捕获的Promise错误', event.reason)
      event.preventDefault()
    })
    
    // JS 运行时错误
    window.addEventListener('error', (event) => {
      logger.error('运行时错误', event.error, { 
        message: event.message,
        filename: event.filename,
        lineno: event.lineno 
      })
    })
    
    // 网络状态监听
    window.addEventListener('offline', () => {
      logger.warn('网络已断开')
      showToast({
        message: '网络已断开',
        icon: 'warning-o',
        duration: 0
      })
    })
    
    window.addEventListener('online', () => {
      logger.info('网络已恢复')
      showToast({
        message: '网络已恢复',
        icon: 'success',
        duration: 1500
      })
    })
    
    logger.info('错误处理插件已初始化')
  }
}
