# Vue 날씨 대시보드

Vue 3 Composition API와 Vue Router를 활용한 지역별 날씨 대시보드입니다. 기존 과제와 `skala-vue-practice` 실습 코드를 교안의 디렉터리 구조에 맞춰 하나의 프로젝트로 통합했습니다.

## 주요 기능

- 도시 이름 실시간/지연 검색
- URL 쿼리를 이용한 검색 상태 유지 (`/?q=부`)
- 날씨 상태 필터와 기온·도시 이름 정렬
- 상세 페이지 이동 후에도 검색·필터·정렬 상태 유지
- 검색 결과 수, 전체 평균 기온, 최고 기온 도시 계산
- 날씨 상태와 기온에 따른 카드 디자인 및 라벨 분기
- 도시 카드 선택 상태 표시
- 도시 ID를 이용한 상세 페이지 이동
- 상세 기상관측 Mock Data 표시
- 소개 페이지 및 정의되지 않은 경로의 404 처리
- 모든 페이지 컴포넌트 Lazy Loading
- Vue 반응형 상태, Lifecycle, Props/Emits, Slot, Pinia 실습 페이지
- Pinia 전역 설정을 이용한 섭씨·화씨 단위 전환
- Composable로 공통화한 메인·상세 화면 온도 변환
- 한국어·영어 도시 이름 검색을 통한 OpenWeather 실시간 날씨 조회
- API 오류 시 기존 Mock Data를 유지하는 안전한 데이터 흐름
- 오류 상태 뱃지·재시도 버튼과 Element Plus 로딩 스켈레톤
- 300ms debounce를 적용한 검색 및 URL 쿼리 동기화
- Pinia와 localStorage를 이용한 즐겨찾기 도시 저장
- 존재하지 않는 도시 ID를 404로 전환하는 전역 라우터 가드

## 라우트

| 경로               | 화면                | 설명                         |
| ------------------ | ------------------- | ---------------------------- |
| `/`                | `WeatherHomeView`   | 메인 날씨 대시보드           |
| `/weather/:cityId` | `WeatherDetailView` | 도시 ID 기반 상세 관측 정보  |
| `/about`           | `WeatherAboutView`  | 서비스 및 Vue 학습 요소 소개 |
| `/practice`        | `PracticeView`      | Vue 핵심 개념 및 Pinia 실습  |
| `/:pathMatch(.*)*` | `NotFoundView`      | 정의되지 않은 경로 안내      |

도시 상세 경로 예시는 `/weather/city_01`입니다. 검색·필터·정렬 상태가 있으면 `/weather/city_03?q=부&status=구름&sort=temp-desc`처럼 상세 경로에도 함께 전달됩니다. 존재하지 않는 도시 ID에는 별도의 정보 없음 화면이 표시됩니다.

## 프로젝트 구조

```text
src/
├── main.js
├── App.vue
├── router/
│   └── index.js
├── assets/
│   ├── base.css
│   ├── main.css
│   └── practice.css
├── components/
│   ├── exercise/
│   │   ├── BaseDashboardCard.vue
│   │   ├── SearchBar.vue
│   │   ├── UnitToggler.vue
│   │   └── WeatherCard.vue
│   ├── practices/
│   │   ├── basic/       # 디렉티브, 이벤트, 바인딩 실습
│   │   ├── composition/ # ref, reactive 실습
│   │   ├── component/   # Lifecycle, Props/Emits, Slot 실습
│   │   └── library/     # Pinia Store 실습
│   ├── icons/
│   └── WeatherApp.vue
├── composables/
│   ├── useTemperature.js
│   └── useWeatherSearch.js
├── data/
│   └── weatherData.js
├── services/
│   └── openWeatherApi.js
├── stores/
│   ├── configStore.js
│   ├── counter.js
│   ├── favoritesStore.js
│   └── weatherStore.js
└── views/
    ├── PracticeView.vue
    ├── WeatherHomeView.vue
    ├── WeatherDetailView.vue
    ├── WeatherAboutView.vue
    └── NotFoundView.vue
```

`WeatherApp.vue`는 기존 단일 컴포넌트와 비교하기 위한 참고 파일이며 현재 실행 흐름에서는 사용하지 않습니다.

## 데이터 흐름

```text
SearchBar
  ├─ update-query → 기존 카드 실시간 필터
  └─ search-city → Geocoding API → 위도·경도 → OpenWeather API
                         ↓
                   weatherStore
                         ↓
WeatherHomeView ─ useWeatherSearch(weatherList)
  ├─ 검색 결과 및 통계 계산
  └─ WeatherCard
       ├─ select-card → 선택 상태 표시
       └─ click-detail(cityId)
              ↓
        /weather/:cityId
              ↓
       WeatherDetailView ─ weatherStore에서 도시 조회
```

## 실행 방법

```bash
npm install
npm run dev
```

OpenWeather API를 사용하려면 프로젝트 루트에 `.env`를 만들고 키를 설정합니다.

```env
VITE_WEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
```

프로덕션 빌드는 다음 명령으로 검증합니다.

```bash
npm run build
npm run preview
```

배포된 서비스는 [weathervueassignment.vercel.app](https://weathervueassignment.vercel.app)에서 확인할 수 있습니다.

## 확인 항목

1. `/`에서 검색, 통계, 카드 선택 기능이 동작하는지 확인합니다.
2. 검색 후 URL에 `q`가 반영되고 새로고침해도 검색 결과가 유지되는지 확인합니다.
3. 상세보기 버튼 클릭 시 `/weather/city_01` 형식으로 이동하는지 확인합니다.
4. 상세 페이지에서 도시별 관측 정보와 홈 복귀 링크가 표시되는지 확인합니다.
5. `/about`에서 소개 내용과 홈 복귀 링크가 표시되는지 확인합니다.
6. 존재하지 않는 경로에서 404 화면이 표시되는지 확인합니다.
7. `npm run build` 실행 시 각 페이지가 별도 청크로 생성되는지 확인합니다.
8. `/practice`에서 각 실습 예제와 Pinia 카운터가 정상 동작하는지 확인합니다.
9. 상단 단위 버튼으로 메인 카드·통계·상세 화면의 온도가 함께 전환되는지 확인합니다.
