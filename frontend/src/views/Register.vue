<template>
  <!-- 注册页面 - 高端时尚版 -->
  <div class="register-page">
    <!-- 顶部导航 -->
    <header class="register-header">
      <button class="back-btn" @click="goBack">
        <van-icon name="arrow-left" size="20" />
      </button>
    </header>
    
    <!-- 标题区域 -->
    <div class="title-section">
      <h1 class="page-title font-display">创建账户</h1>
      <p class="page-subtitle">加入我们，开启健康生活</p>
    </div>
    
    <!-- 注册表单 -->
    <div class="form-section">
      <van-form @submit="handleRegister">
        <div class="input-group">
          <label class="input-label">用户名</label>
          <div class="input-wrapper">
            <input 
              v-model="formData.username"
              type="text"
              class="luxury-input"
              placeholder="4-16位字母数字下划线"
            />
          </div>
        </div>
        
        <div class="input-group">
          <label class="input-label">手机号</label>
          <div class="input-wrapper">
            <input 
              v-model="formData.phone"
              type="tel"
              class="luxury-input"
              placeholder="请输入手机号"
            />
          </div>
        </div>
        
        <div class="input-group">
          <label class="input-label">密码</label>
          <div class="input-wrapper">
            <input 
              v-model="formData.password"
              type="password"
              class="luxury-input"
              placeholder="6-20位密码"
            />
          </div>
        </div>
        
        <div class="input-group">
          <label class="input-label">确认密码</label>
          <div class="input-wrapper">
            <input 
              v-model="formData.confirmPassword"
              type="password"
              class="luxury-input"
              placeholder="请再次输入密码"
            />
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="register-btn" :disabled="loading">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </div>
      </van-form>
      
      <!-- 其他操作 -->
      <div class="other-actions">
        <span class="hint-text">已有账号？</span>
        <button class="link-btn" @click="goToLogin">立即登录</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { useUserStore } from '@/stores/user'
import { createModuleLogger } from '@/utils/logger'
import { validateUsername, validatePassword, validatePhone, validateAll } from '@/utils/validator'
import { showError } from '@/utils/errorHandler'

const logger = createModuleLogger('Register')
const router = useRouter()
const userStore = useUserStore()

const formData = reactive({
  username: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)

const goBack = () => router.back()
const goToLogin = () => router.replace('/login')

const handleRegister = async () => {
  // 输入校验
  const validation = validateAll({
    username: validateUsername(formData.username),
    phone: validatePhone(formData.phone),
    password: validatePassword(formData.password, { minLength: 6 })
  })
  
  if (!validation.valid) {
    showToast(validation.firstError)
    logger.warn('注册校验失败', { error: validation.firstError })
    return
  }
  
  if (formData.password !== formData.confirmPassword) {
    showToast('两次密码输入不一致')
    logger.warn('注册校验失败', { error: '密码不一致' })
    return
  }
  
  loading.value = true
  logger.action('用户注册', { username: validation.values.username, phone: validation.values.phone })
  
  try {
    showLoadingToast({ message: '注册中...', forbidClick: true })
    await userStore.register({
      username: validation.values.username,
      phone: validation.values.phone,
      password: validation.values.password
    })
    closeToast()
    
    logger.info('注册成功', { username: validation.values.username })
    showToast({ message: '注册成功', icon: 'success' })
    setTimeout(() => router.replace('/login'), 500)
  } catch (error) {
    closeToast()
    logger.error('注册失败', error, { username: validation.values.username })
    showError(error, error.message || '注册失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 0 24px;
}

.register-header { padding: 16px 0; }

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 50%;
  color: var(--text-primary);
  cursor: pointer;
}

.title-section {
  padding: 20px 0 40px;
}

.page-title {
  font-size: 28px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-muted);
}

.form-section { max-width: 400px; margin: 0 auto; }

.input-group { margin-bottom: 24px; }

.input-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.input-wrapper {
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition-base);
  
  &:focus-within { border-color: var(--primary-color); }
}

.luxury-input {
  width: 100%;
  padding: 12px 0;
  font-size: 16px;
  color: var(--text-primary);
  background: transparent;
  border: none;
  outline: none;
  
  &::placeholder { color: var(--text-muted); }
}

.form-actions { padding: 20px 0; }

.register-btn {
  width: 100%;
  padding: 16px;
  background: var(--primary-color);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:not(:disabled):active { transform: scale(0.98); }
}

.other-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
}

.hint-text {
  font-size: 13px;
  color: var(--text-muted);
}

.link-btn {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}
</style>
