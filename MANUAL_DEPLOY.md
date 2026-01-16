# 手动部署指南

如果您已经将代码下载到了服务器，请按照以下步骤启动服务。

## 1. 进入项目目录
假设您将代码下载到了 `/opt/wherePhoto`（请根据实际情况修改路径）：
```bash
cd /opt/wherePhoto
```

## 2. 安装并构建前端
```bash
# 进入前端目录
cd client

# 安装依赖 (使用国内镜像)
npm install --registry=https://registry.npmmirror.com

# 构建生产环境代码
npm run build

# 将构建好的文件复制到后端静态资源目录
# 注意：如果目录不存在请先创建
mkdir -p ../server/public
cp -r dist/* ../server/public/
```

## 3. 安装后端依赖并启动
```bash
# 返回后端目录
cd ../server

# 安装生产环境依赖 (使用国内镜像)
npm install --production --registry=https://registry.npmmirror.com

# 安装 PM2 (如果尚未安装)
npm install -g pm2 --registry=https://registry.npmmirror.com

# 启动服务
pm2 start index.js --name wherephoto

# 保存 PM2 状态 (确保重启后自动运行)
pm2 save
```

## 4. 验证服务
服务启动后，默认运行在 **3000** 端口。
您可以使用以下命令检查状态：
```bash
pm2 status
pm2 logs wherephoto
```

浏览器访问：`http://您的服务器IP:3000`
