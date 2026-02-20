<template>
  <div class="lazy-image-wrapper" :style="wrapperStyle">
    <!-- 低质量占位图 -->
    <div v-if="!loaded" class="placeholder" :style="placeholderStyle"></div>
    <!-- 实际图片 -->
    <img
      ref="imgRef"
      :src="isInView ? currentSrc : ''"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      :decoding="eager ? 'sync' : 'async'"
      :fetchpriority="priority"
      class="lazy-image"
      :class="{ loaded }"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  aspectRatio: { type: String, default: '1' },
  radius: { type: String, default: '12px' },
  // 是否立即加载（首屏图片）
  eager: { type: Boolean, default: false },
  // 加载优先级
  priority: { type: String, default: 'auto', validator: v => ['high', 'low', 'auto'].includes(v) },
  // 占位图背景色
  placeholderColor: { type: String, default: '' }
})

const imgRef = ref(null)
const loaded = ref(false)
const isInView = ref(props.eager)
let observer = null

const wrapperStyle = computed(() => ({
  aspectRatio: props.aspectRatio,
  borderRadius: props.radius
}))

const placeholderStyle = computed(() => ({
  backgroundColor: props.placeholderColor || 'var(--bg-tertiary)'
}))

// 根据网络状况选择图片尺寸
const currentSrc = computed(() => {
  if (!props.src) return ''
  
  // 检测网络状况
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  const isSlowNetwork = connection && (
    connection.saveData || 
    connection.effectiveType === 'slow-2g' || 
    connection.effectiveType === '2g' ||
    connection.effectiveType === '3g'
  )
  
  // 慢网络使用400px小图
  if (isSlowNetwork && props.src.includes('-800.')) {
    return props.src.replace('-800.', '-400.')
  }
  
  return props.src
})

const onLoad = () => {
  loaded.value = true
}

const onError = () => {
  loaded.value = true
}

onMounted(() => {
  if (props.eager) {
    isInView.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isInView.value = true
          observer?.disconnect()
        }
      })
    },
    { rootMargin: '300px' } // 提前300px开始加载
  )
  
  if (imgRef.value?.parentElement) {
    observer.observe(imgRef.value.parentElement)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style lang="scss" scoped>
.lazy-image-wrapper {
  position: relative;
  overflow: hidden;
  background: var(--bg-secondary);
  contain: layout style paint; /* 性能优化 */
}

.placeholder {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 0%,
    var(--bg-tertiary) 50%,
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.2s ease-out;
  will-change: opacity; /* 性能优化 */
  
  &.loaded {
    opacity: 1;
  }
}
</style>
