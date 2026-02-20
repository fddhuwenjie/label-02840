/**
 * 校验工具单元测试
 */
import { describe, it, expect } from 'vitest'
import {
  validatePhone,
  validatePassword,
  validateUsername,
  validateName,
  validateAddress,
  validateQuantity,
  validatePrice,
  validateSearchKeyword,
  validateRequired,
  validateAll,
  escapeHtml,
  safeJsonParse
} from './validator'

describe('validatePhone', () => {
  it('应该拒绝空手机号', () => {
    expect(validatePhone('')).toEqual({ valid: false, message: '请输入手机号' })
    expect(validatePhone(null)).toEqual({ valid: false, message: '请输入手机号' })
  })

  it('应该拒绝非数字手机号', () => {
    expect(validatePhone('1380013800a').valid).toBe(false)
  })

  it('应该拒绝非11位手机号', () => {
    expect(validatePhone('1380013').valid).toBe(false)
    expect(validatePhone('138001380001').valid).toBe(false)
  })

  it('应该拒绝非1开头的手机号', () => {
    expect(validatePhone('28800138000').valid).toBe(false)
  })

  it('应该接受有效手机号', () => {
    const result = validatePhone('13800138000')
    expect(result.valid).toBe(true)
    expect(result.value).toBe('13800138000')
  })

  it('应该去除首尾空格', () => {
    const result = validatePhone('  13800138000  ')
    expect(result.valid).toBe(true)
    expect(result.value).toBe('13800138000')
  })
})

describe('validatePassword', () => {
  it('应该拒绝空密码', () => {
    expect(validatePassword('').valid).toBe(false)
  })

  it('应该拒绝过短密码', () => {
    expect(validatePassword('12345').valid).toBe(false)
  })

  it('应该拒绝过长密码', () => {
    expect(validatePassword('a'.repeat(21)).valid).toBe(false)
  })

  it('应该接受有效密码', () => {
    expect(validatePassword('password123').valid).toBe(true)
  })

  it('应该支持自定义选项', () => {
    expect(validatePassword('abc', { minLength: 3 }).valid).toBe(true)
    expect(validatePassword('abcdef', { requireNumber: true }).valid).toBe(false)
    expect(validatePassword('abcdef', { requireLetter: true }).valid).toBe(true)
  })
})

describe('validateUsername', () => {
  it('应该拒绝空用户名', () => {
    expect(validateUsername('').valid).toBe(false)
  })

  it('应该拒绝过短用户名', () => {
    expect(validateUsername('a').valid).toBe(false)
  })

  it('应该拒绝纯数字用户名', () => {
    expect(validateUsername('12345').valid).toBe(false)
  })

  it('应该接受有效用户名', () => {
    expect(validateUsername('user123').valid).toBe(true)
  })
})

describe('validateQuantity', () => {
  it('应该拒绝非数字', () => {
    expect(validateQuantity('abc').valid).toBe(false)
  })

  it('应该拒绝小数', () => {
    expect(validateQuantity(1.5).valid).toBe(false)
  })

  it('应该拒绝超出范围的数量', () => {
    expect(validateQuantity(0).valid).toBe(false)
    expect(validateQuantity(100).valid).toBe(false)
  })

  it('应该接受有效数量', () => {
    const result = validateQuantity(5)
    expect(result.valid).toBe(true)
    expect(result.value).toBe(5)
  })

  it('应该支持自定义范围', () => {
    expect(validateQuantity(0, { min: 0 }).valid).toBe(true)
    expect(validateQuantity(100, { max: 100 }).valid).toBe(true)
  })
})

describe('validatePrice', () => {
  it('应该拒绝非数字', () => {
    expect(validatePrice('abc').valid).toBe(false)
  })

  it('应该拒绝负数', () => {
    expect(validatePrice(-1).valid).toBe(false)
  })

  it('应该接受有效价格并保留两位小数', () => {
    const result = validatePrice(19.999)
    expect(result.valid).toBe(true)
    expect(result.value).toBe(20)
  })
})

describe('validateSearchKeyword', () => {
  it('应该拒绝空关键词', () => {
    expect(validateSearchKeyword('').valid).toBe(false)
    expect(validateSearchKeyword('   ').valid).toBe(false)
  })

  it('应该过滤特殊字符', () => {
    const result = validateSearchKeyword('苹果<script>')
    expect(result.valid).toBe(true)
    expect(result.value).toBe('苹果script')
  })
})

describe('validateAll', () => {
  it('应该返回所有校验结果', () => {
    const result = validateAll({
      phone: validatePhone('13800138000'),
      password: validatePassword('123456')
    })
    expect(result.valid).toBe(true)
    expect(result.values.phone).toBe('13800138000')
  })

  it('应该收集所有错误', () => {
    const result = validateAll({
      phone: validatePhone(''),
      password: validatePassword('')
    })
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBe(2)
  })
})

describe('escapeHtml', () => {
  it('应该转义HTML特殊字符', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;')
    expect(escapeHtml('"test"')).toBe('&quot;test&quot;')
  })

  it('应该处理空值', () => {
    expect(escapeHtml('')).toBe('')
    expect(escapeHtml(null)).toBe('')
  })
})

describe('safeJsonParse', () => {
  it('应该解析有效JSON', () => {
    expect(safeJsonParse('{"a":1}')).toEqual({ a: 1 })
  })

  it('应该返回默认值当JSON无效时', () => {
    expect(safeJsonParse('invalid', [])).toEqual([])
  })
})
