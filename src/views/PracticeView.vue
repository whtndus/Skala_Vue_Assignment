<script setup>
import { computed, ref } from 'vue'
import SampleOne from '@/components/practices/basic/SampleOne.vue'
import SampleTwo from '@/components/practices/basic/SampleTwo.vue'
import VueText from '@/components/practices/basic/VueText.vue'
import VueHTML from '@/components/practices/basic/VueHTML.vue'
import VueHTMLXSS from '@/components/practices/basic/VueHTMLXSS.vue'
import VueBind from '@/components/practices/basic/VueBind.vue'
import VueBindClass from '@/components/practices/basic/VueBindClass.vue'
import VueBindStyle from '@/components/practices/basic/VueBindStyle.vue'
import VueBindShorthand from '@/components/practices/basic/VueBindShorthand.vue'
import VueIf from '@/components/practices/basic/VueIf.vue'
import VueShow from '@/components/practices/basic/VueShow.vue'
import VueFor from '@/components/practices/basic/VueFor.vue'
import VuePre from '@/components/practices/basic/VuePre.vue'
import VueCloak from '@/components/practices/basic/VueCloak.vue'
import VueVonce from '@/components/practices/basic/VueVonce.vue'
import VueVmemo from '@/components/practices/basic/VueVmemo.vue'
import EventBasic from '@/components/practices/basic/EventBasic.vue'
import EventObject from '@/components/practices/basic/EventObject.vue'
import EventModifier from '@/components/practices/basic/EventModifier.vue'
import ModelBasic from '@/components/practices/basic/ModelBasic.vue'
import ModelForm from '@/components/practices/basic/ModelForm.vue'
import ModelModifier from '@/components/practices/basic/ModelModifier.vue'
import SearchBindingPractice from '@/components/practices/basic/SearchBindingPractice.vue'
import StyleScoped from '@/components/practices/basic/StyleScoped.vue'
import ReactiveRef from '@/components/practices/composition/ReactiveRef.vue'
import ReactiveReactive from '@/components/practices/composition/ReactiveReactive.vue'
import ComputedBasic from '@/components/practices/composition/ComputedBasic.vue'
import WatchersBasic from '@/components/practices/composition/WatchersBasic.vue'
import WatchersMulti from '@/components/practices/composition/WatchersMulti.vue'
import WatchersDeep from '@/components/practices/composition/WatchersDeep.vue'
import WatchersReactive from '@/components/practices/composition/WatchersReactive.vue'
import WatchersWatchEffect from '@/components/practices/composition/WatchersWatchEffect.vue'
import LifecycleParent from '@/components/practices/component/LifecycleParent.vue'
import PropsEmitsParent from '@/components/practices/component/PropsEmitsParent.vue'
import SlotDefaultParent from '@/components/practices/component/SlotDefaultParent.vue'
import SlotNamedParent from '@/components/practices/component/SlotNamedParent.vue'
import SlotScopedParent from '@/components/practices/component/SlotScopedParent.vue'
import EcmaScript from '@/components/practices/library/EcmaScript.vue'
import ToolingMission from '@/components/practices/library/ToolingMission.vue'
import StoreCounter from '@/components/practices/library/StoreCounter.vue'
import AxiosWeather from '@/components/practices/library/AxiosWeather.vue'
import AxiosJson from '@/components/practices/library/AxiosJson.vue'
import ElementPlusPractice from '@/components/practices/library/ElementPlus.vue'
import DirectiveWeatherMission from '@/components/practices/missions/DirectiveWeatherMission.vue'
import EventQueueMission from '@/components/practices/missions/EventQueueMission.vue'
import WeatherAlertMission from '@/components/practices/missions/WeatherAlertMission.vue'
import ForecastAnalysisMission from '@/components/practices/missions/ForecastAnalysisMission.vue'
import AutoObservationMission from '@/components/practices/missions/AutoObservationMission.vue'
import WeatherCardMission from '@/components/practices/missions/WeatherCardMission.vue'
import ObservationSlotMission from '@/components/practices/missions/ObservationSlotMission.vue'
import RecentCitiesMission from '@/components/practices/missions/RecentCitiesMission.vue'
import ApiSearchMission from '@/components/practices/missions/ApiSearchMission.vue'

