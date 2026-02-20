/**
 * 商品数据
 * 模拟商品数据库，包含所有商品信息
 */

// 商品分类
export const categories = [
  { id: 1, name: '新鲜水果', icon: '🍎', color: '#ff6b6b' },
  { id: 2, name: '时令蔬菜', icon: '🥬', color: '#51cf66' },
  { id: 3, name: '精选菌菇', icon: '🍄', color: '#be9b7b' },
  { id: 4, name: '豆制品', icon: '🫘', color: '#ffd43b' },
  { id: 5, name: '蛋禽肉类', icon: '🥚', color: '#ff922b' },
  { id: 6, name: '海鲜水产', icon: '🦐', color: '#339af0' },
  { id: 7, name: '粮油调味', icon: '🍚', color: '#f59f00' },
  { id: 8, name: '干货特产', icon: '🥜', color: '#c0392b' }
]

// 商品列表
export const products = [
  // 新鲜水果
  {
    id: 101,
    categoryId: 1,
    name: '红富士苹果',
    description: '山东烟台红富士，脆甜多汁，果香浓郁',
    price: 12.9,
    originalPrice: 18.9,
    unit: '500g',
    sales: 2856,
    stock: 999,
    image: '/images/products/apple-400.jpg',
    images: ['/images/products/apple-800.jpg'],
    tags: ['新鲜', '当季'],
    detail: '产地：山东烟台\n规格：500g/份\n储存方式：冷藏保存\n保质期：7天'
  },
  {
    id: 102,
    categoryId: 1,
    name: '进口香蕉',
    description: '菲律宾进口香蕉，软糯香甜，营养丰富',
    price: 8.9,
    originalPrice: 12.9,
    unit: '500g',
    sales: 3421,
    stock: 888,
    image: '/images/products/banana-400.jpg',
    images: ['/images/products/banana-800.jpg'],
    tags: ['进口', '热销'],
    detail: '产地：菲律宾\n规格：500g/份\n储存方式：常温保存\n保质期：5天'
  },
  {
    id: 104,
    categoryId: 1,
    name: '智利车厘子',
    description: 'JJ级大果，果肉饱满，酸甜可口',
    price: 59.9,
    originalPrice: 89.9,
    unit: '500g',
    sales: 986,
    stock: 150,
    image: '/images/products/cherry-400.jpg',
    images: ['/images/products/cherry-800.jpg'],
    tags: ['进口', '精选'],
    detail: '产地：智利\n规格：500g/份\n储存方式：冷藏保存\n保质期：5天'
  },
  {
    id: 105,
    categoryId: 1,
    name: '赣南脐橙',
    description: '江西赣南脐橙，皮薄多汁，酸甜适中',
    price: 15.9,
    originalPrice: 22.9,
    unit: '500g',
    sales: 2134,
    stock: 500,
    image: '/images/products/orange-400.jpg',
    images: ['/images/products/orange-800.jpg'],
    tags: ['当季', '热销'],
    detail: '产地：江西赣州\n规格：500g/份\n储存方式：常温保存\n保质期：15天'
  },
  
  // 时令蔬菜
  {
    id: 202,
    categoryId: 2,
    name: '新鲜胡萝卜',
    description: '山东寿光胡萝卜，脆嫩爽口，富含胡萝卜素',
    price: 5.9,
    originalPrice: 8.9,
    unit: '500g',
    sales: 2345,
    stock: 600,
    image: '/images/products/carrot-400.jpg',
    images: ['/images/products/carrot-800.jpg'],
    tags: ['新鲜', '特价'],
    detail: '产地：山东寿光\n规格：500g/份\n储存方式：冷藏保存\n保质期：7天'
  },
  {
    id: 204,
    categoryId: 2,
    name: '有机菠菜',
    description: '新鲜采摘，叶片肥厚，口感鲜嫩',
    price: 6.9,
    originalPrice: 9.9,
    unit: '250g',
    sales: 1567,
    stock: 350,
    image: '/images/products/spinach-400.jpg',
    images: ['/images/products/spinach-800.jpg'],
    tags: ['有机', '新鲜'],
    detail: '产地：本地\n规格：250g/份\n储存方式：冷藏保存\n保质期：2天'
  },
  {
    id: 205,
    categoryId: 2,
    name: '紫甘蓝',
    description: '富含花青素，适合凉拌沙拉',
    price: 7.9,
    originalPrice: 11.9,
    unit: '个',
    sales: 876,
    stock: 200,
    image: '/images/products/broccoli-400.jpg',
    images: ['/images/products/broccoli-800.jpg'],
    tags: ['健康', '新鲜'],
    detail: '产地：云南\n规格：约500g/个\n储存方式：冷藏保存\n保质期：7天'
  },
  
  // 精选菌菇
  {
    id: 301,
    categoryId: 3,
    name: '新鲜香菇',
    description: '肉厚味香，适合炒菜煲汤',
    price: 15.9,
    originalPrice: 22.9,
    unit: '250g',
    sales: 1234,
    stock: 200,
    image: '/images/products/mushroom-400.jpg',
    images: ['/images/products/mushroom-800.jpg'],
    tags: ['新鲜', '菌菇'],
    detail: '产地：福建\n规格：250g/份\n储存方式：冷藏保存\n保质期：3天'
  },
  
  // 豆制品
  {
    id: 402,
    categoryId: 4,
    name: '千张豆皮',
    description: '薄如纸张，适合凉拌炒菜',
    price: 8.9,
    originalPrice: 12.9,
    unit: '250g',
    sales: 1234,
    stock: 300,
    image: '/images/products/tofu-400.jpg',
    images: ['/images/products/tofu-800.jpg'],
    tags: ['豆制品', '新鲜'],
    detail: '产地：本地\n规格：250g/份\n储存方式：冷藏保存\n保质期：3天'
  },
  
  // 蛋禽肉类
  {
    id: 501,
    categoryId: 5,
    name: '土鸡蛋',
    description: '农家散养土鸡蛋，蛋黄金黄',
    price: 19.9,
    originalPrice: 28.9,
    unit: '10枚',
    sales: 4567,
    stock: 300,
    image: '/images/products/egg-400.jpg',
    images: ['/images/products/egg-800.jpg'],
    tags: ['土鸡蛋', '热销'],
    detail: '产地：本地农场\n规格：10枚/份\n储存方式：冷藏保存\n保质期：15天'
  },
  {
    id: 502,
    categoryId: 5,
    name: '新鲜鸡胸肉',
    description: '低脂高蛋白，健身必备',
    price: 25.9,
    originalPrice: 32.9,
    unit: '500g',
    sales: 2345,
    stock: 200,
    image: '/images/products/chicken-400.jpg',
    images: ['/images/products/chicken-800.jpg'],
    tags: ['新鲜', '健康'],
    detail: '产地：本地\n规格：500g/份\n储存方式：冷冻保存\n保质期：30天'
  },
  
  // 海鲜水产
  {
    id: 601,
    categoryId: 6,
    name: '鲜活基围虾',
    description: '鲜活基围虾，肉质Q弹',
    price: 45.9,
    originalPrice: 59.9,
    unit: '500g',
    sales: 1876,
    stock: 100,
    image: '/images/products/shrimp-400.jpg',
    images: ['/images/products/shrimp-800.jpg'],
    tags: ['鲜活', '海鲜'],
    detail: '产地：广东\n规格：500g/份\n储存方式：冷藏保存\n保质期：1天'
  },
  {
    id: 602,
    categoryId: 6,
    name: '三文鱼刺身',
    description: '挪威进口，可生食级别',
    price: 68.9,
    originalPrice: 88.9,
    unit: '200g',
    sales: 987,
    stock: 50,
    image: '/images/products/salmon-400.jpg',
    images: ['/images/products/salmon-800.jpg'],
    tags: ['进口', '刺身'],
    detail: '产地：挪威\n规格：200g/份\n储存方式：冷冻保存\n保质期：30天'
  },
  
  // 粮油调味
  {
    id: 701,
    categoryId: 7,
    name: '五常大米',
    description: '东北五常稻花香，米香浓郁',
    price: 39.9,
    originalPrice: 49.9,
    unit: '5kg',
    sales: 5678,
    stock: 300,
    image: '/images/products/rice-400.jpg',
    images: ['/images/products/rice-800.jpg'],
    tags: ['五常', '热销'],
    detail: '产地：黑龙江五常\n规格：5kg/袋\n储存方式：阴凉干燥处\n保质期：12个月'
  },
  {
    id: 702,
    categoryId: 7,
    name: '特级初榨橄榄油',
    description: '西班牙进口，健康烹饪首选',
    price: 69.9,
    originalPrice: 89.9,
    unit: '500ml',
    sales: 3456,
    stock: 200,
    image: '/images/products/oil-400.jpg',
    images: ['/images/products/oil-800.jpg'],
    tags: ['进口', '健康'],
    detail: '品牌：西班牙原装进口\n规格：500ml/瓶\n储存方式：阴凉干燥处\n保质期：18个月'
  },
  
  // 干货特产
  {
    id: 802,
    categoryId: 8,
    name: '宁夏枸杞',
    description: '宁夏中宁枸杞，颗粒饱满',
    price: 35.9,
    originalPrice: 45.9,
    unit: '250g',
    sales: 1567,
    stock: 300,
    image: '/images/products/goji-400.jpg',
    images: ['/images/products/goji-800.jpg'],
    tags: ['宁夏', '养生'],
    detail: '产地：宁夏中宁\n规格：250g/份\n储存方式：阴凉干燥处\n保质期：12个月'
  }
]

