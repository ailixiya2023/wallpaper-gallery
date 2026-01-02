<script setup>
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div v-if="isLoading" class="mobile-load-more">
    <div class="loading-more">
      <LoadingSpinner size="sm" />
      <span>加载中...</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mobile-load-more {
  padding: $spacing-lg 0;
  text-align: center;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  color: var(--color-text-muted);
  font-size: $font-size-sm;
}
</style>
