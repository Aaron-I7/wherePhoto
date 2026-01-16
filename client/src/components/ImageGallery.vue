<template>
  <div class="gallery-container">
    <div class="gallery-header">
      <h2>图片列表 ({{ images.length }})</h2>
      <el-button @click="fetchImages" :icon="Refresh" circle />
    </div>
    
    <div v-if="loading" class="loading">
      <el-skeleton :rows="5" animated />
    </div>
    
    <el-table 
      v-else 
      :data="images" 
      style="width: 100%" 
      border
      stripe
      height="calc(100vh - 200px)"
    >
      <el-table-column label="缩略图" width="120" align="center">
        <template #default="scope">
          <el-popover
            placement="right"
            :width="300"
            trigger="hover"
          >
            <template #reference>
              <el-image 
                :src="scope.row.url" 
                :preview-src-list="previewList"
                :initial-index="scope.$index"
                fit="cover"
                loading="lazy"
                class="table-thumbnail"
                preview-teleported
              >
                <template #error>
                  <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </template>
            <el-image :src="scope.row.url" style="width: 100%; height: auto;" />
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="filename" label="文件名" min-width="200" show-overflow-tooltip />

      <el-table-column label="文件大小" width="120" align="center">
        <template #default="scope">
          {{ formatSize(scope.row.size) }}
        </template>
      </el-table-column>

      <el-table-column label="上传时间" width="180" align="center" sortable :sort-method="sortByDate">
        <template #default="scope">
          {{ formatDate(scope.row.mtime) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="scope">
          <el-button 
            type="primary" 
            link 
            :icon="CopyDocument"
            @click="copyLink(scope.row.url)"
          >
            复制链接
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { Refresh, Picture as IconPicture, CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const images = ref([])
const loading = ref(false)

const previewList = computed(() => images.value.map(img => img.url))

const fetchImages = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/images')
    if (response.data.success) {
      images.value = response.data.data
    }
  } catch (error) {
    ElMessage.error('获取图片列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const copyLink = (url) => {
  navigator.clipboard.writeText(url).then(() => {
    ElMessage.success('链接已复制')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

const formatDate = (isoString) => {
  if (!isoString) return '-'
  const date = new Date(isoString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const sortByDate = (a, b) => {
  return new Date(a.mtime) - new Date(b.mtime)
}

onMounted(() => {
  fetchImages()
})

defineExpose({ fetchImages })
</script>

<style scoped>
.gallery-container {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-shrink: 0;
}
.table-thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  cursor: zoom-in;
}
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 20px;
}
</style>
