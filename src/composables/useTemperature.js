import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/configStore'

/**
 * 섭씨 원본 데이터를 전역 단위 설정에 맞춰 표시하기 위한 Composable입니다.
 * 검색, 정렬, 상태 판정에는 원본 섭씨 값을 유지하고 화면 출력만 변환합니다.
 */
export function useTemperature() {
  const configStore = useConfigStore()
  const { unit, unitSymbol } = storeToRefs(configStore)

  const convertTemperature = (celsius) => {
    const numericTemperature = Number(celsius)

    if (!Number.isFinite(numericTemperature)) return '-'
    if (unit.value === 'fahrenheit') return Math.round((numericTemperature * 9) / 5 + 32)

    return numericTemperature
  }

  const formatTemperature = (celsius) => `${convertTemperature(celsius)}${unitSymbol.value}`

  return {
    unit,
    unitSymbol,
    convertTemperature,
    formatTemperature,
  }
}
