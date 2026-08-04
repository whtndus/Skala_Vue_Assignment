<template>
  <div class="app-shell">
    <header class="site-header">
      <h1>🌤️ 지역별 날씨 대시보드</h1>

      <nav class="navigation" aria-label="주요 메뉴">
        <RouterLink to="/">날씨 대시보드</RouterLink>
        <RouterLink to="/about">서비스 소개</RouterLink>
      </nav>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: calc(100vh - 4rem);
}

.site-header {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 900px;
  margin: 0 auto 1.5rem;
  padding: 0 1rem;
  text-align: center;
}

.site-header h1 {
  margin: 0;
  color: var(--color-heading, #2c3e50);
  font-size: 2rem;
  font-weight: 700;
}

.navigation {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
}

.navigation a {
  padding: 0.45rem 0.8rem;
  border-radius: 8px;
  color: var(--color-text, #2c3e50);
  font-size: 0.9rem;
  font-weight: 600;
}

.navigation a:hover,
.navigation a.router-link-exact-active {
  color: #1a6fa8;
  background: #dff1fb;
}

.main-content {
  padding-bottom: 1.5rem;
}

@media (max-width: 600px) {
  .navigation {
    width: 100%;
  }

  .navigation a {
    flex: 0 1 auto;
    text-align: center;
  }

  .site-header h1 {
    font-size: 1.65rem;
  }
}
</style>
