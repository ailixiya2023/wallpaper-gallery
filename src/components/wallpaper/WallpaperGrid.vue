<script setup>
import { gsap } from 'gsap'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { usePagination } from '@/composables/usePagination'
import { useViewMode } from '@/composables/useViewMode'
import { useWallpaperType } from '@/composables/useWallpaperType'
import WallpaperCard from './WallpaperCard.vue'

const props = defineProps({
  wallpapers: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  searchQuery: {
    type: String,
    default: '',
  },
  // 原始壁纸总数（未筛选前）
  totalCount: {
    type: Number,
    default: 0,
  },
  // 是否有筛选条件激活
  hasFilters: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select', 'resetFilters'])

const router = useRouter()
const { currentSeries, currentSeriesConfig, availableSeriesOptions } = useWallpaperType()
const { viewMode } = useViewMode()
const gridRef = ref(null)
const isAnimating = ref(false)
// 用于控制实际显示的视图模式（延迟切换，确保动画正确）
const displayViewMode = ref(viewMode.value)

// 空状态类型判断
const emptyStateType = computed(() => {
  if (props.loading)
    return 'loading'
  if (props.wallpapers.length === 0) {
    // 如果有筛选条件或搜索词，说明是筛选后无结果
    if (props.hasFilters || props.searchQuery) {
      return 'no-filter-results'
    }
    // 否则是系列本身没有数据
    return 'no-series-data'
  }
  return null
})

// 当前系列的名称
const currentSeriesName = computed(() => {
  return currentSeriesConfig.value?.name || '壁纸'
})

// 获取其他可用系列（用于快捷跳转）
const alternativeSeries = computed(() => {
  return availableSeriesOptions.value.filter(opt => opt.id !== currentSeries.value)
})

// 跳转到其他系列
function navigateToSeries(seriesId) {
  router.push(`/${seriesId}`)
}

// 重置筛选条件
function handleResetFilters() {
  emit('resetFilters')
}

// 分页
const wallpapersRef = computed(() => props.wallpapers)
const {
  displayedItems,
  hasMore,
  isLoading: paginationLoading,
  observerTarget,
} = usePagination(wallpapersRef, 20)

// 用于控制列表显示的状态，避免闪烁
const showGrid = ref(true)

// 视图切换动画 - 炫酷 GSAP 效果
watch(viewMode, async (newMode, oldMode) => {
  if (!gridRef.value || isAnimating.value || newMode === oldMode)
    return

  isAnimating.value = true
  const cards = gridRef.value.querySelectorAll('.wallpaper-card')

  if (cards.length === 0) {
    // 没有卡片时直接切换
    displayViewMode.value = newMode
    isAnimating.value = false
    return
  }

  // 根据切换的视图类型选择不同的动画
  const animationType = getAnimationType(oldMode, newMode)

  // 阶段1: 卡片消失动画（保持旧布局）
  await animateOut(cards, animationType)

  // 阶段2: 切换到新布局
  displayViewMode.value = newMode
  await nextTick()

  // 短暂延迟让布局完成
  await new Promise(resolve => setTimeout(resolve, 50))

  // 阶段3: 卡片出现动画（新布局）
  const newCards = gridRef.value.querySelectorAll('.wallpaper-card')
  await animateIn(newCards, animationType)

  isAnimating.value = false
})

// 根据视图切换类型选择动画
function getAnimationType(from, to) {
  if (to === 'masonry')
    return 'waterfall'
  if (to === 'list')
    return 'slide'
  if (from === 'masonry')
    return 'gather'
  return 'morph'
}

// 卡片消失动画
function animateOut(cards, type) {
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve })

    switch (type) {
      case 'waterfall':
        // 瀑布流：卡片像水滴一样落下消失
        tl.to(cards, {
          y: 30,
          opacity: 0,
          scale: 0.9,
          rotateX: 15,
          duration: 0.3,
          stagger: {
            amount: 0.2,
            from: 'start',
          },
          ease: 'power2.in',
        })
        break

      case 'slide':
        // 列表视图：卡片向左滑出
        tl.to(cards, {
          x: -50,
          opacity: 0,
          duration: 0.25,
          stagger: {
            amount: 0.15,
            from: 'start',
          },
          ease: 'power2.in',
        })
        break

      case 'gather':
        // 从瀑布流切换：卡片向中心聚拢
        tl.to(cards, {
          scale: 0.8,
          opacity: 0,
          duration: 0.3,
          stagger: {
            amount: 0.2,
            from: 'center',
          },
          ease: 'back.in(1.5)',
        })
        break

      default:
        // 默认：3D 翻转效果
        tl.to(cards, {
          rotateY: 90,
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          stagger: {
            amount: 0.2,
            from: 'random',
          },
          ease: 'power2.in',
        })
    }
  })
}

