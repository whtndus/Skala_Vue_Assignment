# Vue 날씨 대시보드

Vue 3 Composition API와 `<script setup>`을 활용한 날씨 대시보드 과제입니다. 단일 컴포넌트로 작성했던 화면을 역할에 따라 4개 컴포넌트로 분리하고, 검색 로직은 재사용 가능한 Composable로 추출했습니다.

## 과제 요구사항

| # | 요구사항 | 사용 API |
|---|---|---|
| 1 | 날씨 목록, 검색어, 선택 도시 등 반응형 상태 관리 | `ref()` |
| 2 | 검색 결과, 매칭 도시, 통계 데이터 계산 | `computed()` |
| 3 | 최초 실행과 검색어 변경 감시 | `watch()`, `immediate: true` |
| 4 | 검색 결과 및 기온에 따른 조건부 렌더링 | `v-if`, `v-else` |
| 5 | 부모와 자식 간 데이터 및 이벤트 전달 | `props`, `emits` |
| 6 | 공통 카드 영역과 상세보기 영역 커스터마이징 | Named Slot, Scoped Slot |
| 7 | 검색 상태와 로직 재사용 | Composable |

## 주요 기능

- `v-for`와 `:key`를 사용한 도시별 날씨 카드 렌더링
- 도시 이름 부분 검색 및 실시간 필터링
  - 예: `부` 입력 시 `부산, 부천`을 모두 표시
- 기온 25°C를 기준으로 더움/선선함 라벨 분기
- `:value`, `@input`, `update-query` 이벤트를 이용한 한글 검색어 동기화
- 카드 클릭 시 선택 도시 상태 표시
- 상세보기 클릭 시 날씨 알림 출력
- `@click.stop`을 이용한 상세보기 버튼의 이벤트 버블링 차단
- 검색 결과 수, 전체 평균 기온, 최고 기온 도시 표시
- 검색 결과가 없을 때 안내 문구 표시
- `watch(..., { immediate: true })`를 이용한 최초 실행 및 검색어 변경 로그

## 컴포넌트 구성

### `WeatherParent.vue`

- 원본 날씨 목록과 선택 도시 상태 관리
- 평균 기온과 최고 기온 도시 계산
- 하위 컴포넌트 및 Composable 조립
- `BaseDashboardCard`의 `header`, `footer` 슬롯 주입
- `WeatherCard`의 `actions` Scoped Slot을 사용해 상세보기 버튼 커스터마이징

### `BaseDashboardCard.vue`

- 검색 영역과 날씨 목록 영역의 공통 카드 레이아웃 제공
- `header`, default, `footer` Named Slot 제공
- 전달받은 슬롯이 있을 때만 header와 footer 렌더링

### `SearchBar.vue`

- `currentQuery`, `matchedCities` props 수신
- 입력 시 `update-query` 이벤트 발화
- 검색어에 매칭되는 모든 도시 이름 표시

### `WeatherCard.vue`

- `cityItem` prop으로 개별 도시 데이터 수신
- 카드 선택 시 `select-card` 이벤트 발화
- 상세보기 요청 시 `click-detail` 이벤트 발화
- `actions` Scoped Slot에 `city`, `requestDetail` 제공
- 부모가 `actions` 슬롯을 전달하지 않으면 기본 상세보기 버튼 표시

### `useWeatherSearch.js`

- `searchQuery` 검색 상태 관리
- `filteredWeatherList`, `matchedCities`, `resultCount` 계산
- 검색 로직을 컴포넌트 외부로 분리하여 재사용 가능
- `immediate: true` 옵션으로 최초 실행 시에도 검색 결과 로그 출력

## 데이터 흐름

```text
SearchBar
  └─ update-query 이벤트
       ↓
WeatherParent
  └─ useWeatherSearch(weatherList)
       ├─ filteredWeatherList
       ├─ matchedCities
       └─ resultCount
            ↓
WeatherCard
  ├─ select-card 이벤트
  └─ click-detail 이벤트
```

## 기술 스택

- Vue 3.5
- Composition API + `<script setup>`
- Vite
- Vanilla CSS + `<style scoped>`

## 실행 방법

```bash
npm install
npm run dev
```

프로덕션 빌드를 검증하려면 다음 명령을 실행합니다.

```bash
npm run build
npm run preview
```

> 현재 프로젝트에는 별도의 lint 스크립트가 없습니다.

## 확인 항목

1. 검색창에 `부`를 입력했을 때 부산과 부천 카드가 모두 표시되는지 확인합니다.
2. 검색창 아래에 `부산, 부천`이 표시되는지 확인합니다.
3. 카드 클릭 시 선택 도시 상태바가 변경되는지 확인합니다.
4. 상세보기 버튼 클릭 시 알림만 출력되고 카드 선택 이벤트는 발생하지 않는지 확인합니다.
5. 검색 결과가 없을 때 결과 없음 안내가 표시되는지 확인합니다.
6. 최초 화면 로드 시 개발자 도구 콘솔에 다음 형식의 로그가 출력되는지 확인합니다.

```text
[watch immediate] 현재 검색어 ''에 매칭되는 도시 6개를 필터링합니다.
```

## 프로젝트 구조

```text
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
    ├── components/
    │   ├── WeatherParent.vue       # 메인 날씨 대시보드 부모
    │   ├── BaseDashboardCard.vue   # Named Slot 공통 레이아웃
    │   ├── SearchBar.vue           # 도시 검색 입력
    │   ├── WeatherCard.vue         # Scoped Slot 개별 날씨 카드
    │   └── WeatherApp.vue          # 미사용: 기존 단일 컴포넌트 참고용
    └── composables/
        └── useWeatherSearch.js     # 재사용 가능한 검색 로직
```

현재 애플리케이션 진입점인 `App.vue`는 `WeatherParent.vue`를 마운트합니다. `WeatherApp.vue`는 실행에 사용되지 않으며 기존 단일 컴포넌트와 비교하기 위한 참고 파일입니다.
