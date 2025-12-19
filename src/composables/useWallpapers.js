// ========================================
// 壁纸数据管理 Composable
// ========================================

import { computed, ref } from 'vue'
import { WALLPAPERS_DATA_URL } from '@/utils/constants'

const wallpapers = ref([])
const loading = ref(false)
const error = ref(null)
const loaded = ref(false)

export function useWallpapers() {
  // 加载壁纸数据
  const fetchWallpapers = async () => {
    if (loaded.value)
      return // 避免重复加载

    loading.value = true
    error.value = null

    try {
      const response = await fetch(WALLPAPERS_DATA_URL)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      wallpapers.value = data.wallpapers || data
      loaded.value = true
    }
    catch (e) {
      console.error('Failed to fetch wallpapers:', e)
      error.value = e.message || '加载壁纸数据失败'
    }
    finally {
      loading.value = false
    }
  }

  // 壁纸总数
  const total = computed(() => wallpapers.value.length)

  // 根据 ID 获取单个壁纸
  const getWallpaperById = (id) => {
    return wallpapers.value.find(w => w.id === id)
  }

  // 获取壁纸在列表中的索引
  const getWallpaperIndex = (id) => {
    return wallpapers.value.findIndex(w => w.id === id)
  }

  // 获取上一张壁纸
  const getPrevWallpaper = (currentId) => {
    const index = getWallpaperIndex(currentId)
    if (index > 0) {
      return wallpapers.value[index - 1]
    }
    return null
  }

  // 获取下一张壁纸
  const getNextWallpaper = (currentId) => {
    const index = getWallpaperIndex(currentId)
    if (index < wallpapers.value.length - 1) {
      return wallpapers.value[index + 1]
    }
    return null
  }

  return {
    wallpapers,
    loading,
    error,
    loaded,
    total,
    fetchWallpapers,
    getWallpaperById,
    getWallpaperIndex,
    getPrevWallpaper,
    getNextWallpaper,
  }
}