// 卡片出现动画
function animateIn(cards, type) {
  return new Promise((resolve) => {
    // 先重置所有卡片状态
    gsap.set(cards, {
      opacity: 0,
      clearProps: 'transform',
    })

    const tl = gsap.timeline({ onComplete: resolve })

    switch (type) {
      case 'waterfall':
        // 瀑布流：卡片从上方落下，像水滴一样有弹性
        gsap.set(cards, { y: -40, scale: 0.9, rotateX: -15 })
        tl.to(cards, {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 0.5,
          stagger: {
            amount: 0.4,
            from: 'start',
            grid: 'auto',
          },
          ease: 'back.out(1.2)',
        })
        break

      case 'slide':
        // 列表视图：卡片从右侧滑入
        gsap.set(cards, { x: 50 })
        tl.to(cards, {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: {
            amount: 0.3,
            from: 'start',
          },
          ease: 'power2.out',
        })
        break

      case 'gather':
        // 网格视图：从中心向外扩散
        gsap.set(cards, { scale: 0.5 })
        tl.to(cards, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: {
            amount: 0.3,
            from: 'center',
            grid: 'auto',
          },
          ease: 'back.out(1.7)',
        })
        break

      default:
        // 默认：3D 翻转进入
        gsap.set(cards, { rotateY: -90, scale: 0.9 })
        tl.to(cards, {
          rotateY: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: {
            amount: 0.3,
            from: 'random',
            grid: 'auto',
          },
          ease: 'back.out(1.5)',
        })
    }
  })
}

// 初始加载动画
onMounted(() => {
  if (gridRef.value && displayedItems.value.length > 0) {
    nextTick(() => {
      const cards = gridRef.value?.querySelectorAll('.wallpaper-card')
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 30,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: {
              amount: 0.5,
              from: 'start',
              grid: 'auto',
            },
            ease: 'power2.out',
          },
        )
      }
    })
  }
})

// 监听 wallpapers 变化，添加短暂的隐藏状态避免闪烁
watch(() => props.wallpapers, async (newVal, oldVal) => {
  // 只有当数组内容真正变化时才触发过渡
  if (oldVal && oldVal.length > 0 && newVal.length > 0) {
    showGrid.value = false
    await nextTick()
    // 短暂延迟后显示新内容
    setTimeout(() => {
      showGrid.value = true
    }, 50)
  }
}, { deep: false })

function handleSelect(wallpaper) {
  emit('select', wallpaper)
}
</script>

