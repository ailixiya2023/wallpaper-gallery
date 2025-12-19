<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { formatFileSize, formatDate, getSizeLabel, getFileExtension, downloadFile } from '@/utils/format'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  wallpaper: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'prev', 'next'])

const imageLoaded = ref(false)
const imageError = ref(false)
const downloading = ref(false)

// Reset state when wallpaper changes
watch(() => props.wallpaper, () => {
  imageLoaded.value = false
  imageError.value = false
})

// Computed
const sizeInfo = computed(() => props.wallpaper ? getSizeLabel(props.wallpaper.size) : null)
const fileExt = computed(() => props.wallpaper ? getFileExtension(props.wallpaper.filename).toUpperCase() : '')
const formattedSize = computed(() => props.wallpaper ? formatFileSize(props.wallpaper.size) : '')
const formattedDate = computed(() => props.wallpaper ? formatDate(props.wallpaper.createdAt) : '')

// Handlers
const handleImageLoad = () => {
  imageLoaded.value = true
}

const handleImageError = () => {
  imageError.value = true
  imageLoaded.value = true
}

const handleClose = () => {
  emit('close')
}

const handlePrev = () => {
  emit('prev')
}

const handleNext = () => {
  emit('next')
}

const handleDownload = async () => {
  if (!props.wallpaper || downloading.value) return

  downloading.value = true
  try {
    await downloadFile(props.wallpaper.url, props.wallpaper.filename)
  } finally {
    downloading.value = false
  }
}

const handleOverlayClick = (e) => {
  if (e.target === e.currentTarget) {
    handleClose()
  }
}

// Keyboard navigation
const handleKeydown = (e) => {
  if (!props.isOpen) return

  switch (e.key) {
    case 'Escape':
      handleClose()
      break
    case 'ArrowLeft':
      handlePrev()
      break
    case 'ArrowRight':
      handleNext()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen && wallpaper" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-content">
          <!-- Close Button -->
          <button class="modal-close" @click="handleClose" aria-label="关闭">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <!-- Navigation Buttons -->
          <button class="modal-nav modal-nav--prev" @click="handlePrev" aria-label="上一张">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button class="modal-nav modal-nav--next" @click="handleNext" aria-label="下一张">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <!-- Image Container -->
          <div class="modal-image-container">
            <!-- Loading -->
            <div v-if="!imageLoaded" class="modal-loading">
              <LoadingSpinner size="lg" />
            </div>

            <!-- Error -->
            <div v-else-if="imageError" class="modal-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <p>图片加载失败</p>
            </div>

            <!-- Image -->
            <img
              v-show="imageLoaded && !imageError"
              :src="wallpaper.url"
              :alt="wallpaper.filename"
              class="modal-image"
              @load="handleImageLoad"
              @error="handleImageError"
            />
          </div>

          <!-- Info Panel -->
          <div class="modal-info">
            <div class="info-header">
              <h3 class="info-title">{{ wallpaper.filename }}</h3>
              <div class="info-tags">
                <span class="tag" :class="[`tag--${sizeInfo?.type}`]">
                  {{ sizeInfo?.label }}
                </span>
                <span class="tag tag--secondary">{{ fileExt }}</span>
              </div>
            </div>

            <div class="info-details">
              <div class="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                <span>{{ formattedSize }}</span>
              </div>
              <div class="detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{{ formattedDate }}</span>
              </div>
            </div>

            <button
              class="download-btn"
              :disabled="downloading"
              @click="handleDownload"
            >
              <LoadingSpinner v-if="downloading" size="sm" />
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              <span>{{ downloading ? '下载中...' : '下载壁纸' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-modal);
  backdrop-filter: blur(8px);
  padding: $spacing-md;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 90vw;
  max-height: 90vh;
  background: var(--color-bg-card);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);

  @include tablet-up {
    flex-direction: row;
    max-width: 1200px;
  }
}

.modal-close {
  position: absolute;
  top: $spacing-md;
  right: $spacing-md;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: $radius-full;
  color: white;
  transition: all var(--transition-fast);

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
}

.modal-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: $radius-full;
  color: white;
  transition: all var(--transition-fast);

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: translateY(-50%) scale(1.1);
  }

  svg {
    width: 24px;
    height: 24px;
  }

  &--prev {
    left: $spacing-md;
  }

  &--next {
    right: $spacing-md;

    @include tablet-up {
      right: calc(300px + $spacing-md);
    }
  }

  @include mobile-only {
    width: 40px;
    height: 40px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
}

.modal-image-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 300px;
  background: var(--color-bg-primary);

  @include tablet-up {
    min-width: 500px;
  }
}

.modal-loading,
.modal-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  color: var(--color-text-muted);

  svg {
    width: 48px;
    height: 48px;
  }
}

.modal-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;

  @include tablet-up {
    max-height: 80vh;
  }
}

.modal-info {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  padding: $spacing-lg;
  background: var(--color-bg-card);

  @include tablet-up {
    width: 300px;
    border-left: 1px solid var(--color-border);
  }
}

.info-header {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.info-title {
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: var(--color-text-primary);
  word-break: break-all;
}

.info-tags {
  display: flex;
  gap: $spacing-xs;
}

.tag {
  padding: 2px $spacing-sm;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  border-radius: $radius-sm;

  &--primary {
    background: var(--color-accent-light);
    color: var(--color-accent);
  }

  &--success {
    background: rgba(16, 185, 129, 0.1);
    color: var(--color-success);
  }

  &--warning {
    background: rgba(245, 158, 11, 0.1);
    color: var(--color-warning);
  }

  &--secondary {
    background: var(--color-bg-hover);
    color: var(--color-text-secondary);
  }
}

.info-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-sm;
  color: var(--color-text-secondary);

  svg {
    width: 16px;
    height: 16px;
    color: var(--color-text-muted);
  }
}

.download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  width: 100%;
  padding: $spacing-md;
  background: var(--color-accent);
  color: white;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  margin-top: auto;

  &:hover:not(:disabled) {
    background: var(--color-accent-hover);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

// Modal transition
.modal-enter-active,
.modal-leave-active {
  transition: all var(--transition-slow);

  .modal-content {
    transition: all var(--transition-slow);
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-content {
    transform: scale(0.95) translateY(20px);
  }
}
</style>