const practiceSections = [
  {
    id: 'learning-environment',
    kicker: 'SETUP / REACTIVITY',
    title: '학습환경 구성',
    description: '일반 JavaScript 값과 Vue 반응성 데이터, 텍스트 보간법의 차이를 확인합니다.',
    lessons: [
      { label: '반응성 데이터 (Reactivity)', component: SampleOne },
      { label: 'JavaScript in Text Interpolation', component: SampleTwo },
    ],
  },
  {
    id: 'vue-directive',
    kicker: 'DIRECTIVES',
    title: 'Vue 디렉티브',
    description: 'Vue 템플릿에서 DOM 출력과 속성, 조건, 반복 렌더링을 제어합니다.',
    lessons: [
      { label: 'v-text', component: VueText },
      { label: 'v-html', component: VueHTML },
      { label: 'v-html XSS', component: VueHTMLXSS },
      { label: 'v-bind Basic', component: VueBind },
      { label: 'v-bind Class Binding', component: VueBindClass },
      { label: 'v-bind Style Binding', component: VueBindStyle },
      { label: 'v-bind Shorthand', component: VueBindShorthand },
      { label: 'v-if / v-else-if / v-else', component: VueIf },
      { label: 'v-show', component: VueShow },
      { label: 'v-for', component: VueFor },
      { label: 'v-pre', component: VuePre },
      { label: 'v-cloak', component: VueCloak },
      { label: 'v-once', component: VueVonce },
      { label: 'v-memo', component: VueVmemo },
    ],
    mission: { label: '미니 날씨 현황판', component: DirectiveWeatherMission },
  },
  {
    id: 'event-handling',
    kicker: 'EVENTS',
    title: 'Vue 이벤트 처리',
    description: 'v-on을 이용한 이벤트 처리와 이벤트 객체, 수식어 사용법을 실습합니다.',
    lessons: [
      { label: 'v-on Event Handler', component: EventBasic },
      { label: 'Event Object', component: EventObject },
      { label: 'Event Modifier', component: EventModifier },
    ],
    mission: { label: '관측 도시 대기열', component: EventQueueMission },
  },
  {
    id: 'form-handling',
    kicker: 'FORM BINDING',
    title: 'Vue 폼 처리',
    description: 'v-model 양방향 바인딩과 HTML 폼 요소별 데이터 연결 방식을 확인합니다.',
    lessons: [
      { label: 'v-model 양방향 데이터 바인딩', component: ModelBasic },
      { label: 'HTML Form 요소와 v-model', component: ModelForm },
      { label: 'v-model Modifiers', component: ModelModifier },
      { label: '검색어 입력과 부모·자식 동기화', component: SearchBindingPractice },
    ],
    mission: { label: '날씨 알림 설정', component: WeatherAlertMission },
  },
  {
    id: 'vue-style',
    kicker: 'SCOPED STYLING',
    title: 'Vue 스타일',
    description: 'Scoped CSS와 외부 스타일을 활용해 컴포넌트 스타일의 적용 범위를 확인합니다.',
    lessons: [{ label: 'Vue Style Example', component: StyleScoped }],
  },
  {
    id: 'reactive-state',
    kicker: 'REACTIVITY',
    title: '반응형 상태',
    description: 'ref와 reactive로 선언한 상태가 화면과 어떻게 연결되는지 확인합니다.',
    lessons: [
      { label: 'ref() Example', component: ReactiveRef },
      { label: 'reactive() Example', component: ReactiveReactive },
    ],
  },
  {
    id: 'computed-watchers',
    kicker: 'COMPUTED / WATCH',
    title: 'Computed와 Watchers',
    description: '파생 상태를 캐싱하고 반응형 데이터의 변화를 다양한 방식으로 감시합니다.',
    lessons: [
      { label: 'computed() Example', component: ComputedBasic },
      { label: 'watch() Example', component: WatchersBasic },
      { label: 'watch() Multi-Source', component: WatchersMulti },
      { label: 'watch() Deep Watch', component: WatchersDeep },
      { label: 'watch() reactive 데이터', component: WatchersReactive },
      { label: 'watchEffect() Example', component: WatchersWatchEffect },
    ],
    mission: { label: '예보 분석 패널', component: ForecastAnalysisMission },
  },
  {
    id: 'component-lifecycle',
    kicker: 'LIFECYCLE',
    title: '컴포넌트 생명주기',
    description: '컴포넌트가 생성되고 갱신되며 사라지는 생명주기를 관찰합니다.',
    lessons: [{ label: 'Lifecycle Hook Example', component: LifecycleParent }],
    mission: { label: '자동 관측 시뮬레이터', component: AutoObservationMission },
  },
  {
    id: 'props-emits',
    kicker: 'PROPS / EMITS',
    title: 'Props와 Emits',
    description: '부모와 자식 컴포넌트가 데이터와 이벤트를 주고받는 흐름을 실습합니다.',
    lessons: [{ label: 'Props & Emits Example', component: PropsEmitsParent }],
    mission: { label: '부모가 관리하는 날씨 카드', component: WeatherCardMission },
  },
  {
    id: 'component-slot',
    kicker: 'SLOTS',
    title: '컴포넌트 슬롯',
    description: '기본·이름·범위 슬롯을 사용해 재사용 가능한 UI를 구성합니다.',
    lessons: [
      { label: 'Default Slot Example', component: SlotDefaultParent },
      { label: 'Named Slot Example', component: SlotNamedParent },
      { label: 'Scoped Slot Example', component: SlotScopedParent },
    ],
    mission: { label: '재사용 가능한 관측 패널', component: ObservationSlotMission },
  },
  {
    id: 'pinia-store',
    kicker: 'PINIA',
    title: 'Pinia 스토어',
    description: '컴포넌트 밖의 전역 상태를 만들고 여러 화면에서 공유합니다.',
    lessons: [{ label: 'Pinia Counter Store', component: StoreCounter }],
    mission: { label: '최근 조회 도시 스토어', component: RecentCitiesMission },
  },
  {
    id: 'axios',
    kicker: 'AXIOS',
    title: 'Axios 데이터 연동',
    description: '외부 API와 JSON 데이터를 비동기로 요청하고 화면 상태에 반영합니다.',
    lessons: [
      { label: '날씨 API 요청', component: AxiosWeather },
      { label: 'JSON 데이터 요청', component: AxiosJson },
    ],
    mission: { label: '도시 날씨 요청 상태 머신', component: ApiSearchMission },
  },
  {
    id: 'element-plus',
    kicker: 'ELEMENT PLUS',
    title: 'Element Plus 실습',
    description: 'Element Plus의 폼, 데이터 입력, 피드백 컴포넌트를 반응형 상태와 연결해 실습합니다.',
    lessons: [{ label: 'Element Plus UI Components', component: ElementPlusPractice }],
  },
  {
    id: 'ecmascript',
    kicker: 'ECMASCRIPT / ES6+',
    title: 'Modern JavaScript',
    description: '배열·객체 가공, 안전한 기본값 처리, async/await 연쇄 호출을 세 가지 과제로 검증합니다.',
    lessons: [{ label: 'ES6+ 실무 검증 과제 1·2·3', component: EcmaScript }],
  },
  {
    id: 'tooling-build',
    kicker: 'TOOLING / BUILD',
    title: '코드 품질과 배포 환경',
    description: 'ESLint, Prettier, Vite mode와 환경별 빌드 과정을 예제 코드와 실제 설정으로 확인합니다.',
    lessons: [{ label: 'ESLint · Prettier · Env · Vite 빌드 미션', component: ToolingMission }],
  },
]

