<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '搜索壁纸...'
  }
})

const emit = defineEmits(['update:modelValue'])

const inputRef = ref(null)
const isFocused = ref(false)

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  localValue.value = val
})

const handleInput = (e) => {
  localValue.value = e.target.value
  emit('update:modelValue', e.target.value)
}

const clearInput = () => {
  localValue.value = ''
  emit('update:modelValue', '')
  inputRef.value?.focus()
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}
</script>

<template>
  <div class="search-bar" :class="{ 'is-focused': isFocused }">
    <!-- Search Icon -->
    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>

    <!-- Input -->
    <input
      ref="inputRef"
      type="text"
      class="search-input"
      :placeholder="placeholder"
      :value="localValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />

    <!-- Clear Button -->
    <button
      v-if="localValue"
      class="clear-btn"
      type="button"
      @click="clearInput"
      aria-label="清除搜索"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: $radius-full;
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--color-text-muted);
  }

  &.is-focused {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-light);
  }
}

.search-icon {
  position: absolute;
  left: $spacing-md;
  width: 18px;
  height: 18px;
  color: var(--color-text-muted);
  pointer-events: none;
  transition: color var(--transition-fast);

  .is-focused & {
    color: var(--color-accent);
  }
}

.search-input {
  width: 100%;
  padding: $spacing-sm $spacing-xl;
  padding-left: 44px;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  font-size: $font-size-sm;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    outline: none;
  }
}

.clear-btn {
  position: absolute;
  right: $spacing-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: $radius-full;
  color: var(--color-text-muted);
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-bg-hover);
    color: var(--color-text-primary);
  }

  svg {
    width: 14px;
    height: 14px;
  }
}
</style>
