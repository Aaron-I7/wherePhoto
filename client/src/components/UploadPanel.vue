<template>
  <div class="upload-panel">
    <el-tabs v-model="activeTab" class="demo-tabs">
      <el-tab-pane label="本地上传" name="local">
        <el-upload
          class="upload-demo"
          drag
          action="/api/upload"
          multiple
          name="files"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            拖拽文件到此处或 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持 jpg/png 文件，可批量上传
            </div>
          </template>
        </el-upload>
      </el-tab-pane>
      
      <el-tab-pane label="URL 上传" name="url">
        <div class="url-upload-container">
          <el-input
            v-model="urlText"
            :rows="5"
            type="textarea"
            placeholder="请输入图片 URL，每行一个"
          />
          <div class="url-actions">
            <el-button type="primary" @click="handleUrlUpload" :loading="urlUploading">
              开始下载
            </el-button>
          </div>
          
          <div v-if="urlResults.length" class="url-results">
            <el-alert
              v-for="(res, index) in urlResults"
              :key="index"
              :title="res.success ? '下载成功' : '下载失败'"
              :type="res.success ? 'success' : 'error'"
              :description="res.url + (res.error ? ': ' + res.error : '')"
              show-icon
              :closable="false"
              style="margin-top: 10px;"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const activeTab = ref('local')
const urlText = ref('')
const urlUploading = ref(false)
const urlResults = ref([])

const emit = defineEmits(['upload-completed'])

const handleUploadSuccess = (response, uploadFile, uploadFiles) => {
  ElMessage.success('上传成功')
  emit('upload-completed')
}

const handleUploadError = (error, uploadFile, uploadFiles) => {
  ElMessage.error('上传失败')
  console.error(error)
}

const handleUrlUpload = async () => {
  if (!urlText.value.trim()) {
    ElMessage.warning('请输入 URL')
    return
  }

  const urls = urlText.value.split('\n').map(u => u.trim()).filter(u => u)
  if (urls.length === 0) return

  urlUploading.value = true
  urlResults.value = []

  try {
    const response = await axios.post('/api/upload-url', { urls })
    urlResults.value = response.data.results
    const successCount = response.data.results.filter(r => r.success).length
    if (successCount > 0) {
      ElMessage.success(`成功下载 ${successCount} 张图片`)
      emit('upload-completed')
    } else {
      ElMessage.warning('所有图片下载失败')
    }
  } catch (error) {
    ElMessage.error('请求失败')
    console.error(error)
  } finally {
    urlUploading.value = false
  }
}
</script>

<style scoped>
.upload-panel {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}
.url-upload-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.url-actions {
  text-align: right;
}
.url-results {
  max-height: 200px;
  overflow-y: auto;
}
</style>
