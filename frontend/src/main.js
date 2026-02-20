/**
 * 应用入口文件
 * 初始化Vue应用、路由、状态管理和UI组件库
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 引入Vant组件库
import Vant from 'vant'
import 'vant/lib/index.css'

// 引入触摸模拟器（用于PC端调试）
import '@vant/touch-emulator'

// 引入全局样式
import './styles/global.scss'

// 引入错误处理插件
import { errorHandlerPlugin } from './utils/errorHandler'

// 创建Vue应用实例
const app = createApp(App)

// 使用Pinia状态管理
app.use(createPinia())

// 使用Vue Router路由
app.use(router)

// 使用Vant UI组件库
app.use(Vant)

// 使用错误处理插件
app.use(errorHandlerPlugin)

// 挂载应用
app.mount('#app')
