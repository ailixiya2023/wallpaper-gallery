<script setup>
import { computed, onMounted } from 'vue'
import FilterPanel from '@/components/common/FilterPanel.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import WallpaperGrid from '@/components/wallpaper/WallpaperGrid.vue'
import WallpaperModal from '@/components/wallpaper/WallpaperModal.vue'

import { useFilter } from '@/composables/useFilter'
import { useModal } from '@/composables/useModal'
import { useTheme } from '@/composables/useTheme'
import { useWallpapers } from '@/composables/useWallpapers'

// Theme
const { initTheme } = useTheme()

// Wallpapers
const { wallpapers, loading, error, total, fetchWallpapers, getPrevWallpaper, getNextWallpaper } = useWallpapers()

// Filter
const { searchQuery, sortBy, formatFilter, filteredWallpapers, resultCount } = useFilter(wallpapers)

// Modal
const { isOpen, currentData, open, close, updateData } = useModal()

// Current wallpaper for modal
const currentWallpaper = computed(() => currentData.value)

// Handlers
function handleSelectWallpaper(wallpaper) {
  open(wallpaper)
}

function handlePrevWallpaper() {
  if (!currentWallpaper.value)
    return
  const prev = getPrevWallpaper(currentWallpaper.value.id)
  if (prev) {
    updateData(prev)
  }
}

function handleNextWallpaper() {
  if (!currentWallpaper.value)
    return
  const next = getNextWallpaper(currentWallpaper.value.id)
  if (next) {
    updateData(next)
  }
}

// Initialize
onMounted(() => {
  initTheme()
  fetchWallpapers()
})
</script>

<template>
  <div class="app">
    <AppHeader />

    <main class="main-content">
      <div class="container">
        <!-- Hero Section -->
        <section class="hero-section">
          <h2 class="hero-title">
            发现精美壁纸
          </h2>
          <p class="hero-subtitle">
            高清 4K 壁纸，免费下载
          </p>

          <!-- Search -->
          <div class="hero-search">
            <SearchBar
              v-model="searchQuery"
              placeholder="搜索壁纸..."
            />
          </div>
        </section>

        <!-- Filter Panel -->
        <FilterPanel
          v-model:sort-by="sortBy"
          v-model:format-filter="formatFilter"
          :result-count="resultCount"
          :total-count="total"
        />

        <!-- Error State -->
        <div v-if="error" class="error-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <h3>加载失败</h3>
          <p>{{ error }}</p>
          <button class="btn btn--primary" @click="fetchWallpapers">
            重新加载
          </button>
        </div>

        <!-- Wallpaper Grid -->
        <WallpaperGrid
          v-else
          :wallpapers="filteredWallpapers"
          :loading="loading"
          @select="handleSelectWallpaper"
        />
      </div>
    </main>

    <AppFooter />

    <!-- Modal -->
    <WallpaperModal
      :wallpaper="currentWallpaper"
      :is-open="isOpen"
      @close="close"
      @prev="handlePrevWallpaper"
      @next="handleNextWallpaper"
    />
  </div>
</template>

<style lang="scss">
@use '@/assets/styles/main.scss';
</style>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: $spacing-lg 0 $spacing-2xl;
}

.hero-section {
  text-align: center;
  padding: $spacing-2xl 0;

  @include mobile-only {
    padding: $spacing-lg 0;
  }
}

.hero-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: var(--color-text-primary);
  margin-bottom: $spacing-sm;
  animation: slideUp var(--transition-slow) both;

  @include mobile-only {
    font-size: $font-size-xl;
  }
}

.hero-subtitle {
  font-size: $font-size-lg;
  color: var(--color-text-secondary);
  margin-bottom: $spacing-xl;
  animation: slideUp var(--transition-slow) 100ms both;

  @include mobile-only {
    font-size: $font-size-md;
    margin-bottom: $spacing-lg;
  }
}

.hero-search {
  display: flex;
  justify-content: center;
  animation: slideUp var(--transition-slow) 200ms both;

  :deep(.search-bar) {
    max-width: 500px;
  }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-2xl;
  text-align: center;

  svg {
    width: 64px;
    height: 64px;
    color: var(--color-error);
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
    margin-bottom: $spacing-lg;
  }
}
</style>
