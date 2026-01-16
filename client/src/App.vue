<template>
  <el-config-provider :locale="zhCn">
    <el-container class="app-container">
      <el-header class="app-header">
        <div class="logo">
          <el-icon :size="24" class="logo-icon"><picture-filled /></el-icon>
          <h1>WherePhoto 图床服务</h1>
        </div>
        <el-button type="primary" size="large" @click="uploadVisible = true">
          <el-icon style="margin-right: 5px"><upload /></el-icon>
          上传图片
        </el-button>
      </el-header>
      
      <el-main>
        <ImageGallery ref="galleryRef" />
      </el-main>

      <el-dialog
        v-model="uploadVisible"
        title="上传图片"
        width="600px"
        destroy-on-close
      >
        <UploadPanel @upload-completed="handleUploadCompleted" />
      </el-dialog>
    </el-container>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import { PictureFilled, Upload } from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import ImageGallery from './components/ImageGallery.vue'
import UploadPanel from './components/UploadPanel.vue'

const galleryRef = ref(null)
const uploadVisible = ref(false)

const handleUploadCompleted = () => {
  // Refresh gallery
  if (galleryRef.value) {
    galleryRef.value.fetchImages()
  }
  // Optional: close dialog automatically or keep it open for more uploads
  // Let's keep it open but maybe show a success message (handled in component)
  // Or close it? User requirement: "Batch upload". Usually we keep it open.
  // But to see the result, maybe we close it? 
  // Let's NOT close it automatically, let user close it. 
  // But I'll refresh the background gallery.
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  background-color: #f0f2f5;
}

.app-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 0 40px;
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #409EFF;
}

.logo h1 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #303133;
}
</style>
