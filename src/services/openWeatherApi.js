import axios from 'axios'

const OPEN_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const OPEN_WEATHER_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'
const OPEN_WEATHER_GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0/direct'

const statusMap = {
  Clear: '맑음',
  Clouds: '구름',
  Rain: '비',
  Drizzle: '비',
  Thunderstorm: '비',
  Snow: '눈',
  Mist: '구름',
  Smoke: '구름',
  Haze: '구름',
  Dust: '구름',
  Fog: '구름',
  Sand: '구름',
  Ash: '구름',
  Squall: '구름',
  Tornado: '구름',
}

const roundToOneDecimal = (value) => Math.round(Number(value) * 10) / 10

const formatObservedAt = (unixTime, timezoneOffset) => {
  const localTime = new Date((unixTime + timezoneOffset) * 1000)
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: '2-digit',
  }).format(localTime)
}

const formatForecastAt = (unixTime, timezoneOffset) => {
  const localTime = new Date((unixTime + timezoneOffset) * 1000)
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'UTC',
    weekday: 'short',
    hour: '2-digit',
    hour12: false,
  }).format(localTime)
}

export const getWeatherErrorMessage = (error) => {
  if (!axios.isAxiosError(error)) return error.message || '날씨 데이터를 가져오지 못했습니다.'
  if (!error.response) return '네트워크 연결을 확인한 뒤 다시 시도해 주세요.'
  if (error.response.status === 401) return 'OpenWeather API 키가 유효하지 않거나 아직 활성화되지 않았습니다.'
  if (error.response.status === 404) return '해당 도시를 찾을 수 없습니다. 도시 이름을 다시 확인해 주세요.'
  if (error.response.status === 429) return 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.'

  return error.response.data?.message || '날씨 데이터를 가져오지 못했습니다.'
}

export const fetchWeatherByCity = async (cityName) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY
  const normalizedCityName = cityName.trim()

  if (!normalizedCityName) throw new Error('검색할 도시 이름을 입력해 주세요.')
  if (!apiKey) throw new Error('VITE_WEATHER_API_KEY 환경변수를 확인해 주세요.')

  const geocodingResponse = await axios.get(OPEN_WEATHER_GEOCODING_URL, {
    params: {
      q: normalizedCityName,
      limit: 1,
      appid: apiKey,
    },
  })

  const location = geocodingResponse.data?.[0]

  if (!location) throw new Error('해당 도시를 찾을 수 없습니다. 도시 이름을 다시 확인해 주세요.')

  const response = await axios.get(OPEN_WEATHER_URL, {
    params: {
      lat: location.lat,
      lon: location.lon,
      appid: apiKey,
      units: 'metric',
      lang: 'kr',
    },
  })

  const data = response.data

  return {
    id: `owm_${data.id}`,
    openWeatherId: data.id,
    name: location.local_names?.ko || location.name || normalizedCityName,
    officialName: location.name || data.name,
    country: location.country || data.sys?.country || '',
    state: location.state || '',
    coordinates: {
      lat: location.lat,
      lon: location.lon,
    },
    temp: roundToOneDecimal(data.main.temp),
    status: statusMap[data.weather?.[0]?.main] || '구름',
    description: data.weather?.[0]?.description || '',
    feelsLike: roundToOneDecimal(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: roundToOneDecimal(data.wind?.speed || 0),
    precipitation: data.rain?.['1h'] ?? data.snow?.['1h'] ?? 0,
    precipitationType: 'rainfall',
    observedAt: formatObservedAt(data.dt, data.timezone),
    source: 'live',
  }
}

export const fetchForecastByCoordinates = async ({ lat, lon }) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY

  if (!apiKey) throw new Error('VITE_WEATHER_API_KEY 환경변수를 확인해 주세요.')
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lon))) throw new Error('예보를 조회할 도시 좌표가 없습니다.')

  const response = await axios.get(OPEN_WEATHER_FORECAST_URL, {
    params: {
      lat,
      lon,
      appid: apiKey,
      units: 'metric',
      lang: 'kr',
      cnt: 6,
    },
  })

  const timezoneOffset = response.data.city?.timezone || 0

  return (response.data.list || []).map((forecast) => ({
    timestamp: forecast.dt,
    label: formatForecastAt(forecast.dt, timezoneOffset),
    temperature: roundToOneDecimal(forecast.main?.temp),
    description: forecast.weather?.[0]?.description || '',
    precipitationProbability: Math.round(Number(forecast.pop || 0) * 100),
  }))
}
