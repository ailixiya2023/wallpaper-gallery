<script setup>
import { ref, computed } from 'vue'
import { formatFileSize, getSizeLabel, getFileExtension } from '@/utils/format'

const props = defineProps({
  wallpaper: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['click'])

const imageLoaded = ref(false)
const imageError = ref(false)

const sizeInfo = computed(() => getSizeLabel(props.wallpaper.size))
const fileExt = computed(() => getFileExtension(props.wallpaper.filename).toUpperCase())
const formattedSize = computed(() => formatFileSize(props.wallpaper.size))

const handleImageLoad = () => {
  imageLoaded.value = true
}

const handleImageError = () => {
  imageError.value = true
  imageLoaded.value = true
}

const handleClick = () => {
  emit('click', props.wallpaper)
}

// 动画延迟
const animationDelay = computed(() => {
  const delay = (props.index % 20) * 50
  return `${delay}ms`
})
</script>

<template>
  <div
    class="wallpaper-card"
    :style="{ animationDelay }"
    @click="handleClick"
  >
    <!-- Image Container -->
    <div class="card-image">
      <!-- Skeleton -->
      <div v-if="!imageLoaded" class="image-skeleton animate-shimmer"></div>

      <!-- Error State -->
      <div v-else-if="imageError" class="image-error">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <span>加载失败</span>
      </div>

      <!-- Image -->
      <img
        v-show="imageLoaded && !imageError"
        :src="wallpaper.url"
        :alt="wallpaper.filename"
        loading="lazy"
        @load="handleImageLoad"
        @error="handleImageError"
      />

      <!-- Overlay -->
      <div class="card-overlay">
        <div class="overlay-actions">
          <span class="action-hint">点击查看</span>
        </div>
      </div>

      <!-- Tags -->
      <div class="card-tags">
        <span class="tag" :class="[`tag--${sizeInfo.type}`]">
          {{ sizeInfo.label }}
        </span>
        <span class="tag tag--secondary">{{ fileExt }}</span>
      </div>
    </div>

    <!-- Card Info -->
    <div class="card-info">
      <p class="card-filename" :title="wallpaper.filename">
        {{ wallpaper.filename }}
      </p>
      <p class="card-meta">
        <span class="meta-size">{{ formattedSize }}</span>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wallpaper-card {
  position: relative;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-card);
  transition:
    transform var(--transition-normal),
    box-shadow var(--transition-normal);
  animation: slideUp var(--transition-slow) both;

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-card-hover);

    .card-overlay {
      opacity: 1;
    }

    .card-image img {
      transform: scale(1.05);
    }
  }
}

.card-image {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--color-bg-hover);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
  }
}

.image-skeleton {
  position: absolute;
  inset: 0;
  background: var(--color-bg-hover);
}

.image-error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  color: var(--color-text-muted);

  svg {
    width: 32px;
    height: 32px;
  }

  span {
    font-size: $font-size-xs;
  }
}

.card-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.overlay-actions {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.action-hint {
  padding: $spacing-sm $spacing-md;
  background: rgba(255, 255, 255, 0.95);
  border-radius: $radius-full;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: #1a1a2e;
}

.card-tags {
  position: absolute;
  top: $spacing-sm;
  left: $spacing-sm;
  display: flex;
  gap: $spacing-xs;
}

.tag {
  padding: 2px $spacing-sm;
  font-size: 10px;
  font-weight: $font-weight-semibold;
  border-radius: $radius-sm;
  text-transform: uppercase;
  backdrop-filter: blur(4px);

  &--primary {
    background: rgba(99, 102, 241, 0.9);
    color: white;
  }

  &--success {
    background: rgba(16, 185, 129, 0.9);
    color: white;
  }

  &--warning {
    background: rgba(245, 158, 11, 0.9);
    color: white;
  }

  &--secondary {
    background: rgba(0, 0, 0, 0.6);
    color: white;
  }
}

.card-info {
  padding: $spacing-md;
}

.card-filename {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: $spacing-xs;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-xs;
  color: var(--color-text-muted);
}
</style>