const selectedSectionId = ref(practiceSections[0].id)
const selectedSectionIndex = computed(() => practiceSections.findIndex((section) => section.id === selectedSectionId.value))
const selectedSection = computed(() => practiceSections[selectedSectionIndex.value])

const selectSection = (sectionId) => {
  selectedSectionId.value = sectionId
}

const moveSection = (direction) => {
  const nextIndex = selectedSectionIndex.value + direction
  if (nextIndex < 0 || nextIndex >= practiceSections.length) return
  selectSection(practiceSections[nextIndex].id)
}
</script>

<template>
  <div class="practice-container">
    <header class="practice-heading">
      <div>
        <p>VUE / FIELD NOTES</p>
        <h1>Vue 핵심 개념 실습</h1>
        <span>반응형 상태부터 API 연동까지 기록한 개발 실험 노트입니다.</span>
      </div>
      <div class="heading-progress" aria-label="전체 실습 수">
        <strong>02</strong>
        <span>VOL.</span>
      </div>
    </header>

    <div class="practice-layout">
      <div class="practice-aside">
        <aside class="practice-sidebar">
          <div class="sidebar-heading">
            <span>CURRICULUM</span>
            <strong>실습 순서</strong>
          </div>

          <nav class="practice-navigation" aria-label="Vue 실습 순서">
            <button
              v-for="(section, index) in practiceSections"
              :key="section.id"
              type="button"
              class="practice-navigation-item"
              :class="{ active: selectedSectionId === section.id }"
              :aria-current="selectedSectionId === section.id ? 'step' : undefined"
              @click="selectSection(section.id)"
            >
              <span class="navigation-number">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="navigation-copy">
                <strong>{{ section.title }}</strong>
                <small>{{ section.lessons.length }}개 실습{{ section.mission ? ' + 미션' : '' }}</small>
              </span>
            </button>
          </nav>
        </aside>

        <aside class="practice-context" aria-label="현재 실습 정보">
          <div class="context-card lesson-list">
            <span class="context-eyebrow">IN THIS STEP</span>
            <h3>{{ selectedSection.title }}</h3>
            <ul>
              <li v-for="lesson in selectedSection.lessons" :key="lesson.label">
                {{ lesson.label }}
              </li>
              <li v-if="selectedSection.mission" class="mission-list-item">MISSION · {{ selectedSection.mission.label }}</li>
            </ul>
          </div>
        </aside>
      </div>

      <main class="practice-content">
        <template v-for="(section, index) in practiceSections" :key="section.id">
          <section v-if="selectedSectionId === section.id" class="practice-chapter" :aria-labelledby="`${section.id}-title`">
            <header class="chapter-heading">
              <p>{{ String(index + 1).padStart(2, '0') }} / {{ section.kicker }}</p>
              <h2 :id="`${section.id}-title`">{{ section.title }}</h2>
              <span>{{ section.description }}</span>
            </header>

            <div v-for="lesson in section.lessons" :key="lesson.label" class="lesson-block">
              <div class="lesson-label">{{ lesson.label }}</div>
              <div class="specimen-label">LIVE SPECIMEN</div>
              <div class="specimen-surface"><component :is="lesson.component" /></div>
            </div>

            <div v-if="section.mission" class="chapter-mission">
              <div class="mission-heading">
                <span>CHAPTER MISSION</span>
                <strong>{{ section.mission.label }}</strong>
              </div>
              <div class="mission-surface"><component :is="section.mission.component" /></div>
            </div>
          </section>
        </template>

        <footer class="chapter-controls" aria-label="실습 단계 이동">
          <button type="button" class="chapter-button secondary" :disabled="selectedSectionIndex === 0" @click="moveSection(-1)">← 이전 실습</button>
          <span>{{ selectedSectionIndex + 1 }} / {{ practiceSections.length }}</span>
          <button type="button" class="chapter-button primary" :disabled="selectedSectionIndex === practiceSections.length - 1" @click="moveSection(1)">다음 실습 →</button>
        </footer>
      </main>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/practice.css';

