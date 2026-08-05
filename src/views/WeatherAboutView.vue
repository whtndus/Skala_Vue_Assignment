<template>
  <div class="about-page">
    <header class="about-heading">
      <p>ABOUT / WEATHER ATLAS</p>
      <h1>도시의 날씨를 읽는 방법</h1>
      <span>실시간 관측과 Vue 학습 요소를 하나의 에디토리얼 날씨 경험으로 구성했습니다.</span>
    </header>

    <section class="about-card">
      <div class="card-header">
        <h2>서비스에서 할 수 있는 일</h2>
      </div>
      <div class="feature-grid">
        <article>
          <span aria-hidden="true">01</span>
          <h3>빠른 도시 검색</h3>
          <p>도시 이름을 입력해 원하는 지역의 날씨 카드를 바로 찾을 수 있습니다.</p>
        </article>
        <article>
          <span aria-hidden="true">02</span>
          <h3>도시 아카이브</h3>
          <p>조회한 도시의 현재 기온과 상태를 정렬하고 즐겨찾기로 보관할 수 있습니다.</p>
        </article>
        <article>
          <span aria-hidden="true">03</span>
          <h3>지역별 상세 관측</h3>
          <p>도시별 대기·바람·일출 정보와 현재 위치 지도를 상세 화면에서 제공합니다.</p>
        </article>
      </div>
    </section>

    <section class="about-card technology-card">
      <div class="card-header">
        <h2>Vue 학습 요소</h2>
      </div>
      <ul>
        <li>
          <span class="technology-entry">
            <strong><code>ref</code> · <code>computed</code> · <code>watch</code></strong>
            <span>관측 도시와 필터·정렬 상태 구성</span>
          </span>
        </li>
        <li>Pinia로 실시간 날씨, 즐겨찾기, 온도 단위 설정을 역할별로 분리</li>
        <li>Props와 Emits로 검색 폼, 도시 행, 단위 전환 컴포넌트 연결</li>
        <li>Vue Router의 동적 도시 경로, query 동기화, navigation guard 활용</li>
        <li>Axios와 OpenWeather API를 이용한 현재 관측·예보 데이터 비동기 처리</li>
        <li>컴포넌트 생명주기에 맞춘 Leaflet 지도 생성·좌표 갱신·인스턴스 해제</li>
        <li>localStorage를 활용한 최소 즐겨찾기 정보 저장과 legacy 데이터 복구</li>
      </ul>
    </section>

    <RouterLink class="home-link" to="/">← 날씨 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 1180px;
  margin: 4rem auto;
  padding: 0 1.5rem;
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
  margin-bottom: 5rem;
  padding: 0;
  border: 0;
  border-top: 1px solid #292d2a;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
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
  padding: 2rem 2rem 2rem 0;
  border: 0;
  border-right: 1px solid #aaa8a1;
  border-bottom: 1px solid #aaa8a1;
  border-radius: 0;
  background: transparent;
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
  border-radius: 0;
  background: #303632;
  color: #fff;
  font-weight: 600;
}

.home-link:hover {
  background: #347abd;
}

@media (max-width: 700px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
}

/* WEATHER / ATLAS editorial system */
.about-page {
  width: min(100% - 3rem, 1280px);
  max-width: none;
  margin: 0 auto;
  padding: clamp(3rem, 6vw, 6rem) 0 7rem;
  color: var(--atlas-ink);
}

.about-heading {
  margin-bottom: clamp(4rem, 8vw, 7rem);
  padding: clamp(1.5rem, 3vw, 2.5rem) 0;
  border-top: 1px solid var(--atlas-line-strong);
  border-bottom: 1px solid var(--atlas-line);
}

.about-heading p {
  margin: 0 0 0.65rem;
  color: var(--atlas-accent);
  font-size: 0.75rem;
  font-weight: 750;
  letter-spacing: 0.16em;
}

.about-heading h1 {
  margin: 0 0 1rem;
  color: var(--atlas-ink);
  font-size: clamp(2rem, 4vw, 4rem);
  font-weight: 520;
  letter-spacing: -0.07em;
  line-height: 0.92;
}

.about-heading span {
  display: block;
  max-width: 48rem;
  color: var(--atlas-muted);
  font-size: clamp(0.9rem, 1.2vw, 1.05rem);
}

.about-card {
  margin-bottom: clamp(4rem, 7vw, 6rem);
  border-top-color: var(--atlas-line-strong);
}

.card-header {
  margin: 0;
  padding: 1rem 0 2rem;
  border-bottom-color: var(--atlas-line);
}

.card-header h2 {
  color: var(--atlas-ink);
  font-size: clamp(1.7rem, 3vw, 2.8rem);
  font-weight: 520;
  letter-spacing: -0.045em;
}

.feature-grid {
  gap: 0;
}

.feature-grid article {
  min-height: 260px;
  padding: 2rem 2rem 2rem 0;
  border-right-color: var(--atlas-line);
  border-bottom-color: var(--atlas-line);
}

.feature-grid article + article {
  padding-left: 2rem;
}

.feature-grid article:last-child {
  border-right: 0;
}

.feature-grid article > span {
  color: var(--atlas-accent);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 350;
}

.feature-grid h3 {
  margin: 2.5rem 0 0.7rem;
  color: var(--atlas-ink);
  font-size: clamp(1.15rem, 1.8vw, 1.45rem);
  font-weight: 600;
}

.feature-grid p,
.technology-card li {
  color: var(--atlas-muted);
  font-size: 0.9rem;
  line-height: 1.7;
}

.technology-card ul {
  gap: 0;
  padding: 0;
  list-style: none;
  counter-reset: technology-item;
}

.technology-card li {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  align-items: baseline;
  padding: 1.05rem 0;
  border-bottom: 1px solid var(--atlas-line);
  counter-increment: technology-item;
}

.technology-card li::before {
  color: var(--atlas-accent);
  font-size: 0.75rem;
  font-weight: 700;
  content: counter(technology-item, decimal-leading-zero);
}

.technology-card code {
  color: var(--atlas-accent);
}

.technology-entry {
  display: grid;
  gap: 0.15rem;
}

.technology-entry strong {
  color: var(--atlas-ink);
  font-weight: 650;
  white-space: nowrap;
}

.home-link {
  padding: 0.75rem 1rem;
  border: 1px solid var(--atlas-ink);
  border-radius: 1px;
  color: var(--atlas-paper-soft);
  background: var(--atlas-ink);
}

.home-link:hover {
  border-color: var(--atlas-accent);
  color: #fff;
  background: var(--atlas-accent);
}

.home-link:focus-visible {
  outline: 2px solid var(--atlas-accent);
  outline-offset: 3px;
}

@media (max-width: 700px) {
  .about-page {
    width: calc(100% - 2rem);
    padding: 2.5rem 0 5rem;
  }

  .about-heading h1 {
    font-size: clamp(2rem, 9vw, 3rem);
  }

  .feature-grid article,
  .feature-grid article + article {
    min-height: 0;
    padding: 1.5rem 0 2rem;
    border-right: 0;
  }

  .feature-grid h3 {
    margin-top: 1.25rem;
  }
}
</style>
