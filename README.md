# Vue 날씨 대시보드 (Composition API)

Vue 3 Composition API(`<script setup>`)를 활용한 날씨 대시보드 과제입니다.

## 과제 요구사항

| # | 요구사항 | 사용 API |
|---|---------|----------|
| 1 | 반응형 상태 관리 (`searchQuery`, `selectedCityInfo`, `weatherList`) | `ref()` |
| 2 | 검색어 기반 실시간 필터링 (`filteredWeatherList`) | `computed()` |
| 3 | 반응형 변수 변화 감시 | `watch()`, `watchEffect()` |
| 4 | 조건부 검색 결과 표시 (빈 검색어 / 매칭 / 미매칭) | `v-if`, `v-else` |

## 주요 기능

- **배열 렌더링**: `v-for` + `:key`로 도시별 날씨 카드 렌더링
- **조건부 렌더링**: 기온 25도 기준 더움/선선함 라벨 분기
- **양방향 바인딩**: `:value` + `@input` 조합으로 한글 IME 실시간 처리
- **이벤트 수식어**: `@click.stop`으로 상세보기 버튼 이벤트 버블링 차단
- **computed**: 검색어 입력 시 실시간 도시 필터링
- **watch**: `selectedCityInfo` 변경 시 콘솔 로그 출력
- **watchEffect**: `searchQuery` 변경 자동 추적 및 콘솔 로그 출력

## 기술 스택

- Vue 3 (Composition API + `<script setup>`)
- Vite
- Vanilla CSS (Scoped)

## 실행 방법

```bash
npm install
npm run dev
```

## 프로젝트 구조

```
Skala_Vue_Assignment/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js
    ├── App.vue
    ├── assets/
    │   ├── base.css
    │   └── main.css
    └── components/
        └── WeatherApp.vue    # 메인 날씨 대시보드 컴포넌트
```
