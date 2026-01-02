// ========================================
// 壁纸数据管理 Composable (桥接到 Pinia Store)
// ========================================

import { storeToRefs } from 'pinia'
import { useWallpaperStore } from '@/stores/wallpaper'

/**
 * 壁纸数据管理（桥接到 Pinia Store）
 * @deprecated 建议直接使用 useWallpaperStore()，此 composable 仅为向后兼容保留
 */
export function useWallpapers() {
  const wallpaperStore = useWallpaperStore()

  // 使用 storeToRefs 保持响应式
  const {
    wallpapers,
    loading,
    error,
    loaded,
    total,
    statistics,
    currentLoadedSeries,
    loadedCategories,
  } = storeToRefs(wallpaperStore)

  // 暴露 actions
  const {
    initSeries: fetchWallpapers,
    loadAllCategories,
    loadCategory,
    getWallpaperById,
    getWallpaperIndex,
    getPrevWallpaper,
    getNextWallpaper,
    clearCache,
  } = wallpaperStore

  // 兼容旧 API：switchSeries
  const switchSeries = fetchWallpapers

  return {
    // State & Getters
    wallpapers,
    loading,
    error,
    loaded,
    total,
    statistics,
    currentLoadedSeries,
    loadedCategories,

    // Actions
    fetchWallpapers,
    switchSeries,
    loadAllCategories,
    loadCategory,
    getWallpaperById,
    getWallpaperIndex,
    getPrevWallpaper,
    getNextWallpaper,
    clearCache,
  }
}

// 导出 preloadWallpapers 供路由守卫使用（虽然现在路由守卫已经不用了）
export async function preloadWallpapers(seriesId, _useLegacyMode = false) {
  const wallpaperStore = useWallpaperStore()
  await wallpaperStore.initSeries(seriesId)
}
