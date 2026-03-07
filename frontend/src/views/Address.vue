<template>
  <!-- 收货地址页面 -->
  <div class="address-page">
    <!-- 顶部导航 -->
    <van-nav-bar 
      title="收货地址" 
      left-arrow 
      @click-left="goBack"
    />
    
    <!-- 地址列表 -->
    <div class="address-list">
      <div 
        v-for="address in addresses" 
        :key="address.id"
        class="address-item"
        :class="{ selected: isSelectMode && selectedId === address.id }"
        @click="handleAddressClick(address)"
      >
        <div class="address-content">
          <div class="contact">
            <span class="name">{{ address.name }}</span>
            <span class="phone">{{ address.phone }}</span>
          </div>
          <div class="address">{{ address.fullAddress }}</div>
        </div>
        <van-icon name="edit" class="edit-icon" @click.stop="editAddress(address)" />
      </div>
    </div>
    
    <!-- 空状态 -->
    <van-empty v-if="addresses.length === 0" description="暂无收货地址" />
    
    <!-- 添加地址按钮 -->
    <div class="add-btn-wrapper">
      <van-button type="success" block round @click="showAddForm">新增收货地址</van-button>
    </div>
    
    <!-- 添加/编辑地址弹窗 -->
    <van-popup 
      v-model:show="showForm" 
      position="bottom" 
      round
      :style="{ maxHeight: '80%' }"
    >
      <div class="form-popup">
        <div class="form-header">
          <span>{{ editingAddress ? '编辑地址' : '新增地址' }}</span>
          <van-icon name="cross" @click="showForm = false" />
        </div>
        
        <van-form @submit="handleSubmit">
          <van-cell-group inset>
            <van-field
              v-model="formData.name"
              label="收货人"
              placeholder="请输入收货人姓名"
              :rules="[{ required: true, message: '请输入收货人姓名' }]"
            />
            <van-field
              v-model="formData.phone"
              label="手机号"
              type="tel"
              maxlength="11"
              placeholder="请输入手机号"
              :rules="[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
              ]"
            />
            <van-field
              v-model="formData.area"
              label="所在地区"
              placeholder="请选择所在地区"
              readonly
              is-link
              @click="showAreaPicker = true"
              :rules="[{ required: true, message: '请选择所在地区' }]"
            />
            <van-field
              v-model="formData.detail"
              label="详细地址"
              placeholder="请输入详细地址"
              :rules="[{ required: true, message: '请输入详细地址' }]"
            />
          </van-cell-group>
          
          <div class="form-actions">
            <van-button type="success" block round native-type="submit">保存</van-button>
            <van-button 
              v-if="editingAddress" 
              type="default" 
              block 
              round 
              @click="deleteAddress"
            >
              删除地址
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
    
    <!-- 地区选择器 -->
    <van-popup v-model:show="showAreaPicker" position="bottom" round>
      <van-area
        title="选择地区"
        :area-list="areaList"
        @confirm="onAreaConfirm"
        @cancel="showAreaPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
/**
 * 收货地址页面组件
 * 管理用户的收货地址
 */
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { showError } from '@/utils/errorHandler'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 获取当前用户的存储key
const getStorageKey = () => {
  const userId = userStore.userInfo?.id || 'guest'
  return `addresses_${userId}`
}

// 是否选择模式
const isSelectMode = computed(() => route.query.select === '1')

// 选中的地址ID
const selectedId = ref(null)

// 地址列表
const addresses = ref([])

// 加载当前用户的地址
const loadAddresses = () => {
  const key = getStorageKey()
  addresses.value = JSON.parse(localStorage.getItem(key) || '[]')
}

// 监听用户变化
watch(() => userStore.userInfo?.id, () => {
  loadAddresses()
}, { immediate: true })

// 显示表单弹窗
const showForm = ref(false)

// 显示地区选择器
const showAreaPicker = ref(false)

// 正在编辑的地址
const editingAddress = ref(null)

// 表单数据
const formData = reactive({
  name: '',
  phone: '',
  area: '',
  areaCode: '',
  detail: ''
})

