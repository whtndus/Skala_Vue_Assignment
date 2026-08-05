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

const toNullableNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

const roundToOneDecimal = (value) => {
  const number = toNullableNumber(value)
  return number === null ? null : Math.round(number * 10) / 10
}

const roundCoordinate = (value) => {
  const number = toNullableNumber(value)
  return number === null ? null : Math.round(number * 10000) / 10000
}

export const isWeatherApiConfigured = () => Boolean(import.meta.env.VITE_WEATHER_API_KEY)

export const formatCityTime = (unixTime, timezoneOffset = 0, options = {}) => {
  const timestamp = toNullableNumber(unixTime)
  const offset = toNullableNumber(timezoneOffset)
  if (timestamp === null || offset === null) return null

  const localTime = new Date((timestamp + offset) * 1000)
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }).format(localTime)
}

const getCityLocalDate = (unixTime, timezoneOffset = 0) => {
  const timestamp = toNullableNumber(unixTime)
  const offset = toNullableNumber(timezoneOffset)
  if (timestamp === null || offset === null) return null
  return new Date((timestamp + offset) * 1000)
}

export const formatCityDate = (unixTime, timezoneOffset = 0, options = {}) => {
  const localDate = getCityLocalDate(unixTime, timezoneOffset)
  if (!localDate) return null
  return new Intl.DateTimeFormat('ko-KR', { timeZone: 'UTC', ...options }).format(localDate)
}

const getCityDateKey = (unixTime, timezoneOffset = 0) => {
  const localDate = getCityLocalDate(unixTime, timezoneOffset)
  if (!localDate) return ''
  return `${localDate.getUTCFullYear()}-${String(localDate.getUTCMonth() + 1).padStart(2, '0')}-${String(localDate.getUTCDate()).padStart(2, '0')}`
}

export const getWindDirectionLabel = (degrees) => {
  const normalizedDegrees = toNullableNumber(degrees)
  if (normalizedDegrees === null) return null

  const directions = ['북', '북동', '동', '남동', '남', '남서', '서', '북서']
  return directions[Math.round((((normalizedDegrees % 360) + 360) % 360) / 45) % directions.length]
}

export const getWeatherErrorMessage = (error) => {
  if (!axios.isAxiosError(error)) return error.message || '날씨 데이터를 가져오지 못했습니다.'
  if (!error.response) return '네트워크 연결을 확인한 뒤 다시 시도해 주세요.'
  if (error.response.status === 401) return 'OpenWeather API 키가 유효하지 않거나 아직 활성화되지 않았습니다. VITE_WEATHER_API_KEY 환경변수를 확인해 주세요.'
  if (error.response.status === 404) return '해당 도시를 찾을 수 없습니다. 도시 이름을 다시 확인해 주세요.'
  if (error.response.status === 429) return 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.'

  return error.response.data?.message || '날씨 데이터를 가져오지 못했습니다.'
}

