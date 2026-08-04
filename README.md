# Vue 날씨 대시보드

Vue 3 Composition API와 Vue Router를 활용한 지역별 날씨 대시보드입니다. 검색과 통계, 컴포넌트 통신 및 Slot 실습 구조를 유지하면서 페이지 라우팅과 도시별 상세 화면을 추가했습니다.

## 주요 기능

- 도시 이름 실시간/지연 검색
- URL 쿼리를 이용한 검색 상태 유지 (`/?q=부`)
- 검색 결과 수, 전체 평균 기온, 최고 기온 도시 계산
- 날씨 상태와 기온에 따른 카드 디자인 및 라벨 분기
- 도시 카드 선택 상태 표시
- 도시 ID를 이용한 상세 페이지 이동
- 상세 기상관측 Mock Data 표시
- 소개 페이지 및 정의되지 않은 경로의 404 처리
- 모든 페이지 컴포넌트 Lazy Loading

## 라우트

| 경로 | 화면 | 설명 |
|---|---|---|
| `/` | `WeatherHomeView` | 메인 날씨 대시보드 |
| `/weather/:cityId` | `WeatherDetailView` | 도시 ID 기반 상세 관측 정보 |
| `/about` | `WeatherAboutView` | 서비스 및 Vue 학습 요소 소개 |
| `/:pathMatch(.*)*` | `NotFoundView` | 정의되지 않은 경로 안내 |

도시 상세 경로 예시는 `/weather/city_01`입니다. 존재하지 않는 도시 ID에는 별도의 정보 없음 화면이 표시됩니다.

## 프로젝트 구조

```text
src/
├── main.js
├── App.vue
├── router/
│   └── index.js
├── assets/
│   ├── base.css
│   └── main.css
├── components/
│   ├── exercise/
│   │   ├── BaseDashboardCard.vue
│   │   ├── SearchBar.vue
│   │   └── WeatherCard.vue
│   └── WeatherApp.vue
├── composables/
│   └── useWeatherSearch.js
├── data/
│   └── weatherData.js
└── views/
    ├── WeatherHomeView.vue
    ├── WeatherDetailView.vue
    ├── WeatherAboutView.vue
    └── NotFoundView.vue
```

`WeatherApp.vue`는 기존 단일 컴포넌트와 비교하기 위한 참고 파일이며 현재 실행 흐름에서는 사용하지 않습니다.

## 데이터 흐름

```text
SearchBar
  └─ update-query
       ↓
WeatherHomeView ─ useWeatherSearch(weatherList)
  ├─ 검색 결과 및 통계 계산
  └─ WeatherCard
       ├─ select-card → 선택 상태 표시
       └─ click-detail(cityId)
              ↓
        /weather/:cityId
              ↓
       WeatherDetailView ─ weatherData에서 도시 조회
```

## 실행 방법

```bash
npm install
npm run dev
```

프로덕션 빌드는 다음 명령으로 검증합니다.

```bash
npm run build
npm run preview
```

## 확인 항목

1. `/`에서 검색, 통계, 카드 선택 기능이 동작하는지 확인합니다.
2. 검색 후 URL에 `q`가 반영되고 새로고침해도 검색 결과가 유지되는지 확인합니다.
3. 상세보기 버튼 클릭 시 `/weather/city_01` 형식으로 이동하는지 확인합니다.
4. 상세 페이지에서 도시별 관측 정보와 홈 복귀 링크가 표시되는지 확인합니다.
5. `/about`에서 소개 내용과 홈 복귀 링크가 표시되는지 확인합니다.
6. 존재하지 않는 경로에서 404 화면이 표시되는지 확인합니다.
7. `npm run build` 실행 시 각 페이지가 별도 청크로 생성되는지 확인합니다.
