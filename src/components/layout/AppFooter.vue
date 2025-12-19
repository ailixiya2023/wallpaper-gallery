<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <p class="footer-text">
          © {{ currentYear }} Wallpaper Gallery.
          <span class="footer-divider">|</span>
          Made with ❤️
        </p>
        <p class="footer-source">
          图片来源：
          <a
            href="https://github.com/IT-NuanxinPro/nuanXinProPic"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub 图床
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.app-footer {
  margin-top: auto;
  padding: $spacing-xl 0;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
}

.footer-container {
  max-width: $container-max-width;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  text-align: center;
}

.footer-text {
  font-size: $font-size-sm;
  color: var(--color-text-secondary);
}

.footer-divider {
  margin: 0 $spacing-sm;
  color: var(--color-border);
}

.footer-source {
  font-size: $font-size-xs;
  color: var(--color-text-muted);

  a {
    color: var(--color-accent);
    transition: color var(--transition-fast);

    &:hover {
      color: var(--color-accent-hover);
      text-decoration: underline;
    }
  }
}
</style>