export const fetchWeatherByCity = async (cityName) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY
  const normalizedCityName = cityName.trim()

  if (!normalizedCityName) throw new Error('검색할 도시 이름을 입력해 주세요.')
  if (!apiKey) throw new Error('OpenWeather API 키가 없습니다. .env 파일의 VITE_WEATHER_API_KEY 환경변수를 확인해 주세요.')

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
  const timezoneOffset = toNullableNumber(data.timezone)
  const rainVolume = roundToOneDecimal(data.rain?.['1h'])
  const snowVolume = roundToOneDecimal(data.snow?.['1h'])
  const windDegrees = roundToOneDecimal(data.wind?.deg)

  return {
    id: `owm_${data.id}`,
    openWeatherId: data.id,
    name: location.local_names?.ko || location.name || data.name || normalizedCityName,
    officialName: location.name || data.name || normalizedCityName,
    country: location.country || data.sys?.country || '',
    state: location.state || '',
    coordinates: {
      lat: roundCoordinate(data.coord?.lat ?? location.lat),
      lon: roundCoordinate(data.coord?.lon ?? location.lon),
    },
    temp: roundToOneDecimal(data.main?.temp),
    tempMin: roundToOneDecimal(data.main?.temp_min),
    tempMax: roundToOneDecimal(data.main?.temp_max),
    feelsLike: roundToOneDecimal(data.main?.feels_like),
    humidity: toNullableNumber(data.main?.humidity),
    pressure: toNullableNumber(data.main?.pressure),
    seaLevelPressure: toNullableNumber(data.main?.sea_level),
    groundLevelPressure: toNullableNumber(data.main?.grnd_level),
    visibilityMeters: toNullableNumber(data.visibility),
    cloudiness: toNullableNumber(data.clouds?.all),
    windSpeed: roundToOneDecimal(data.wind?.speed),
    windDegrees,
    windDirection: getWindDirectionLabel(windDegrees),
    windGust: roundToOneDecimal(data.wind?.gust),
    precipitation: rainVolume ?? snowVolume,
    precipitationType: rainVolume !== null ? 'rain' : snowVolume !== null ? 'snow' : null,
    status: statusMap[data.weather?.[0]?.main] || '구름',
    weatherCondition: data.weather?.[0]?.main || '',
    description: data.weather?.[0]?.description || '',
    observedTimestamp: toNullableNumber(data.dt),
    observedAt: formatCityTime(data.dt, timezoneOffset, { month: 'short', day: 'numeric' }),
    sunriseAt: formatCityTime(data.sys?.sunrise, timezoneOffset),
    sunsetAt: formatCityTime(data.sys?.sunset, timezoneOffset),
    timezoneOffset,
  }
}

export const fetchForecastByCoordinates = async ({ lat, lon }) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY
  const latitude = toNullableNumber(lat)
  const longitude = toNullableNumber(lon)

  if (!apiKey) throw new Error('OpenWeather API 키가 없습니다. .env 파일의 VITE_WEATHER_API_KEY 환경변수를 확인해 주세요.')
  if (latitude === null || longitude === null) throw new Error('예보를 조회할 도시 좌표가 없습니다.')

  const response = await axios.get(OPEN_WEATHER_FORECAST_URL, {
    params: {
      lat: latitude,
      lon: longitude,
      appid: apiKey,
      units: 'metric',
      lang: 'kr',
      cnt: 40,
    },
  })

  const timezoneOffset = toNullableNumber(response.data.city?.timezone)

  return (response.data.list || [])
    .map((forecast) => {
      const rainVolume = roundToOneDecimal(forecast.rain?.['3h'])
      const snowVolume = roundToOneDecimal(forecast.snow?.['3h'])
      const localDate = getCityLocalDate(forecast.dt, timezoneOffset)
      const precipitationProbability = toNullableNumber(forecast.pop)

      return {
        timestamp: forecast.dt,
        dateKey: getCityDateKey(forecast.dt, timezoneOffset),
        dateLabel: formatCityDate(forecast.dt, timezoneOffset, { month: 'long', day: 'numeric', weekday: 'short' }),
        label: formatCityTime(forecast.dt, timezoneOffset, { weekday: 'short', hour: '2-digit', hour12: false }),
        timeLabel: formatCityDate(forecast.dt, timezoneOffset, { hour: '2-digit', minute: '2-digit', hour12: false }),
        localHour: localDate?.getUTCHours() ?? null,
        temperature: roundToOneDecimal(forecast.main?.temp),
        feelsLike: roundToOneDecimal(forecast.main?.feels_like),
        tempMin: roundToOneDecimal(forecast.main?.temp_min),
        tempMax: roundToOneDecimal(forecast.main?.temp_max),
        humidity: toNullableNumber(forecast.main?.humidity),
        windSpeed: roundToOneDecimal(forecast.wind?.speed),
        status: statusMap[forecast.weather?.[0]?.main] || '구름',
        description: forecast.weather?.[0]?.description || '',
        precipitationProbability: precipitationProbability === null ? null : Math.round(precipitationProbability * 100),
        precipitation: rainVolume ?? snowVolume,
        precipitationType: rainVolume !== null ? 'rain' : snowVolume !== null ? 'snow' : null,
      }
    })
    .filter((forecast) => forecast.temperature !== null)
}