.practice-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding: 2rem 2.25rem;
  border-radius: 20px;
  color: #fff;
  background: radial-gradient(circle at 88% 16%, rgba(255, 255, 255, 0.2), transparent 24%), linear-gradient(135deg, #238765, #35495e);
  box-shadow: 0 18px 45px rgba(28, 68, 58, 0.15);
}

.practice-heading p,
.chapter-heading p {
  margin: 0 0 0.35rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.practice-heading h1 {
  margin: 0 0 0.45rem;
  color: #fff;
  font-size: clamp(1.75rem, 3vw, 2.35rem);
}

.practice-heading span {
  font-size: 0.92rem;
  opacity: 0.9;
}

.heading-progress {
  display: grid;
  flex: 0 0 auto;
  min-width: 86px;
  padding-left: 1.5rem;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  text-align: center;
}

.heading-progress strong {
  color: #fff;
  font-size: 2.2rem;
  line-height: 1;
}

.heading-progress span {
  margin-top: 0.35rem;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.practice-layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr) 200px;
  align-items: start;
  gap: 1.25rem;
}

.practice-sidebar,
.practice-context {
  position: sticky;
  top: 1rem;
}

.practice-sidebar,
.context-card {
  border: 1px solid #e2e9e6;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(39, 68, 60, 0.07);
}

