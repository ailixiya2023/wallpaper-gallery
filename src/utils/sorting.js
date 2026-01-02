// ========================================
// 排序工具函数
// ========================================

/**
 * 按日期排序
 */
export function sortByDate(wallpapers, order = 'desc') {
  return [...wallpapers].sort((a, b) => {
    const dateA = new Date(a.createdAt)
    const dateB = new Date(b.createdAt)
    return order === 'desc' ? dateB - dateA : dateA - dateB
  })
}

/**
 * 按热度排序（使用预计算的 Map）
 */
export function sortByPopularity(wallpapers, popularityMap) {
  return [...wallpapers].sort((a, b) => {
    const scoreA = popularityMap.get(a.filename)?.score || 0
    const scoreB = popularityMap.get(b.filename)?.score || 0

    // 热度相同时按最新排序
    if (scoreB === scoreA) {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }

    return scoreB - scoreA
  })
}

/**
 * 按下载量排序
 */
export function sortByDownloads(wallpapers, popularityMap) {
  return [...wallpapers].sort((a, b) => {
    const countA = popularityMap.get(a.filename)?.downloads || 0
    const countB = popularityMap.get(b.filename)?.downloads || 0

    // 下载量相同时按最新排序
    if (countB === countA) {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }

    return countB - countA
  })
}

/**
 * 按浏览量排序
 */
export function sortByViews(wallpapers, popularityMap) {
  return [...wallpapers].sort((a, b) => {
    const countA = popularityMap.get(a.filename)?.views || 0
    const countB = popularityMap.get(b.filename)?.views || 0

    // 浏览量相同时按最新排序
    if (countB === countA) {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }

    return countB - countA
  })
}

/**
 * 按大小排序
 */
export function sortBySize(wallpapers, order = 'desc') {
  return [...wallpapers].sort((a, b) => {
    return order === 'desc' ? b.size - a.size : a.size - b.size
  })
}

/**
 * 按文件名排序
 */
export function sortByName(wallpapers, order = 'asc') {
  return [...wallpapers].sort((a, b) => {
    return order === 'asc'
      ? a.filename.localeCompare(b.filename)
      : b.filename.localeCompare(a.filename)
  })
}
