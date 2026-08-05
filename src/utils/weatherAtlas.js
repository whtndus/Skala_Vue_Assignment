import clearCityImage from '@/assets/weather-atlas/clear-city.jpg'
import rainCityImage from '@/assets/weather-atlas/rain-city.jpg'
import cloudCityImage from '@/assets/weather-atlas/cloud-city.jpg'
import snowCityImage from '@/assets/weather-atlas/snow-city.jpg'
import seoulCityImage from '@/assets/weather-atlas/seoul-city.jpg'
import jejuCityImage from '@/assets/weather-atlas/jeju-city.jpg'
import busanCityImage from '@/assets/weather-atlas/busan-city.jpg'
import londonCityImage from '@/assets/weather-atlas/london-city.jpg'
import tokyoCityImage from '@/assets/weather-atlas/tokyo-city.jpg'
import newYorkCityImage from '@/assets/weather-atlas/new-york-city.jpg'
import singaporeCityImage from '@/assets/weather-atlas/singapore-city.jpg'
import dubaiCityImage from '@/assets/weather-atlas/dubai-city.jpg'
import parisCityImage from '@/assets/weather-atlas/paris-city.jpg'

const normalizeCityName = (value) =>
  String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}]/gu, '')

const registerAliases = (image, aliases) => aliases.map((alias) => [normalizeCityName(alias), image])

const cityImages = new Map([
  ...registerAliases(seoulCityImage, ['서울', '서울특별시', 'Seoul']),
  ...registerAliases(jejuCityImage, ['제주', '제주시', 'Jeju', 'Jeju City']),
  ...registerAliases(busanCityImage, ['부산', '부산광역시', 'Busan']),
  ...registerAliases(londonCityImage, ['런던', 'London']),
  ...registerAliases(tokyoCityImage, ['도쿄', '동경', 'Tokyo']),
  ...registerAliases(newYorkCityImage, ['뉴욕', 'New York', 'New York City']),
  ...registerAliases(singaporeCityImage, ['싱가포르', 'Singapore']),
  ...registerAliases(dubaiCityImage, ['두바이', 'Dubai']),
  ...registerAliases(parisCityImage, ['파리', 'Paris']),
])

const weatherImages = {
  맑음: clearCityImage,
  비: rainCityImage,
  구름: cloudCityImage,
  눈: snowCityImage,
}

export const getWeatherAtlasImage = (city) => {
  const cityImage = [city?.name, city?.officialName]
    .map(normalizeCityName)
    .map((name) => cityImages.get(name))
    .find(Boolean)

  return cityImage || weatherImages[city?.status] || cloudCityImage
}
