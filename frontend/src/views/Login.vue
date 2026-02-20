<template>
  <!-- 登录页面 - 高端时尚版 -->
  <div class="login-page">
    <!-- 顶部导航 -->
    <header class="login-header">
      <button class="back-btn" @click="goBack">
        <van-icon name="arrow-left" size="20" />
      </button>
    </header>
    
    <!-- Logo区域 -->
    <div class="logo-section">
      <div class="logo-wrapper">
        <span class="logo-icon">🌿</span>
      </div>
      <h1 class="brand-name font-display">FRESH</h1>
      <p class="brand-slogan">源自自然的馈赠</p>
    </div>
    
    <!-- 登录表单 -->
    <div class="form-section">
      <van-form @submit="handleLogin">
        <div class="input-group">
          <label class="input-label">用户名</label>
          <div class="input-wrapper">
            <input 
              v-model="formData.username"
              type="text"
              class="luxury-input"
              placeholder="请输入用户名"
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
              placeholder="请输入密码"
            />
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>
      </van-form>
      
      <!-- 其他操作 -->
      <div class="other-actions">
        <button class="link-btn" @click="goToRegister">新用户注册</button>
        <button class="link-btn">忘记密码</button>
      </div>
      
      <!-- 测试账号 -->
      <div class="test-account">
        <div class="divider">
          <span class="divider-line"></span>
          <span class="divider-text">测试账号</span>
          <span class="divider-line"></span>
        </div>
        <p>test / 123456</p>
        <p>admin / admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { useUserStore } from '@/stores/user'
import { createModuleLogger } from '@/utils/logger'
import { validateUsername, validatePassword, validateAll } from '@/utils/validator'
import { showError } from '@/utils/errorHandler'

const logger = createModuleLogger('Login')
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formData = reactive({ username: '', password: '' })
const loading = ref(false)

const goBack = () => router.back()
const goToRegister = () => router.push('/register')

const handleLogin = async () => {
  // 输入校验
  const validation = validateAll({
    username: validateUsername(formData.username),
    password: validatePassword(formData.password)
  })
  
  if (!validation.valid) {
    showToast(validation.firstError)
    logger.warn('登录校验失败', { error: validation.firstError })
    return
  }
  
  loading.value = true
  logger.action('用户登录', { username: validation.values.username })
  
  try {
    showLoadingToast({ message: '登录中...', forbidClick: true })
    await userStore.login(validation.values.username, validation.values.password)
    closeToast()
    
    logger.info('登录成功', { username: validation.values.username })
    showToast({ message: '登录成功', icon: 'success' })
    
    const redirect = route.query.redirect || '/'
    setTimeout(() => router.replace(redirect), 500)
  } catch (error) {
    closeToast()
    logger.error('登录失败', error, { username: validation.values.username })
    showError(error, error.message || '登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 0 24px;
}

.login-header {
  padding: 16px 0;
}

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

.logo-section {
  padding: 40px 0 60px;
  text-align: center;
}

.logo-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: var(--primary-color);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 40px rgba(26, 26, 26, 0.15);
}

.logo-icon { font-size: 40px; }

.brand-name {
  font-size: 28px;
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 0.2em;
  margin-bottom: 8px;
}

.brand-slogan {
  font-size: 13px;
  color: var(--text-muted);
  letter-spacing: 0.1em;
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

.login-btn {
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
  justify-content: space-between;
  padding: 16px 0;
}

.link-btn {
  font-size: 13px;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  
  &:active { color: var(--text-primary); }
}

.test-account {
  margin-top: 60px;
  text-align: center;
  
  p {
    font-size: 12px;
    color: var(--text-muted);
    margin: 6px 0;
    font-family: monospace;
  }
}

.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: var(--border-color);
}

.divider-text {
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>
