/**
 * 日志记录工具
 * 统一管理应用日志，便于问题定位
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

// 当前日志级别（生产环境只记录 WARN 及以上）
const currentLevel = import.meta.env.PROD ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG

// 日志存储（最近100条）
const logHistory = []
const MAX_LOG_SIZE = 100

// 格式化时间
const formatTime = () => {
  const now = new Date()
  return now.toLocaleTimeString('zh-CN', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0')
}

// 添加到历史记录
const addToHistory = (level, module, message, data) => {
  const entry = {
    time: formatTime(),
    level,
    module,
    message,
    data: data ? JSON.stringify(data).slice(0, 500) : null
  }
  logHistory.push(entry)
  if (logHistory.length > MAX_LOG_SIZE) {
    logHistory.shift()
  }
}

// 创建日志方法
const createLogger = (module = 'App') => ({
  debug(message, data) {
    if (currentLevel <= LOG_LEVELS.DEBUG) {
      console.log(`[${formatTime()}] [DEBUG] [${module}]`, message, data || '')
      addToHistory('DEBUG', module, message, data)
    }
  },
  
  info(message, data) {
    if (currentLevel <= LOG_LEVELS.INFO) {
      console.info(`[${formatTime()}] [INFO] [${module}]`, message, data || '')
      addToHistory('INFO', module, message, data)
    }
  },
  
  warn(message, data) {
    if (currentLevel <= LOG_LEVELS.WARN) {
      console.warn(`[${formatTime()}] [WARN] [${module}]`, message, data || '')
      addToHistory('WARN', module, message, data)
    }
  },
  
  error(message, error, data) {
    if (currentLevel <= LOG_LEVELS.ERROR) {
      console.error(`[${formatTime()}] [ERROR] [${module}]`, message, error, data || '')
      addToHistory('ERROR', module, message, { error: error?.message, stack: error?.stack, ...data })
    }
  },
  
  // 记录用户操作
  action(actionName, data) {
    this.info(`用户操作: ${actionName}`, data)
  },
  
  // 记录页面访问
  pageView(pageName) {
    this.info(`页面访问: ${pageName}`)
  }
})

// 获取日志历史
export const getLogHistory = () => [...logHistory]

// 清空日志
export const clearLogHistory = () => {
  logHistory.length = 0
}

// 导出日志（用于问题反馈）
export const exportLogs = () => {
  return JSON.stringify(logHistory, null, 2)
}

// 默认 logger
export const logger = createLogger()

// 创建模块专用 logger
export const createModuleLogger = createLogger

export default logger
