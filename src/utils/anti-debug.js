// ========================================
// 反调试保护（生产环境）
// ========================================

/* eslint-disable no-alert */

/**
 * 初始化反调试保护
 * 仅禁用右键菜单，保持简洁，避免影响性能
 */
export function initAntiDebug() {
  // 仅在生产环境启用
  if (import.meta.env.DEV) {
    return
  }

  const warningMessage = '兄弟 bro，不允许复制哦😏😏'

  // ========================================
  // 禁用右键菜单（唯一保护）
  // ========================================
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    e.stopPropagation()
    alert(warningMessage)
    return false
  }, true)
}