.practice-sidebar {
  overflow: hidden;
}

.sidebar-heading {
  display: grid;
  gap: 0.15rem;
  padding: 1.15rem 1.2rem;
  border-bottom: 1px solid #edf1ef;
}

.sidebar-heading span,
.context-eyebrow {
  color: #238765;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.sidebar-heading strong {
  color: #263b35;
  font-size: 1rem;
}

.practice-navigation {
  display: grid;
  padding: 0.55rem;
}

.practice-navigation-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.8rem 0.7rem;
  border: 0;
  border-radius: 10px;
  color: #52625d;
  background: transparent;
  text-align: left;
}

.practice-navigation-item:hover:not(:disabled) {
  color: #185e49;
  background: #f0f8f5;
}

.practice-navigation-item.active {
  color: #fff;
  background: #238765;
  box-shadow: 0 8px 18px rgba(35, 135, 101, 0.22);
}

.navigation-number {
  display: grid;
  flex: 0 0 32px;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  color: #238765;
  background: #e5f4ee;
  font-size: 0.72rem;
  font-weight: 800;
}

.active .navigation-number {
  color: #fff;
  background: rgba(255, 255, 255, 0.18);
}

.navigation-copy {
  display: grid;
  min-width: 0;
}

.navigation-copy strong {
  overflow: hidden;
  font-size: 0.84rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.navigation-copy small {
  margin-top: 0.1rem;
  font-size: 0.68rem;
  opacity: 0.7;
}

.practice-content {
  min-width: 0;
}

.practice-chapter {
  padding: 1.5rem;
  border: 1px solid #e2e9e6;
  border-radius: 16px;
  background: #f8fbfa;
}

.chapter-heading {
  margin-bottom: 1.25rem;
  padding-bottom: 1.15rem;
  border-bottom: 1px solid #dce7e3;
}

.chapter-heading p {
  color: #238765;
}

.chapter-heading h2 {
  margin: 0 0 0.35rem;
  padding: 0;
  border: 0;
  color: #1f332d;
  font-size: 1.55rem;
}

.chapter-heading span {
  color: #65746f;
  font-size: 0.88rem;
}

.lesson-block + .lesson-block {
  margin-top: 1.25rem;
}

.lesson-label {
  display: inline-flex;
  margin: 0 0 0.5rem 0.45rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  color: #17694f;
  background: #e0f2eb;
  font-size: 0.7rem;
  font-weight: 750;
}

.chapter-controls {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.chapter-controls > span {
  color: #77847f;
  font-size: 0.78rem;
  font-weight: 700;
}

.chapter-button {
  min-height: 42px;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  font-weight: 700;
}

.chapter-button:first-child {
  justify-self: start;
}

.chapter-button:last-child {
  justify-self: end;
}

.chapter-button.primary {
  color: #fff;
  background: #238765;
  border-color: #238765;
}

.chapter-button.primary:hover:not(:disabled) {
  color: #fff;
  background: #1b7255;
  border-color: #1b7255;
}

.practice-context {
  display: grid;
  gap: 1rem;
}

.context-card {
  padding: 1.1rem;
}

.context-card > strong {
  display: block;
  margin: 0.35rem 0 0.65rem;
  color: #20372f;
  font-size: 1.7rem;
}

.progress-track {
  overflow: hidden;
  height: 7px;
  border-radius: 999px;
  background: #e6eeeb;
}

.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #42b883, #238765);
  transition: width 0.25s ease;
}

.context-card p {
  margin: 0.65rem 0 0;
  color: #77847f;
  font-size: 0.75rem;
}

.lesson-list h3 {
  margin: 0.45rem 0 0.65rem;
  color: #263b35;
  font-size: 0.95rem;
}

.lesson-list ul {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lesson-list li {
  position: relative;
  padding-left: 0.9rem;
  color: #66756f;
  font-size: 0.76rem;
}

.lesson-list li::before {
  position: absolute;
  top: 0.57em;
  left: 0;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #42b883;
  content: '';
}

@media (max-width: 1080px) {
  .practice-layout {
    grid-template-columns: 210px minmax(0, 1fr);
  }

  .practice-context {
    display: none;
  }
}

@media (max-width: 760px) {
  .practice-heading {
    align-items: flex-start;
    padding: 1.5rem;
  }

  .heading-progress {
    display: none;
  }

  .practice-layout {
    display: block;
  }

  .practice-sidebar {
    position: static;
    margin-bottom: 1rem;
    border-radius: 14px;
  }

  .sidebar-heading {
    display: none;
  }

  .practice-navigation {
    display: flex;
    overflow-x: auto;
    gap: 0.35rem;
    padding: 0.55rem;
    scrollbar-width: thin;
  }

  .practice-navigation-item {
    flex: 0 0 auto;
    width: auto;
  }

  .navigation-copy small {
    display: none;
  }

  .practice-chapter {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .practice-heading span {
    display: none;
  }

  .chapter-controls {
    grid-template-columns: 1fr 1fr;
  }

  .chapter-controls > span {
    display: none;
  }

  .chapter-button {
    width: 100%;
  }
}

/* WEATHER / ATLAS editorial system */
.practice-container {
  --el-color-primary: var(--atlas-accent);
  --el-color-success: var(--atlas-accent);
  --el-color-danger: #79584f;
  --el-border-radius-base: 1px;
  --el-border-radius-small: 1px;
  --el-box-shadow-light: none;
  padding: clamp(3rem, 6vw, 6rem) 0 7rem;
}

.practice-heading {
  align-items: flex-end;
  margin-bottom: clamp(2.5rem, 5vw, 5rem);
  padding: clamp(1.5rem, 3vw, 2.5rem) 0;
  border-top: 1px solid var(--atlas-line-strong);
  border-bottom: 1px solid var(--atlas-line);
  border-radius: 0;
  color: var(--atlas-ink);
  background: transparent;
  box-shadow: none;
}

.practice-heading p,
.chapter-heading p {
  color: var(--atlas-accent);
  font-size: 0.75rem;
  letter-spacing: 0.16em;
}

.practice-heading h1 {
  margin: 0.45rem 0 0.75rem;
  color: var(--atlas-ink);
  font-size: clamp(2rem, 4vw, 4rem);
  font-weight: 560;
  letter-spacing: -0.065em;
  line-height: 0.95;
}

.practice-heading > div:first-child > span {
  color: var(--atlas-muted);
  font-size: clamp(0.88rem, 1.2vw, 1rem);
  opacity: 1;
}

.heading-progress {
  min-width: 110px;
  padding-left: 2rem;
  border-left-color: var(--atlas-line);
}

.heading-progress strong {
  color: var(--atlas-ink);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 350;
}

.heading-progress span {
  color: var(--atlas-muted);
  font-size: 0.75rem;
}

.practice-layout {
  grid-template-columns: 310px minmax(0, 1fr);
  gap: clamp(1.5rem, 3vw, 3rem);
}

.practice-aside {
  position: sticky;
  top: 6.25rem;
  display: grid;
  grid-template-rows: minmax(0, 1fr) 13rem;
  align-self: start;
  gap: 1.5rem;
  min-width: 0;
  max-height: calc(100svh - 7.25rem);
  overflow: hidden;
  overscroll-behavior: contain;
}

.practice-content {
  grid-column: 2;
}

.practice-context {
  position: static;
  min-height: 0;
  overflow: hidden;
}

.practice-sidebar,
.practice-context {
  top: 6.25rem;
}

.practice-sidebar,
.context-card,
.practice-chapter {
  border: 0;
  border-top: 1px solid var(--atlas-line-strong);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.practice-sidebar {
  position: static;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: 0;
  overflow: hidden;
}

.sidebar-heading {
  padding: 1.25rem 0;
  border-bottom-color: var(--atlas-line);
}

.sidebar-heading span,
.context-eyebrow {
  color: var(--atlas-accent);
  font-size: 0.8rem;
}

.sidebar-heading strong {
  color: var(--atlas-ink);
  font-size: 1.1rem;
}

.practice-navigation {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0;
  scrollbar-width: thin;
}

.practice-navigation-item {
  gap: 1rem;
  min-height: 64px;
  padding: 0.8rem 0;
  border: 0;
  border-bottom: 1px solid var(--atlas-line);
  border-radius: 0;
  color: var(--atlas-muted);
}

.practice-navigation-item:hover:not(:disabled) {
  color: var(--atlas-ink);
  background: var(--atlas-paper-soft);
}

.practice-navigation-item.active {
  color: var(--atlas-paper-soft);
  background: var(--atlas-ink);
  box-shadow: none;
}

.navigation-number {
  flex-basis: 44px;
  width: 44px;
  height: 38px;
  border-right: 1px solid var(--atlas-line);
  border-radius: 0;
  color: var(--atlas-accent);
  background: transparent;
  font-size: 0.75rem;
}

.active .navigation-number {
  color: #c4d1d4;
  background: transparent;
}

.navigation-copy strong {
  font-size: 0.94rem;
}

.navigation-copy small {
  color: inherit;
  font-size: 0.75rem;
}

.practice-chapter {
  padding: 1.25rem 0 0;
}

.chapter-heading {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom-color: var(--atlas-line);
}

.chapter-heading h2 {
  margin: 0.35rem 0 0.65rem;
  color: var(--atlas-ink);
  font-size: clamp(2rem, 4vw, 3.6rem);
  font-weight: 520;
  letter-spacing: -0.05em;
  line-height: 1;
}

.chapter-heading span {
  color: var(--atlas-muted);
  font-size: 0.9rem;
}

.lesson-block + .lesson-block {
  margin-top: 2.5rem;
}

.lesson-label {
  display: block;
  margin: 0 0 1rem;
  padding: 0.45rem 0;
  border-top: 1px solid var(--atlas-line);
  border-bottom: 1px solid #d0cec8;
  border-radius: 0;
  color: var(--atlas-ink);
  background: transparent;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.specimen-label {
  padding: 0.45rem 0.7rem;
  color: var(--atlas-paper-soft);
  background: var(--atlas-ink);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.specimen-surface {
  min-width: 0;
  padding: clamp(1rem, 2.5vw, 2rem);
  border-right: 1px solid var(--atlas-line);
  border-bottom: 1px solid var(--atlas-line);
  border-left: 1px solid var(--atlas-line);
  background: var(--atlas-paper-soft);
  overflow-wrap: anywhere;
}

.specimen-surface :deep(code),
.specimen-surface :deep(pre),
.specimen-surface :deep(output) {
  font-family: var(--font-mono);
}

.lesson-block :deep(.el-card) {
  border-color: var(--atlas-line);
  border-radius: 1px;
  background: transparent;
  box-shadow: none;
}

.lesson-block :deep(.el-card__header) {
  border-bottom-color: var(--atlas-line);
}

.lesson-block :deep(.el-input__wrapper),
.lesson-block :deep(.el-input-number),
.lesson-block :deep(.el-button),
.lesson-block :deep(.el-progress-bar__outer) {
  border-radius: 1px;
  box-shadow: none;
}

.lesson-block :deep(.input-group),
.lesson-block :deep(.btn-zone) {
  flex-wrap: wrap;
}

.lesson-block :deep(.el-input) {
  max-width: 100%;
}

.chapter-controls {
  margin-top: 2.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--atlas-line-strong);
}

.chapter-controls > span {
  color: var(--atlas-muted);
}

.chapter-button {
  border-radius: 1px;
}

.chapter-button.primary {
  border-color: var(--atlas-ink);
  color: var(--atlas-paper-soft);
  background: var(--atlas-ink);
}

.chapter-button.primary:hover:not(:disabled) {
  border-color: var(--atlas-accent);
  color: #fff;
  background: var(--atlas-accent);
}

.lesson-list .mission-list-item {
  color: var(--atlas-ink);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
}

.lesson-list .mission-list-item::before {
  height: 6px;
  background: var(--atlas-ink);
}

.chapter-mission {
  margin-top: clamp(3.5rem, 7vw, 6rem);
  border-top: 1px solid var(--atlas-ink);
}

.mission-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0.9rem;
  color: var(--atlas-paper-soft);
  background: var(--atlas-ink);
}

.mission-heading span {
  color: #b8c9cc;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.mission-heading strong {
  font-size: 0.82rem;
  font-weight: 600;
}

.mission-surface {
  padding: clamp(1.1rem, 3vw, 2.25rem);
  border-right: 1px solid var(--atlas-line);
  border-bottom: 1px solid var(--atlas-line);
  border-left: 1px solid var(--atlas-line);
  background: var(--atlas-paper-soft);
}

.practice-context {
  gap: 2rem;
}

.context-card {
  padding: 1rem 0;
}

.context-card.lesson-list {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.context-card.lesson-list ul {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 0.5rem;
  scrollbar-width: thin;
}

.context-card > strong {
  color: var(--atlas-ink);
  font-size: 2.3rem;
  font-weight: 400;
}

.progress-track {
  height: 2px;
  border-radius: 0;
  background: #cbc9c3;
}

.progress-track span {
  border-radius: 0;
  background: var(--atlas-accent);
  transition: width 250ms ease;
}

.context-card p,
.lesson-list li {
  color: var(--atlas-muted);
  font-size: 0.78rem;
}

.lesson-list h3 {
  color: var(--atlas-ink);
}

.lesson-list li::before {
  width: 6px;
  height: 1px;
  border-radius: 0;
  background: var(--atlas-accent);
}

.practice-navigation-item:focus-visible,
.chapter-button:focus-visible {
  outline: 2px solid var(--atlas-accent);
  outline-offset: 3px;
}

@media (max-width: 1080px) {
  .practice-aside {
    grid-template-rows: minmax(0, 1fr);
  }

  .practice-layout {
    grid-template-columns: 260px minmax(0, 1fr);
  }

  .practice-content {
    grid-column: 2;
  }

  .practice-context {
    display: none;
  }
}

@media (max-width: 760px) {
  .practice-container {
    padding: 2.5rem 0 5rem;
  }

  .practice-aside {
    position: static;
    display: block;
    max-height: none;
    overflow: visible;
  }

  .practice-heading {
    padding: 1.5rem 0;
  }

  .practice-heading h1 {
    font-size: clamp(2rem, 9vw, 3rem);
  }

  .practice-sidebar {
    display: block;
    margin-bottom: 2rem;
    border-radius: 0;
    overflow: visible;
  }

  .practice-content {
    grid-column: auto;
    grid-row: auto;
  }

  .practice-navigation {
    min-height: auto;
    overflow-y: hidden;
    gap: 0;
    padding: 0;
    border-bottom: 1px solid var(--atlas-line-strong);
  }

  .practice-navigation-item {
    padding: 0.65rem 0.8rem;
    border-right: 1px solid var(--atlas-line);
    border-bottom: 0;
  }

  .navigation-number {
    flex-basis: auto;
    width: auto;
    height: auto;
    border-right: 0;
  }

  .practice-chapter {
    padding: 1rem 0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .progress-track span {
    transition: none;
  }
}
</style>
