/**
 * 图片预加载工具
 * 提升图片加载性能
 */

// 已预加载的图片缓存
const preloadedImages = new Set()

/**
 * 预加载单张图片
 */
export const preloadImage = (src) => {
  if (!src || preloadedImages.has(src)) return Promise.resolve()
  
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      preloadedImages.add(src)
      resolve()
    }
    img.onerror = resolve
    img.src = src
  })
}

/**
 * 批量预加载图片
 */
export const preloadImages = (sources) => {
  return Promise.all(sources.map(preloadImage))
}

/**
 * 预加载下一页图片（用于列表滚动）
 */
export const preloadNextPageImages = (products, startIndex, count = 4) => {
  const nextProducts = products.slice(startIndex, startIndex + count)
  const sources = nextProducts.map(p => p.image)
  return preloadImages(sources)
}

/**
 * 使用 Intersection Observer 预加载即将进入视口的图片
 */
export const createImagePreloader = (options = {}) => {
  const { rootMargin = '200px', threshold = 0 } = options
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        const src = img.dataset.preload
        if (src) {
          preloadImage(src)
          observer.unobserve(img)
        }
      }
    })
  }, { rootMargin, threshold })
  
  return {
    observe: (el) => observer.observe(el),
    disconnect: () => observer.disconnect()
  }
}

/**
 * 根据网络状况选择图片质量
 */
export const getOptimalImageSize = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  
  if (connection) {
    // 慢速网络使用小图
    if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return 'small' // 400px
    }
    // 3G使用中等图
    if (connection.effectiveType === '3g') {
      return 'medium' // 400px
    }
  }
  
  // 4G/WiFi使用大图
  return 'large' // 800px
}

/**
 * 获取适合当前网络的图片URL
 */
export const getAdaptiveImageUrl = (baseUrl, size = 'auto') => {
  if (size === 'auto') {
    size = getOptimalImageSize()
  }
  
  // 根据尺寸替换URL中的尺寸标识
  if (size === 'small' || size === 'medium') {
    return baseUrl.replace('-800.', '-400.')
  }
  return baseUrl
}

/**
 * 预加载关键路径图片
 */
export const preloadCriticalImages = async () => {
  // 首屏关键图片
  const criticalImages = [
    '/images/banners/banner1.jpg',
    '/images/products/apple-400.jpg',
    '/images/products/banana-400.jpg',
    '/images/products/cherry-400.jpg',
    '/images/products/orange-400.jpg'
  ]
  
  await preloadImages(criticalImages)
}

export default {
  preloadImage,
  preloadImages,
  preloadNextPageImages,
  createImagePreloader,
  getOptimalImageSize,
  getAdaptiveImageUrl,
  preloadCriticalImages
}
