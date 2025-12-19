// ========================================
// 常量定义
// ========================================

// GitHub 图床基础 URL（使用 raw.githubusercontent.com，对中文文件名支持更好）
export const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/IT-NuanxinPro/nuanXinProPic/main/wallpaper'

// 壁纸数据 JSON 路径（使用 import.meta.env.BASE_URL 确保路径正确）
export const WALLPAPERS_DATA_URL = `${import.meta.env.BASE_URL}data/wallpapers.json`

// ========================================
// 图片代理服务配置（用于生成缩略图，加速加载）
// ========================================
export const IMAGE_PROXY = {
  BASE_URL: 'https://wsrv.nl/',
  THUMB_WIDTH: 400,
  THUMB_QUALITY: 80,
  FORMAT: 'webp',
}

/**
 * 生成缩略图 URL
 * @param {string} originalUrl - 原图 URL
 * @param {number} width - 缩略图宽度
 * @returns {string} 缩略图 URL
 */
export function getThumbnailUrl(originalUrl, width = IMAGE_PROXY.THUMB_WIDTH) {
  const params = new URLSearchParams({
    url: originalUrl,
    w: String(width),
    q: String(IMAGE_PROXY.THUMB_QUALITY),
    output: IMAGE_PROXY.FORMAT,
  })
  return `${IMAGE_PROXY.BASE_URL}?${params}`
}

// 排序选项
export const SORT_OPTIONS = [
  { value: 'newest', label: '最新优先', icon: 'clock' },
  { value: 'oldest', label: '最早优先', icon: 'clock-reverse' },
  { value: 'largest', label: '最大优先', icon: 'arrow-down' },
  { value: 'smallest', label: '最小优先', icon: 'arrow-up' },
  { value: 'name-asc', label: '名称 A-Z', icon: 'sort-alpha' },
  { value: 'name-desc', label: '名称 Z-A', icon: 'sort-alpha-reverse' },
]

// 格式过滤选项
export const FORMAT_OPTIONS = [
  { value: 'all', label: '全部格式' },
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
]

// ========================================
// 分辨率标签阈值（按长边判断）
// ========================================
export const RESOLUTION_THRESHOLDS = [
  { minWidth: 5120, label: '5K+', type: 'danger' },
  { minWidth: 3840, label: '4K+', type: 'warning' },
  { minWidth: 2560, label: '4K', type: 'success' },
  { minWidth: 1920, label: '超清', type: 'info' },
  { minWidth: 1280, label: '高清', type: 'primary' },
  { minWidth: 0, label: '标清', type: 'secondary' },
]

// 分辨率标签阈值 (bytes) - 用于文件大小估算（兼容旧逻辑）
export const SIZE_THRESHOLDS = {
  SMALL: 500 * 1024, // < 500KB
  MEDIUM: 2 * 1024 * 1024, // < 2MB
  LARGE: 5 * 1024 * 1024, // < 5MB
  // >= 5MB 为超大
}

// 分辨率标签
export const SIZE_LABELS = {
  SMALL: '标清',
  MEDIUM: '高清',
  LARGE: '4K',
  XLARGE: '超清',
}

// 主题
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
}

// localStorage 键名
export const STORAGE_KEYS = {
  THEME: 'wallpaper-gallery-theme',
  SORT: 'wallpaper-gallery-sort',
}
