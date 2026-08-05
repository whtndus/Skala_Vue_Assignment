<script setup>
const currentMode = import.meta.env.MODE
const currentApiUrl = import.meta.env.VITE_API_URL || '현재 모드에는 VITE_API_URL이 설정되지 않았습니다.'

const eslintConfigExample = `// eslint.config.js
{
  name: 'app/custom-rules',
  rules: {
    eqeqeq: ['error', 'always'],
    'no-console': 'off',
  },
}`

const eslintErrorExample = `const userAge = 20

// 실습할 때만 컴포넌트에 입력하고 오류를 확인한 뒤 제거합니다.
if (userAge == 20) {
  console.log('스무 살 사용자입니다.')
}

// 예상 메시지
// Expected '===' and instead saw '=='.  eqeqeq`

const prettierBeforeExample = `const   myRegion  = \`Suwon\` ;
const regionGreeting = \`웰컴 투 \${myRegion}\`;`

const prettierAfterExample = `const myRegion = \`Suwon\`
const regionGreeting = \`웰컴 투 \${myRegion}\``

const environmentExample = `# .env.staging
VITE_API_URL=https://api-stage.skcc.com

# .env.production
VITE_API_URL=https://api-prod.skcc.com

// Vue component
console.log(import.meta.env.MODE)
console.log(import.meta.env.VITE_API_URL)`

const buildExample = `// package.json
"build:staging": "vite build --mode staging"

# staging 환경 빌드
npm run build:staging

# production 환경 빌드
npm run build

# 결과 확인
dist/
dist/assets/index-[hash].js`
</script>

<template>
  <div class="practice-section tooling-mission">
    <header class="mission-intro">
      <p>CODE CHALLENGE / QUALITY GATE</p>
      <h2>코드 품질과 환경별 빌드 실습</h2>
      <span>오류를 일부러 커밋하지 않고, 예제 코드를 복사해 검사한 뒤 원상 복구하는 실습입니다.</span>
    </header>

    <article class="mission-block">
      <div class="mission-heading">
        <span>01</span>
        <h3>ESLint Custom 규칙</h3>
      </div>
      <p><code>eqeqeq</code>는 엄격한 비교를 강제하고, <code>no-console</code>은 학습 중 로그 출력을 허용합니다.</p>
      <div class="code-grid">
        <div>
          <small>CONFIG</small>
          <pre><code>{{ eslintConfigExample }}</code></pre>
        </div>
        <div>
          <small>ERROR SPECIMEN</small>
          <pre><code>{{ eslintErrorExample }}</code></pre>
        </div>
      </div>
      <p class="command-line"><span>RUN</span><code>npm run lint</code></p>
    </article>

    <article class="mission-block">
      <div class="mission-heading">
        <span>02</span>
        <h3>Prettier 포맷팅</h3>
      </div>
      <p>공백과 세미콜론이 섞인 코드를 저장한 뒤 포맷 명령 전후를 비교합니다. 문자열 의미와 백틱은 유지됩니다.</p>
      <div class="code-grid">
        <div>
          <small>BEFORE</small>
          <pre><code>{{ prettierBeforeExample }}</code></pre>
        </div>
        <div>
          <small>AFTER</small>
          <pre><code>{{ prettierAfterExample }}</code></pre>
        </div>
      </div>
      <p class="command-line"><span>RUN</span><code>npm run format</code></p>
    </article>

    <article class="mission-block">
      <div class="mission-heading">
        <span>03</span>
        <h3>Env와 Staging 모드</h3>
      </div>
      <p>Vite의 mode에 맞는 환경 파일이 자동으로 선택됩니다. 파일명 대신 실제 주입된 값으로 로드 결과를 확인합니다.</p>
      <pre><code>{{ environmentExample }}</code></pre>
      <dl class="runtime-state">
        <div>
          <dt>MODE</dt>
          <dd>{{ currentMode }}</dd>
        </div>
        <div>
          <dt>VITE_API_URL</dt>
          <dd>{{ currentApiUrl }}</dd>
        </div>
      </dl>
    </article>

    <article class="mission-block">
      <div class="mission-heading">
        <span>04</span>
        <h3>Vite 배포 빌드</h3>
      </div>
      <p>환경별 빌드가 끝나면 <code>dist</code>와 해시가 포함된 JavaScript asset 이름을 확인합니다.</p>
      <pre><code>{{ buildExample }}</code></pre>
      <ol class="check-list">
        <li><code>dist/index.html</code> 생성 확인</li>
        <li><code>dist/assets</code>의 CSS·JavaScript·이미지 확인</li>
        <li>파일명에 content hash가 포함됐는지 확인</li>
      </ol>
    </article>
  </div>
</template>

<style scoped>
.tooling-mission {
  display: grid;
  gap: 0;
}
.mission-intro {
  padding-bottom: 1.5rem;
}
.mission-intro p {
  margin: 0 0 0.4rem;
  color: var(--atlas-accent);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}
.mission-intro h2 {
  margin: 0 0 0.5rem;
  padding: 0;
  border: 0;
}
.mission-intro span,
.mission-block > p {
  color: var(--atlas-muted);
}
.mission-block {
  padding: 1.5rem 0 1.75rem;
  border-top: 1px solid var(--atlas-line);
}
.mission-heading {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
}
.mission-heading span {
  color: var(--atlas-accent);
  font-family: var(--font-mono);
  font-size: 0.7rem;
}
.mission-heading h3 {
  margin: 0;
}
.mission-block > p {
  margin: 0.65rem 0 1rem;
}
.code-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  background: var(--atlas-line);
}
.code-grid > div {
  min-width: 0;
  padding: 0.8rem;
  background: #272b29;
}
.code-grid small {
  color: #a9b9bd;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}
pre {
  max-width: 100%;
  margin: 0.55rem 0 0;
  padding: 1rem;
  overflow: auto;
  border-radius: 1px;
  color: #f1efe8;
  background: #272b29;
  font-size: 0.76rem;
  line-height: 1.65;
}
.code-grid pre {
  padding: 0;
}
code {
  font-family: var(--font-mono);
}
.command-line {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--atlas-line);
}
.command-line span {
  color: var(--atlas-accent);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}
.runtime-state {
  margin: 1rem 0 0;
  border-top: 1px solid var(--atlas-line);
}
.runtime-state div {
  display: grid;
  grid-template-columns: 9rem minmax(0, 1fr);
  gap: 1rem;
  padding: 0.65rem 0;
  border-bottom: 1px solid var(--atlas-line);
}
.runtime-state dt {
  color: var(--atlas-muted);
  font-size: 0.68rem;
  font-weight: 800;
}
.runtime-state dd {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
  font-family: var(--font-mono);
}
.check-list {
  display: grid;
  gap: 0.45rem;
  margin: 1rem 0 0;
  padding-left: 1.3rem;
  color: var(--atlas-muted);
}
@media (max-width: 720px) {
  .code-grid {
    grid-template-columns: 1fr;
  }
  .runtime-state div {
    grid-template-columns: 1fr;
    gap: 0.2rem;
  }
}
</style>
