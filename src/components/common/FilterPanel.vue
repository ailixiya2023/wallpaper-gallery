<script setup>
import { SORT_OPTIONS, FORMAT_OPTIONS } from '@/utils/constants'

const props = defineProps({
  sortBy: {
    type: String,
    default: 'newest'
  },
  formatFilter: {
    type: String,
    default: 'all'
  },
  resultCount: {
    type: Number,
    default: 0
  },
  totalCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:sortBy', 'update:formatFilter'])

const handleSortChange = (e) => {
  emit('update:sortBy', e.target.value)
}

const handleFormatChange = (e) => {
  emit('update:formatFilter', e.target.value)
}
</script>

<template>
  <div class="filter-panel">
    <div class="filter-left">
      <span class="result-count">
        共 <strong>{{ resultCount }}</strong> 张壁纸
        <span v-if="resultCount !== totalCount" class="filtered-hint">
          (筛选自 {{ totalCount }} 张)
        </span>
      </span>
    </div>

    <div class="filter-right">
      <!-- Format Filter -->
      <div class="filter-item">
        <label class="filter-label" for="format-filter">格式</label>
        <select
          id="format-filter"
          class="filter-select"
          :value="formatFilter"
          @change="handleFormatChange"
        >
          <option
            v-for="option in FORMAT_OPTIONS"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Sort -->
      <div class="filter-item">
        <label class="filter-label" for="sort-select">排序</label>
        <select
          id="sort-select"
          class="filter-select"
          :value="sortBy"
          @change="handleSortChange"
        >
          <option
            v-for="option in SORT_OPTIONS"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
  padding: $spacing-md 0;
}

.filter-left {
  display: flex;
  align-items: center;
}

.result-count {
  font-size: $font-size-sm;
  color: var(--color-text-secondary);

  strong {
    color: var(--color-text-primary);
    font-weight: $font-weight-semibold;
  }
}

.filtered-hint {
  color: var(--color-text-muted);
  font-size: $font-size-xs;
}

.filter-right {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.filter-label {
  font-size: $font-size-sm;
  color: var(--color-text-muted);
  white-space: nowrap;

  @include mobile-only {
    display: none;
  }
}

.filter-select {
  padding: $spacing-xs $spacing-lg $spacing-xs $spacing-sm;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  color: var(--color-text-primary);
  font-size: $font-size-sm;
  cursor: pointer;
  transition: all var(--transition-fast);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;

  &:hover {
    border-color: var(--color-text-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-light);
  }
}
</style>
