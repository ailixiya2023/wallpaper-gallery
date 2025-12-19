/**
 * 壁纸数据生成脚本
 * 在构建前运行，生成 wallpapers.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const CONFIG = {
  // GitHub 图床仓库信息
  GITHUB_OWNER: 'IT-NuanxinPro',
  GITHUB_REPO: 'nuanXinProPic',
  GITHUB_BRANCH: 'main',
  WALLPAPER_DIR: 'wallpaper',

  // 支持的图片格式
  IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],

  // 输出路径
  OUTPUT_DIR: path.resolve(__dirname, '../public/data'),
  OUTPUT_FILE: 'wallpapers.json'
}

// 图床 URL 基础路径
const IMAGE_BASE_URL = `https://raw.githubusercontent.com/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/${CONFIG.GITHUB_BRANCH}/${CONFIG.WALLPAPER_DIR}`

/**
 * 通过 GitHub API 获取壁纸列表
 */
async function fetchWallpapersFromGitHub() {
  const apiUrl = `https://api.github.com/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.WALLPAPER_DIR}?ref=${CONFIG.GITHUB_BRANCH}`

  console.log('Fetching wallpapers from GitHub API...')
  console.log(`URL: ${apiUrl}`)

  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Wallpaper-Gallery-Builder'
    }
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  const files = await response.json()

  // 过滤出图片文件
  const imageFiles = files.filter(file => {
    if (file.type !== 'file') return false
    const ext = path.extname(file.name).toLowerCase()
    return CONFIG.IMAGE_EXTENSIONS.includes(ext)
  })

  console.log(`Found ${imageFiles.length} image files`)

  return imageFiles
}

/**
 * 根据文件大小生成分辨率标签
 */
function getSizeLabel(size) {
  if (size >= 5 * 1024 * 1024) return '超清'
  if (size >= 2 * 1024 * 1024) return '4K'
  if (size >= 500 * 1024) return '高清'
  return '标清'
}

/**
 * 生成壁纸数据
 */
function generateWallpaperData(files) {
  return files.map((file, index) => {
    const ext = path.extname(file.name).replace('.', '').toUpperCase()
    const sizeLabel = getSizeLabel(file.size)

    return {
      id: `wallpaper-${index + 1}`,
      filename: file.name,
      url: `${IMAGE_BASE_URL}/${encodeURIComponent(file.name)}`,
      size: file.size,
      format: ext,
      tags: [sizeLabel, ext],
      createdAt: new Date().toISOString(),
      sha: file.sha
    }
  })
}

/**
 * 主函数
 */
async function main() {
  console.log('='.repeat(50))
  console.log('Wallpaper Data Generator')
  console.log('='.repeat(50))

  try {
    // 获取壁纸文件列表
    const files = await fetchWallpapersFromGitHub()

    if (files.length === 0) {
      console.warn('No image files found!')
      return
    }

    // 生成壁纸数据
    const wallpapers = generateWallpaperData(files)

    // 按大小降序排列（默认显示最大的在前）
    wallpapers.sort((a, b) => b.size - a.size)

    // 确保输出目录存在
    if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
      fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true })
    }

    // 写入 JSON 文件
    const outputPath = path.join(CONFIG.OUTPUT_DIR, CONFIG.OUTPUT_FILE)
    const outputData = {
      generatedAt: new Date().toISOString(),
      total: wallpapers.length,
      source: `https://github.com/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}`,
      wallpapers
    }

    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2))

    console.log('')
    console.log('='.repeat(50))
    console.log('Generation Complete!')
    console.log('='.repeat(50))
    console.log(`Total wallpapers: ${wallpapers.length}`)
    console.log(`Output file: ${outputPath}`)
    console.log('')

    // 输出统计
    const stats = {
      jpg: wallpapers.filter(w => w.format === 'JPG' || w.format === 'JPEG').length,
      png: wallpapers.filter(w => w.format === 'PNG').length,
      other: wallpapers.filter(w => !['JPG', 'JPEG', 'PNG'].includes(w.format)).length
    }
    console.log('Format statistics:')
    console.log(`  JPG: ${stats.jpg}`)
    console.log(`  PNG: ${stats.png}`)
    if (stats.other > 0) console.log(`  Other: ${stats.other}`)

  } catch (error) {
    console.error('Error generating wallpaper data:', error)
    process.exit(1)
  }
}

main()
