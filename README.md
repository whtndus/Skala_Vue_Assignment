# WEATHER / ATLAS

Vue 3로 만든 실시간 날씨 저널입니다. 홈 대시보드, 도시별 상세 관측, 2D 지도와 옷차림 추천을 `Cinematic Weather Journal` 콘셉트로 구성하고, Vue 학습 예제는 `VUE / FIELD NOTES`에 함께 정리했습니다.

날씨 화면은 하드코딩된 Mock Data 없이 OpenWeather API 응답만 사용합니다. API 키가 없거나 요청이 실패하면 가짜 날씨로 대체하지 않고 오류 안내와 안전한 빈 상태를 표시합니다.

## 주요 기능

### 날씨 홈

- 첫 진입 시 서울의 실시간 날씨 초기 조회
- Cinematic Hero와 도시별 Atlas 이미지
- 선택한 도시의 향후 18시간, 3시간 간격 예보
- City Index 안에서 새 실시간 관측 지점 추가
- 날씨 상태 필터, 이름·기온 정렬 및 즐겨찾기 도시 필터
- 검색한 도시를 중복 추가하지 않고 최신 관측값으로 갱신
- 즐겨찾기 도시를 `localStorage`에 최소 식별 정보로 저장
- 섭씨와 화씨 전역 단위 전환
- API 키 누락, 도시 검색 실패 및 빈 목록 상태 처리

### 도시 상세 관측

- 현재 기온, 체감 온도, 최저·최고 기온
- 습도, 대기압, 가시거리, 구름량
- 풍속, 풍향, 돌풍 및 최근 강수·적설량
- 도시 timezone 기준 일출·일몰·관측 시간
- 위도·경도 기반 Leaflet 2D 지도와 OpenStreetMap 링크
- 현재 관측값에 따른 오늘의 옷차림 추천
- 5일간 날씨 저널과 아침·낮·저녁 시간대별 옷차림 추천
- 상세 페이지 직접 새로고침 시 route query의 도시 이름으로 실시간 데이터 복원

### Vue 학습 페이지

- Reactivity, Directive, Event, `v-model`, Lifecycle
- Props/Emits, Slot, Pinia, Axios 실습
- ECMAScript 과제와 날씨 기반 미션
- ESLint, Prettier, Vite mode, 환경변수 및 빌드 실습
- sticky Curriculum과 단계별 `VUE / FIELD NOTES` 인터페이스

## 기술 구성

| 영역      | 사용 기술                                                     |
| --------- | ------------------------------------------------------------- |
| UI        | Vue 3, Composition API, Element Plus                          |
| 상태 관리 | Pinia, localStorage                                           |
| 라우팅    | Vue Router                                                    |
| API 통신  | Axios, OpenWeather Current Weather 및 5 Day / 3 Hour Forecast |
| 지도      | Leaflet, OpenStreetMap tiles                                  |
| 빌드      | Vite                                                          |
| 코드 품질 | ESLint, Oxlint, Prettier                                      |
| 배포      | GitHub Actions, GitHub Pages                                  |

## 라우트

| 경로               | 화면                | 설명                                      |
| ------------------ | ------------------- | ----------------------------------------- |
| `/`                | `WeatherHomeView`   | 실시간 날씨 홈과 City Index               |
| `/weather/:cityId` | `WeatherDetailView` | 도시별 상세 관측, 지도, 옷차림과 5일 예보 |
| `/about`           | `WeatherAboutView`  | 서비스 및 학습 요소 소개                  |
| `/practice`        | `PracticeView`      | Vue 핵심 개념과 과제 실습                 |
| `/404`             | `NotFoundView`      | 잘못된 상세 경로 안내                     |
| `/:pathMatch(.*)*` | `NotFoundView`      | 정의되지 않은 경로 안내                   |

상세 도시 ID는 OpenWeather 응답을 기준으로 `owm_숫자` 형식을 사용합니다. 직접 접근할 때 데이터를 복원할 수 있도록 도시 이름 query가 함께 전달됩니다.

```text
/weather/owm_1835848?city=서울
```

## 데이터 흐름

```text
앱 최초 진입
  └─ weatherStore.initializeWeather()
       ├─ 서울 실시간 조회
       └─ 저장된 즐겨찾기 이름을 실제 API로 제한적으로 재조회

관측 지점 추가
  └─ OpenWeather Geocoding API
       └─ 위도·경도
            └─ Current Weather API
                 └─ weatherStore.weatherList / active city

active city 좌표
  └─ 5 Day / 3 Hour Forecast API
       ├─ 홈: 앞의 6개 관측값 → 향후 18시간
       └─ 상세: 도시 현지 날짜별 그룹 → 5일 저널과 시간대별 옷차림
```