// 简化的地区数据
const areaList = {
  province_list: {
    '110000': '北京市',
    '310000': '上海市',
    '440000': '广东省',
    '330000': '浙江省',
    '320000': '江苏省'
  },
  city_list: {
    '110100': '北京市',
    '310100': '上海市',
    '440100': '广州市',
    '440300': '深圳市',
    '330100': '杭州市',
    '320100': '南京市'
  },
  county_list: {
    '110101': '东城区',
    '110102': '西城区',
    '110105': '朝阳区',
    '110106': '丰台区',
    '310101': '黄浦区',
    '310104': '徐汇区',
    '440103': '荔湾区',
    '440104': '越秀区',
    '440305': '南山区',
    '440306': '宝安区',
    '330102': '上城区',
    '330103': '下城区',
    '320102': '玄武区',
    '320104': '秦淮区'
  }
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 处理地址点击
const handleAddressClick = (address) => {
  if (isSelectMode.value) {
    selectedId.value = address.id
    localStorage.setItem('selectedAddress', JSON.stringify(address))
    router.back()
  }
}

// 显示添加表单
const showAddForm = () => {
  editingAddress.value = null
  Object.assign(formData, {
    name: '',
    phone: '',
    area: '',
    areaCode: '',
    detail: ''
  })
  showForm.value = true
}

// 编辑地址
const editAddress = (address) => {
  editingAddress.value = address
  Object.assign(formData, {
    name: address.name,
    phone: address.phone,
    area: address.area,
    areaCode: address.areaCode,
    detail: address.detail
  })
  showForm.value = true
}

// 地区选择确认
const onAreaConfirm = ({ selectedOptions }) => {
  formData.area = selectedOptions.map(item => item.text).join(' ')
  formData.areaCode = selectedOptions[selectedOptions.length - 1].value
  showAreaPicker.value = false
}

// 保存地址
const handleSubmit = () => {
  try {
    const addressData = {
      id: editingAddress.value?.id || Date.now(),
      name: formData.name,
      phone: formData.phone,
      area: formData.area,
      areaCode: formData.areaCode,
      detail: formData.detail,
      fullAddress: `${formData.area} ${formData.detail}`
    }
    
    if (editingAddress.value) {
      const index = addresses.value.findIndex(addr => addr.id === editingAddress.value.id)
      if (index !== -1) {
        addresses.value[index] = addressData
      }
    } else {
      addresses.value.push(addressData)
    }
    
    const key = getStorageKey()
    localStorage.setItem(key, JSON.stringify(addresses.value))
    showForm.value = false
    showToast('保存成功')
  } catch (e) {
    showError(e, '保存失败，请重试')
  }
}

// 删除地址
const deleteAddress = async () => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: '确定要删除这个地址吗？',
      confirmButtonColor: '#2eb872'
    })
    
    addresses.value = addresses.value.filter(addr => addr.id !== editingAddress.value.id)
    const key = getStorageKey()
    localStorage.setItem(key, JSON.stringify(addresses.value))
    showForm.value = false
    showToast('删除成功')
  } catch (e) {
    if (e !== 'cancel' && e?.message !== 'cancel') {
      showError(e, '删除失败，请重试')
    }
  }
}

// 初始化选中状态
onMounted(() => {
  const selected = JSON.parse(localStorage.getItem('selectedAddress') || 'null')
  if (selected) {
    selectedId.value = selected.id
  }
})
</script>

<style lang="scss" scoped>
.address-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

// 地址列表
.address-list {
  padding: 12px;
}

.address-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  
  &.selected {
    border: 2px solid #07c160;
  }
}

.address-content {
  flex: 1;
  min-width: 0;
}

.contact {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  
  .name {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
  
  .phone {
    font-size: 14px;
    color: #666;
  }
}

.address {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.edit-icon {
  font-size: 20px;
  color: #999;
  padding: 8px;
}

// 添加按钮
.add-btn-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  
  @media screen and (min-width: 768px) {
    width: 640px;
    left: 50%;
    right: auto;
    margin-left: -320px;
  }
}

// 表单弹窗
.form-popup {
  padding-bottom: env(safe-area-inset-bottom);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #f5f5f5;
}

.form-actions {
  padding: 16px;
  padding-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
