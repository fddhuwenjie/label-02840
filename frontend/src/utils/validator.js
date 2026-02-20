/**
 * 输入校验工具
 * 提供完善的边界条件处理
 */

// 手机号校验
export const validatePhone = (phone) => {
  if (!phone) return { valid: false, message: '请输入手机号' }
  const trimmed = phone.trim()
  if (!/^\d+$/.test(trimmed)) return { valid: false, message: '手机号只能包含数字' }
  if (trimmed.length !== 11) return { valid: false, message: '手机号必须是11位' }
  if (!/^1[3-9]/.test(trimmed)) return { valid: false, message: '请输入有效的手机号' }
  return { valid: true, value: trimmed }
}

// 密码校验
export const validatePassword = (password, options = {}) => {
  const { minLength = 6, maxLength = 20, requireNumber = false, requireLetter = false } = options
  if (!password) return { valid: false, message: '请输入密码' }
  if (password.length < minLength) return { valid: false, message: `密码至少${minLength}位` }
  if (password.length > maxLength) return { valid: false, message: `密码最多${maxLength}位` }
  if (requireNumber && !/\d/.test(password)) return { valid: false, message: '密码需包含数字' }
  if (requireLetter && !/[a-zA-Z]/.test(password)) return { valid: false, message: '密码需包含字母' }
  return { valid: true, value: password }
}

// 用户名校验
export const validateUsername = (username) => {
  if (!username) return { valid: false, message: '请输入用户名' }
  const trimmed = username.trim()
  if (trimmed.length < 2) return { valid: false, message: '用户名至少2个字符' }
  if (trimmed.length > 20) return { valid: false, message: '用户名最多20个字符' }
  if (/^\d+$/.test(trimmed)) return { valid: false, message: '用户名不能是纯数字' }
  return { valid: true, value: trimmed }
}

// 姓名校验
export const validateName = (name) => {
  if (!name) return { valid: false, message: '请输入姓名' }
  const trimmed = name.trim()
  if (trimmed.length < 2) return { valid: false, message: '姓名至少2个字符' }
  if (trimmed.length > 20) return { valid: false, message: '姓名最多20个字符' }
  if (/[<>'"&]/.test(trimmed)) return { valid: false, message: '姓名包含非法字符' }
  return { valid: true, value: trimmed }
}

// 地址校验
export const validateAddress = (address) => {
  if (!address) return { valid: false, message: '请输入地址' }
  const trimmed = address.trim()
  if (trimmed.length < 5) return { valid: false, message: '地址至少5个字符' }
  if (trimmed.length > 100) return { valid: false, message: '地址最多100个字符' }
  return { valid: true, value: trimmed }
}

// 数量校验
export const validateQuantity = (quantity, options = {}) => {
  const { min = 1, max = 99 } = options
  const num = Number(quantity)
  if (isNaN(num)) return { valid: false, message: '请输入有效数量' }
  if (!Number.isInteger(num)) return { valid: false, message: '数量必须是整数' }
  if (num < min) return { valid: false, message: `数量不能小于${min}` }
  if (num > max) return { valid: false, message: `数量不能超过${max}` }
  return { valid: true, value: num }
}

// 价格校验
export const validatePrice = (price) => {
  const num = Number(price)
  if (isNaN(num)) return { valid: false, message: '请输入有效价格' }
  if (num < 0) return { valid: false, message: '价格不能为负数' }
  if (num > 999999) return { valid: false, message: '价格超出范围' }
  return { valid: true, value: Math.round(num * 100) / 100 }
}

// 搜索关键词校验
export const validateSearchKeyword = (keyword) => {
  if (!keyword) return { valid: false, message: '请输入搜索内容' }
  const trimmed = keyword.trim()
  if (trimmed.length === 0) return { valid: false, message: '请输入搜索内容' }
  if (trimmed.length > 50) return { valid: false, message: '搜索内容过长' }
  // 过滤特殊字符防止注入
  const sanitized = trimmed.replace(/[<>'"&\\]/g, '')
  return { valid: true, value: sanitized }
}

// 通用非空校验
export const validateRequired = (value, fieldName = '此项') => {
  if (value === null || value === undefined) return { valid: false, message: `${fieldName}不能为空` }
  if (typeof value === 'string' && value.trim() === '') return { valid: false, message: `${fieldName}不能为空` }
  if (Array.isArray(value) && value.length === 0) return { valid: false, message: `请选择${fieldName}` }
  return { valid: true, value }
}

// 批量校验
export const validateAll = (validations) => {
  const errors = []
  const values = {}
  
  for (const [field, result] of Object.entries(validations)) {
    if (!result.valid) {
      errors.push({ field, message: result.message })
    } else {
      values[field] = result.value
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    values,
    firstError: errors[0]?.message
  }
}

// XSS 防护 - 转义 HTML
export const escapeHtml = (str) => {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// 安全的 JSON 解析
export const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str)
  } catch {
    return defaultValue
  }
}
