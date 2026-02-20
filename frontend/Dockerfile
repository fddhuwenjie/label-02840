# 蔬果购物H5前端 Dockerfile
# 多阶段构建，支持 ARM 和 X86 架构

# ============================================
# 阶段1: 构建阶段
# ============================================
FROM --platform=$BUILDPLATFORM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建生产版本
RUN npm run build

# ============================================
# 阶段2: 生产阶段
# ============================================
FROM --platform=$TARGETPLATFORM nginx:alpine

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 删除默认的 nginx 静态文件
RUN rm -rf ./*

# 从构建阶段复制构建产物
COPY --from=builder /app/dist .

# 复制 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
