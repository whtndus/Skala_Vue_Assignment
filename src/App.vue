<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import UnitToggler from '@/components/exercise/UnitToggler.vue'

const route = useRoute()
const showUnitToggler = computed(() => ['weather-home', 'weather-detail'].includes(String(route.name)))
</script>

<template>
  <div class="app-shell" :class="{ 'atlas-route': route.name === 'weather-home' }">
    <header class="site-header">
      <h1>WEATHER</h1>

      <div class="header-controls">
        <nav class="navigation" aria-label="주요 메뉴">
          <RouterLink to="/">날씨 대시보드</RouterLink>
          <RouterLink to="/practice">Vue 실습</RouterLink>
          <RouterLink to="/about">서비스 소개</RouterLink>
        </nav>
        <UnitToggler v-if="showUnitToggler" />
      </div>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  overflow-x: clip;
}

.site-header {
  --unit-control-color: #1e211f;
  --unit-control-muted: #6c706c;
  --unit-control-divider: #aaa8a1;
  position: sticky;
  z-index: 50;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
  margin: 0 auto;
  padding: 1.25rem max(1.5rem, calc((100vw - 1280px) / 2));
  border-bottom: 1px solid rgba(27, 30, 29, 0.2);
  background: rgba(247, 246, 242, 0.96);
}

.site-header h1 {
  margin: 0;
  color: #1e211f;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.navigation {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 1.35rem;
}

.header-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 0.75rem;
}

.navigation a {
  padding: 0.25rem 0;
  border-bottom: 1px solid transparent;
  color: #5f625f;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.navigation a:hover,
.navigation a.router-link-exact-active {
  color: #1e211f;
  border-bottom-color: currentColor;
  background: transparent;
}

.navigation a:focus-visible {
  outline: 2px solid var(--atlas-accent);
  outline-offset: 4px;
}

.atlas-route .navigation a:focus-visible {
  outline-color: #f2efe7;
}

.main-content {
  padding-bottom: 3rem;
}

.atlas-route .site-header {
  --unit-control-color: #fff;
  --unit-control-muted: rgba(255, 255, 255, 0.62);
  --unit-control-divider: rgba(255, 255, 255, 0.35);
  position: fixed;
  z-index: 50;
  top: 0;
  right: 0;
  left: 0;
  border-color: rgba(255, 255, 255, 0.32);
  background: rgba(24, 28, 26, 0.88);
}

.atlas-route .site-header h1,
.atlas-route .navigation a {
  color: rgba(255, 255, 255, 0.9);
}

.atlas-route .main-content {
  padding-bottom: 0;
}

@media (max-width: 760px) {
  .header-controls {
    width: 100%;
  }

  .navigation {
    flex: 1 1 auto;
    min-width: 0;
    width: 100%;
    justify-content: flex-start;
    gap: 1rem;
    overflow-x: auto;
  }

  .navigation a {
    flex: 0 0 auto;
    text-align: center;
  }

  .site-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.65rem;
    padding: 1rem;
  }
}
</style>
