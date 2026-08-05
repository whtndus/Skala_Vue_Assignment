<script setup>
import { ref } from 'vue'

// 실시간 화면 출력을 위한 Vue 상태값 (수정 금지)
const result1 = ref('')
const result2 = ref('')
const result3 = ref('')

// =================================================================
// 📝 [과제 1] 회원 명단 가공 및 VIP 데이터 추출
// - includes, 중첩 객체 비구조화 할당, 템플릿 리터럴
// =================================================================
const runTask1 = () => {
  const members = ['김수원', '이서울', '박부산', '최대전']
  const rawData = { id: 101, grade: 'VIP', details: { score: 95 } }

  // 1. includes() 활용
  const memberContainsPark = members.includes('박부산')

  // 2. 객체 심층 비구조화 할당 (한 줄로 추출)
  const {
    grade,
    details: { score },
  } = rawData

  // 3. 템플릿 리터럴 바인딩
  result1.value = `부산 포함 여부: ${memberContainsPark} / 등급: ${grade} / 점수: ${score}점`
}

// =================================================================
// 📝 [과제 2] 장바구니 복사 및 안전한 기본값 처리
// - 스프레드 연산자, 옵셔널 체이닝, 널 병합 연산자
// =================================================================
const runTask2 = () => {
  const currentCart = ['Apple', 'Banana']
  const newProduct = { name: 'Orange', stock: 0, preview: null }

  // 1. 배열 스프레드 연산자 병합
  const updatedCart = [...currentCart, newProduct.name]

  // 2. 옵셔널 체이닝 및 Null 병합 연산자 콤보
  const imgStatus = newProduct?.preview ?? '이미지 준비중'

  // 3. 0값 안전 보존을 위한 ?? 연산자 검증 (|| 연산자를 쓰면 10이 되어 감점)
  const finalStock = newProduct.stock ?? 10

  // 4. 출력
  result2.value = `카트: ${updatedCart} / 이미지: ${imgStatus} / 수량: ${finalStock}개`
}

// =================================================================
// 📝 [과제 3] 서버 연쇄 데이터 요청 및 에러 통합 제어
// - Promise, async/await, 비구조화 할당, try-catch
// =================================================================
// 가상의 백엔드 API (수정 금지 - Promise 반환형 화살표 함수)
const fetchUserId = () => new Promise((res) => setTimeout(() => res({ uid: 777 }), 400))
const fetchUserProfile = (uid) => new Promise((res) => setTimeout(() => res({ uid, nick: 'Graves' }), 400))

const runTask3 = async () => {
  result3.value = '⏳ 데이터 동기화 중...'

  // 1. try-catch 예외 처리망 구축
  try {
    // 2. 1차 await 실행 및 비구조화 할당 추출
    const { uid } = await fetchUserId()

    // 3. 2차 연쇄 await 실행 및 데이터 주입
    const { nick } = await fetchUserProfile(uid)

    // 4. 결과 출력
    result3.value = `동기화 성공: ${nick}님 환영합니다.`
  } catch {
    result3.value = '통신 실패'
  }
}
</script>

<template>
  <div class="practice-section">
    <h2>🎯 Modern JavaScript (ES6+) 실무 검증 과제룸</h2>

    <!-- ==================== 과제 1 화면 ==================== -->
    <div class="card">
      <h3>과제 1. 데이터 추출 및 포맷팅</h3>
      <button type="button" @click="runTask1">과제 1 가동</button>
      <output class="console" aria-live="polite"><span>OUTPUT 01</span>{{ result1 || '실행 결과가 여기에 표시됩니다.' }}</output>
    </div>
    <!-- ===================== 과제 1 화면 ===================== -->

    <!-- ==================== 과제 2 화면 ==================== -->
    <div class="card">
      <h3>과제 2. 불변성 복사 및 데이터 방어</h3>
      <button type="button" @click="runTask2">과제 2 가동</button>
      <output class="console" aria-live="polite"><span>OUTPUT 02</span>{{ result2 || '실행 결과가 여기에 표시됩니다.' }}</output>
    </div>
    <!-- ===================== 과제 2 화면 ===================== -->

    <!-- ==================== 과제 3 화면 ==================== -->
    <div class="card">
      <h3>과제 3. 비동기 연쇄 파이프라인 (Async/Await)</h3>
      <button type="button" @click="runTask3">과제 3 가동</button>
      <output class="console" aria-live="polite"><span>OUTPUT 03</span>{{ result3 || '실행 결과가 여기에 표시됩니다.' }}</output>
    </div>
    <!-- ===================== 과제 3 화면 ===================== -->
  </div>
</template>

<style scoped>
.card {
  padding: 1.25rem 0;
  border-top: 1px solid var(--atlas-line);
}
button {
  padding: 0.55rem 0.85rem;
  border: 1px solid var(--atlas-ink);
  border-radius: 1px;
  color: var(--atlas-paper-soft);
  background: var(--atlas-ink);
  cursor: pointer;
  font-weight: 700;
}
button:hover {
  border-color: var(--atlas-accent);
  background: var(--atlas-accent);
}
.console {
  display: grid;
  gap: 0.35rem;
  margin-top: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: 1px;
  color: var(--atlas-paper-soft);
  background: #2d302e;
  font-family: var(--font-mono);
  font-size: 0.82rem;
}
.console span {
  color: #a9b9bd;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}
</style>
