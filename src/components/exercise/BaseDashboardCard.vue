<!--
  BaseDashboardCard.vue — 공통 대시보드 카드 레이아웃 컴포넌트
  - 검색박스와 리스트박스의 외곽 디자인을 공통화
  - header/default/footer Named Slot으로 제목, 본문, 하단 영역을 부모가 주입
-->
<template>
  <section class="base-dashboard-card">
    <header v-if="$slots.header" class="base-dashboard-card__header">
      <slot name="header"></slot>
    </header>

    <div class="base-dashboard-card__content">
      <slot></slot>
    </div>

    <footer v-if="$slots.footer" class="base-dashboard-card__footer">
      <slot name="footer"></slot>
    </footer>
  </section>
</template>

<style scoped>
.base-dashboard-card {
  background: var(--color-background-soft, #f8f9fa);
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.25rem;
  border: 1px solid var(--color-border, #e9ecef);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.base-dashboard-card__header {
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border, #e9ecef);
}

.base-dashboard-card__footer {
  margin-top: 1.25rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border, #e9ecef);
}
</style>
