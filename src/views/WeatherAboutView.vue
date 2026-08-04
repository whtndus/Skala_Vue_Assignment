<template>
  <div class="about-page">
    <section class="about-card">
      <div class="card-header">
        <h2>💡 서비스에서 할 수 있는 일</h2>
      </div>
      <div class="feature-grid">
        <article>
          <span aria-hidden="true">🔍</span>
          <h3>빠른 도시 검색</h3>
          <p>도시 이름을 입력해 원하는 지역의 날씨 카드를 바로 찾을 수 있습니다.</p>
        </article>
        <article>
          <span aria-hidden="true">📊</span>
          <h3>날씨 통계 요약</h3>
          <p>검색 결과 수와 평균 기온, 가장 더운 도시를 실시간으로 확인합니다.</p>
        </article>
        <article>
          <span aria-hidden="true">🗺️</span>
          <h3>지역별 상세 관측</h3>
          <p>도시별 체감 온도, 습도, 풍속과 강수 확률을 상세 화면에서 제공합니다.</p>
        </article>
      </div>
    </section>

    <section class="about-card technology-card">
      <div class="card-header">
        <h2>🛠️ Vue 학습 요소</h2>
      </div>
      <ul>
        <li>Composition API와 <code>&lt;script setup&gt;</code></li>
        <li>Props, Emits를 활용한 컴포넌트 통신</li>
        <li>Named Slot과 Scoped Slot을 활용한 UI 조립</li>
        <li>Composable로 분리한 검색 상태와 파생 데이터</li>
        <li>Vue Router의 Lazy Loading과 동적 경로 매칭</li>
      </ul>
    </section>

    <RouterLink class="home-link" to="/">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-heading {
  margin-bottom: 1.5rem;
  text-align: center;
}

.page-heading > span {
  font-size: 3rem;
}

.page-heading h1 {
  margin: 0.35rem 0 0.2rem;
  color: var(--color-heading, #2c3e50);
  font-size: 2rem;
  font-weight: 700;
}

.page-heading p {
  color: #777;
}

.about-card {
  margin-bottom: 1.25rem;
  padding: 1.25rem;
  border: 1px solid var(--color-border, #e9ecef);
  border-radius: 12px;
  background: var(--color-background-soft, #f8f9fa);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.card-header {
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border, #e9ecef);
}

.card-header h2 {
  margin: 0;
  color: var(--color-heading, #2c3e50);
  font-size: 1.2rem;
  font-weight: 600;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.feature-grid article {
  padding: 1.2rem;
  border: 1px solid var(--color-border, #e9ecef);
  border-radius: 10px;
  background: var(--color-background, #fff);
}

.feature-grid article > span {
  font-size: 1.8rem;
}

.feature-grid h3 {
  margin: 0.55rem 0 0.35rem;
  color: #4a90d9;
  font-size: 1rem;
  font-weight: 700;
}

.feature-grid p,
.technology-card li {
  color: #777;
  font-size: 0.88rem;
}

.technology-card ul {
  display: grid;
  gap: 0.55rem;
  margin: 0;
  padding-left: 1.25rem;
}

.technology-card code {
  color: #4a90d9;
  font-weight: 600;
}

.home-link {
  display: inline-flex;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  background: #4a90d9;
  color: #fff;
  font-weight: 600;
}

.home-link:hover {
  background: #347abd;
}

@media (max-width: 700px) {
  .feature-grid { grid-template-columns: 1fr; }
}
</style>