<template>
  <div class="wallpaper-grid-wrapper">
    <!-- Loading State -->
    <div v-if="loading" class="grid-loading">
      <LoadingSpinner size="lg" />
      <p class="loading-text">
        加载{{ currentSeriesName }}中...
      </p>
    </div>

    <!-- Empty State: 系列数据为空 -->
    <div v-else-if="emptyStateType === 'no-series-data'" class="grid-empty series-empty">
      <div class="empty-icon">
        <!-- 根据系列显示不同图标 -->
        <svg v-if="currentSeries === 'desktop'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <svg v-else-if="currentSeries === 'mobile'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
        <svg v-else-if="currentSeries === 'avatar'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
      <h3>暂无{{ currentSeriesName }}</h3>
      <p>该分类暂时没有内容，敬请期待~</p>
      <!-- 快捷跳转按钮 -->
      <div v-if="alternativeSeries.length > 0" class="empty-actions">
        <button
          v-for="series in alternativeSeries"
          :key="series.id"
          class="action-btn"
          @click="navigateToSeries(series.id)"
        >
          查看{{ series.name }}
        </button>
      </div>
    </div>

    <!-- Empty State: 筛选后无结果 -->
    <div v-else-if="emptyStateType === 'no-filter-results'" class="grid-empty filter-empty">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <path d="M8 8l6 6M14 8l-6 6" />
        </svg>
      </div>
      <h3>没有找到匹配的壁纸</h3>
      <p>尝试调整搜索条件或筛选器</p>
      <div class="empty-actions">
        <button class="action-btn primary" @click="handleResetFilters">
          清除筛选条件
        </button>
      </div>
    </div>

    <!-- Grid - 简化过渡，避免闪烁 -->
    <div
      v-else
      ref="gridRef"
      class="wallpaper-grid"
      :class="[`view-${displayViewMode}`, { 'is-hidden': !showGrid, 'is-animating': isAnimating }]"
    >
      <WallpaperCard
        v-for="(wallpaper, index) in displayedItems"
        :key="wallpaper.id"
        :wallpaper="wallpaper"
        :index="index"
        :search-query="searchQuery"
        :view-mode="displayViewMode"
        @click="handleSelect"
      />
    </div>

    <!-- Load More Observer -->
    <div
      v-if="!loading && wallpapers.length > 0"
      ref="observerTarget"
      class="load-more-trigger"
    >
      <div v-if="paginationLoading" class="load-more-loading">
        <LoadingSpinner size="sm" />
        <span>加载更多...</span>
      </div>
      <div v-else-if="hasMore" class="load-more-hint">
        <span>向下滚动加载更多</span>
      </div>
      <div v-else class="load-more-end">
        <span>已加载全部 {{ wallpapers.length }} 张{{ currentSeriesName }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wallpaper-grid-wrapper {
  min-height: 400px;
}

.wallpaper-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--grid-gap);
  transition: opacity 0.2s ease;
  // 3D 透视效果，让动画更有深度
  perspective: 1000px;
  transform-style: preserve-3d;

  &.is-hidden {
    opacity: 0;
  }

  // 动画进行中禁用 hover 效果，避免干扰
  &.is-animating {
    pointer-events: none;
  }

  // 网格视图（默认）
  &.view-grid {
    @include respond-to('sm') {
      grid-template-columns: repeat(2, 1fr);
    }

    @include respond-to('md') {
      grid-template-columns: repeat(3, 1fr);
    }

    @include respond-to('lg') {
      grid-template-columns: repeat(4, 1fr);
    }

    @include respond-to('xl') {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  // 列表视图
  &.view-list {
    grid-template-columns: 1fr;
    gap: $spacing-md;
  }

  // 瀑布流视图
  &.view-masonry {
    display: block;
    column-count: 2;
    column-gap: var(--grid-gap);

    @include respond-to('md') {
      column-count: 3;
    }

    @include respond-to('lg') {
      column-count: 4;
    }

    @include respond-to('xl') {
      column-count: 5;
    }

    > * {
      break-inside: avoid;
      margin-bottom: var(--grid-gap);
    }
  }
}

.grid-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-2xl;
  gap: $spacing-md;
}

.loading-text {
  font-size: $font-size-sm;
  color: var(--color-text-muted);
}

.grid-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-2xl;
  text-align: center;
  animation: fadeIn 0.5s ease;

  .empty-icon {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-hover);
    border-radius: 50%;
    margin-bottom: $spacing-lg;

    svg {
      width: 48px;
      height: 48px;
      color: var(--color-text-muted);
      opacity: 0.7;
    }
  }

  h3 {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: var(--color-text-primary);
    margin-bottom: $spacing-sm;
  }

  p {
    font-size: $font-size-sm;
    color: var(--color-text-muted);
    margin-bottom: $spacing-lg;
  }

  &.series-empty {
    .empty-icon {
      background: linear-gradient(135deg, var(--color-accent-light) 0%, rgba(99, 102, 241, 0.1) 100%);

      svg {
        color: var(--color-accent);
        opacity: 0.8;
      }
    }
  }

  &.filter-empty {
    .empty-icon {
      background: var(--color-bg-secondary);

      svg {
        color: var(--color-text-muted);
      }
    }
  }
}

.empty-actions {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  justify-content: center;
  margin-top: $spacing-sm;
}

.action-btn {
  padding: 10px 20px;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-bg-hover);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  &:active {
    transform: scale(0.95);
  }

  &.primary {
    color: white;
    background: var(--color-accent);
    border-color: var(--color-accent);

    &:hover {
      background: var(--color-accent-hover);
      border-color: var(--color-accent-hover);
      color: white;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 加载更多
.load-more-trigger {
  display: flex;
  justify-content: center;
  padding: $spacing-xl 0;
}

.load-more-loading,
.load-more-hint,
.load-more-end {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-sm;
  color: var(--color-text-muted);
}

.load-more-loading {
  color: var(--color-accent);
}

.load-more-end {
  padding: $spacing-sm $spacing-md;
  background: var(--color-bg-secondary);
  border-radius: $radius-full;
}
</style>