API 정규화는 `src/services/openWeatherApi.js`에서 처리합니다. 응답에 없는 관측값은 `0`으로 변환하지 않고 `null`을 유지하며, 화면에서는 해당 행을 숨기거나 `정보 없음`으로 표시합니다.

## 프로젝트 구조

```text
src/
├── App.vue
├── main.js
├── assets/
│   ├── base.css
│   ├── main.css
│   └── practice.css
├── components/
│   ├── exercise/
│   │   ├── FiveDayWeatherJournal.vue
│   │   ├── SearchBar.vue
│   │   ├── UnitToggler.vue
│   │   ├── WeatherCard.vue
│   │   ├── WeatherMap.vue
│   │   └── WeatherOutfit.vue
│   └── practices/
│       ├── basic/
│       ├── component/
│       ├── composition/
│       ├── library/
│       └── missions/
├── composables/
│   ├── useTemperature.js
│   └── useWeatherSearch.js
├── router/
│   └── index.js
├── services/
│   └── openWeatherApi.js
├── stores/
│   ├── configStore.js
│   ├── counter.js
│   ├── favoritesStore.js
│   └── weatherStore.js
├── utils/
│   ├── outfitRecommendation.js
│   └── weatherAtlas.js
└── views/
    ├── NotFoundView.vue
    ├── PracticeView.vue
    ├── WeatherAboutView.vue
    ├── WeatherDetailView.vue
    └── WeatherHomeView.vue
```

## 로컬 실행

### 1. 요구 환경

- Node.js `20.19.0` 이상 또는 `22.12.0` 이상
- OpenWeather API Key

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경변수 설정

프로젝트 루트의 `.env.example`을 참고해 `.env`를 만듭니다.

```env
VITE_WEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
```

`.env`, `.env.local`, `.env.*.local`은 Git에서 제외됩니다. 실제 API 키를 `.env.example`이나 소스코드에 입력하지 마세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

기본 개발 서버 포트는 `3000`입니다.

## 명령어

```bash
npm run dev            # 개발 서버
npm run lint           # Oxlint와 ESLint 검사 및 안전한 자동 수정
npm run format         # src 디렉터리 Prettier 포맷
npm run build          # production 정적 파일을 dist에 생성
npm run build:staging  # staging mode 빌드
npm run preview        # dist 로컬 미리보기
```

`dist/`는 빌드 산출물이므로 Git에서 제외됩니다. GitHub Pages에는 `dist`를 커밋하는 대신 Actions artifact로 전달합니다.

## GitHub Pages 배포

배포 워크플로는 `.github/workflows/deploy-pages.yml`에 정의되어 있습니다.

1. GitHub 저장소의 `Settings → Secrets and variables → Actions`로 이동합니다.
2. `OPENWEATHER_API_KEY`라는 이름의 Repository Secret을 등록합니다.
3. `Settings → Pages`에서 GitHub Actions 배포를 사용할 수 있는지 확인합니다.
4. 변경사항을 `main` 브랜치에 push하거나 Actions에서 워크플로를 수동 실행합니다.
5. 워크플로는 lint, build, Pages artifact 업로드와 배포를 순서대로 실행합니다.

배포 빌드에서는 저장소 이름을 읽어 `/Skala_Vue_Assignment/` base 경로를 자동 적용합니다. 또한 `dist/index.html`을 `dist/404.html`로 복사해 GitHub Pages에서 Vue Router 중첩 경로를 직접 열어도 앱이 시작되도록 처리합니다.

예상 배포 주소:

```text
https://whtndus.github.io/Skala_Vue_Assignment/
```

> `VITE_` 환경변수는 빌드 후 브라우저가 사용하는 JavaScript에 포함됩니다. Git 저장소에는 키를 올리지 않더라도 클라이언트에서 완전히 숨길 수는 없으므로 OpenWeather 계정에서 사용량을 확인하고 가능한 API 제한을 적용해야 합니다.

## 제출 전 확인

```bash
npm run lint
npm run build
git status
```

- ESLint와 Oxlint 오류가 없는지 확인합니다.
- `.env`가 Git 변경 목록에 포함되지 않는지 확인합니다.
- `dist/index.html`과 `dist/assets/`가 생성되는지 확인합니다.
- 홈, 상세, 서비스 소개, Vue 실습 및 404 화면을 확인합니다.
- 검색, 단위 변환, 필터·정렬, 즐겨찾기와 상세 새로고침을 확인합니다.
- 지도 타일과 OpenWeather API는 외부 서비스이므로 네트워크 실패 시 빈 상태가 안전하게 표시되는지 확인합니다.

## 외부 데이터와 저작자 표시

- 날씨 데이터: OpenWeather
- 지도 데이터 및 타일: © OpenStreetMap contributors

지도에는 OpenStreetMap attribution을 표시하며, 외부 타일이 로드되지 않아도 나머지 상세 관측 정보는 계속 사용할 수 있습니다.
