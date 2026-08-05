export const isWeatherNumber = (value) => value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value))

const getBaseOutfit = (temperature) => {
  if (temperature >= 28)
    return { label: '가볍고 시원한 옷차림', top: '반팔 티셔츠 또는 민소매', outer: '아우터 없이 가볍게', bottom: '반바지 또는 얇은 린넨 팬츠', shoes: '통풍이 좋은 운동화 또는 샌들' }
  if (temperature >= 23) return { label: '얇은 여름 옷차림', top: '반팔 티셔츠 또는 얇은 셔츠', outer: '냉방 대비 얇은 셔츠', bottom: '면바지 또는 반바지', shoes: '가벼운 운동화' }
  if (temperature >= 20) return { label: '가벼운 긴팔 옷차림', top: '얇은 긴팔 티셔츠 또는 셔츠', outer: '가벼운 가디건', bottom: '면바지 또는 데님', shoes: '운동화 또는 로퍼' }
  if (temperature >= 17) return { label: '얇은 겉옷이 필요한 날', top: '맨투맨 또는 얇은 니트', outer: '얇은 재킷 또는 가디건', bottom: '긴 바지', shoes: '운동화 또는 로퍼' }
  if (temperature >= 12) return { label: '간절기 레이어드', top: '긴팔 이너와 니트', outer: '재킷 또는 트렌치코트', bottom: '도톰한 긴 바지', shoes: '운동화 또는 단화' }
  if (temperature >= 9) return { label: '따뜻한 겉옷 준비', top: '니트 또는 후디', outer: '도톰한 재킷', bottom: '긴 바지', shoes: '막힌 운동화 또는 부츠' }
  if (temperature >= 5) return { label: '초겨울 보온 옷차림', top: '기모 상의 또는 도톰한 니트', outer: '코트 또는 경량 패딩', bottom: '기모 바지 또는 두꺼운 데님', shoes: '보온성이 있는 신발' }
  return { label: '한겨울 보온 옷차림', top: '내복과 기모 상의', outer: '두꺼운 패딩 또는 겨울 코트', bottom: '기모 바지', shoes: '방한 부츠 또는 두꺼운 양말' }
}

export const getOutfitRecommendation = ({ temperature, feelsLike, status, windSpeed, humidity, precipitation, precipitationType } = {}) => {
  const referenceTemperature = isWeatherNumber(feelsLike) ? Number(feelsLike) : isWeatherNumber(temperature) ? Number(temperature) : null
  if (referenceTemperature === null) return null

  const recommendation = getBaseOutfit(referenceTemperature)
  const notes = []
  const hasPrecipitation = isWeatherNumber(precipitation) && Number(precipitation) > 0

  if (precipitationType === 'snow' || status === '눈') notes.push('미끄럼에 강한 방수 신발과 장갑을 준비하세요.')
  else if (precipitationType === 'rain' || status === '비' || hasPrecipitation) notes.push('우산과 생활 방수 신발을 준비하세요.')
  if (isWeatherNumber(windSpeed) && Number(windSpeed) >= 7) notes.push('바람을 막아주는 아우터가 유용합니다.')
  if (isWeatherNumber(humidity) && Number(humidity) >= 80 && referenceTemperature >= 22) notes.push('습도가 높아 통기성이 좋은 소재가 편안합니다.')
  if (status === '맑음' && referenceTemperature >= 20) notes.push('야외 활동에는 모자나 선글라스를 챙겨보세요.')

  return { ...recommendation, referenceTemperature, notes }
}