// 轮播图数据
export const banners = [
  {
    id: 1,
    image: '/images/banners/banner1.jpg',
    title: '臻选时令鲜果',
    link: '/category?id=1'
  },
  {
    id: 2,
    image: '/images/banners/banner2.jpg',
    title: '有机蔬菜甄选',
    link: '/category?id=2'
  },
  {
    id: 3,
    image: '/images/banners/banner3.jpg',
    title: '深海珍馐直达',
    link: '/category?id=6'
  }
]

/**
 * 根据ID获取商品
 */
export const getProductById = (id) => {
  return products.find(p => p.id === Number(id))
}

/**
 * 根据分类ID获取商品列表
 */
export const getProductsByCategory = (categoryId) => {
  return products.filter(p => p.categoryId === Number(categoryId))
}

/**
 * 搜索商品
 */
export const searchProducts = (keyword) => {
  const lowerKeyword = keyword.toLowerCase()
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerKeyword) ||
    p.description.toLowerCase().includes(lowerKeyword)
  )
}

/**
 * 获取推荐商品
 */
export const getRecommendProducts = (limit = 10) => {
  return [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit)
}

/**
 * 获取特价商品
 */
export const getDiscountProducts = (limit = 10) => {
  return [...products]
    .sort((a, b) => (a.price / a.originalPrice) - (b.price / b.originalPrice))
    .slice(0, limit)
}

// 默认收货地址
export const defaultAddress = {
  id: 1,
  name: '张先生',
  phone: '13888888888',
  area: '北京市 北京市 朝阳区',
  areaCode: '110105',
  detail: '建国路88号SOHO现代城A座1208室',
  isDefault: true,
  fullAddress: '北京市 北京市 朝阳区 建国路88号SOHO现代城A座1208室'
}

// 订单数据 - 初始为空
export const orders = []

/**
 * 获取订单列表
 */
export const getOrders = (status = 'all') => {
  if (status === 'all') return orders
  return orders.filter(o => o.status === status)
}
