<script setup>
import { TransitionGroup } from 'vue'
import WallpaperCard from './WallpaperCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

defineProps({
  wallpapers: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

const handleSelect = (wallpaper) => {
  emit('select', wallpaper)
}
</script>

<template>
  <div class="wallpaper-grid-wrapper">
    <!-- Loading State -->
    <div v-if="loading" class="grid-loading">
      <LoadingSpinner size="lg" />
      <p class="loading-text">加载壁纸中...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="wallpapers.length === 0" class="grid-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      <h3>没有找到壁纸</h3>
      <p>尝试调整搜索条件或筛选器</p>
    </div>

    <!-- Grid -->
    <TransitionGroup
      v-else
      name="grid"
      tag="div"
      class="wallpaper-grid"
    >
      <WallpaperCard
        v-for="(wallpaper, index) in wallpapers"
        :key="wallpaper.id"
        :wallpaper="wallpaper"
        :index="index"
        @click="handleSelect"
      />
    </TransitionGroup>
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

  svg {
    width: 80px;
    height: 80px;
    color: var(--color-text-muted);
    opacity: 0.5;
    margin-bottom: $spacing-lg;
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
  }
}

// Grid transition
.grid-enter-active {
  transition: all var(--transition-slow);
}

.grid-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.grid-leave-active {
  position: absolute;
  transition: all var(--transition-normal);
}

.grid-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.grid-move {
  transition: transform var(--transition-slow);
}
</style>
