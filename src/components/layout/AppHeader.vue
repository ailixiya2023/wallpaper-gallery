<script setup>
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo & Title -->
      <div class="header-brand">
        <div class="brand-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <div class="brand-text">
          <h1 class="brand-title">
            Wallpaper Gallery
          </h1>
          <span class="brand-subtitle">精选高清壁纸</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="header-actions">
        <button
          class="theme-toggle"
          :aria-label="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
          @click="toggleTheme"
        >
          <!-- Sun Icon -->
          <svg v-if="theme === 'dark'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          <!-- Moon Icon -->
          <svg v-else class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>

        <a
          href="https://github.com/IT-NuanxinPro/wallpaper-gallery"
          target="_blank"
          rel="noopener noreferrer"
          class="github-link"
          aria-label="GitHub"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(10px);
  transition: all var(--transition-normal);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: $container-max-width;
  margin: 0 auto;
  padding: $spacing-md $spacing-lg;
  height: $header-height;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
  border-radius: $radius-md;
  color: white;

  svg {
    width: 24px;
    height: 24px;
  }
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: var(--color-text-primary);
  line-height: 1.2;

  @include mobile-only {
    font-size: $font-size-md;
  }
}

.brand-subtitle {
  font-size: $font-size-xs;
  color: var(--color-text-muted);

  @include mobile-only {
    display: none;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.theme-toggle,
.github-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: $radius-full;
  color: var(--color-text-secondary);
  background: transparent;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-bg-hover);
    color: var(--color-text-primary);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  .icon {
    width: 20px;
    height: 20px;
  }
}
</style>
