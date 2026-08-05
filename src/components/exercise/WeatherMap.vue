<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  cityName: { type: String, default: '' },
})

const mapElement = ref(null)
let mapInstance = null
let markerInstance = null
const hasValidCoordinates = computed(() => Number.isFinite(props.latitude) && Number.isFinite(props.longitude) && Math.abs(props.latitude) <= 90 && Math.abs(props.longitude) <= 180)
const osmLink = computed(() => (hasValidCoordinates.value ? `https://www.openstreetmap.org/?mlat=${props.latitude}&mlon=${props.longitude}#map=11/${props.latitude}/${props.longitude}` : ''))

const updateMap = async () => {
  if (!hasValidCoordinates.value) {
    mapInstance?.remove()
    mapInstance = null
    markerInstance = null
    return
  }

  await nextTick()
  if (!mapElement.value) return
  const coordinates = [props.latitude, props.longitude]

  if (!mapInstance) {
    mapInstance = L.map(mapElement.value, { scrollWheelZoom: false }).setView(coordinates, 11)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance)
    markerInstance = L.marker(coordinates, {
      icon: L.divIcon({ className: 'atlas-map-marker', html: '<span aria-hidden="true"></span>', iconSize: [22, 22], iconAnchor: [11, 11] }),
      title: props.cityName,
    }).addTo(mapInstance)
  } else {
    mapInstance.setView(coordinates, mapInstance.getZoom())
    markerInstance?.setLatLng(coordinates)
  }
  window.setTimeout(() => mapInstance?.invalidateSize(), 0)
}

watch(() => [props.latitude, props.longitude], updateMap)
onMounted(updateMap)
onBeforeUnmount(() => {
  mapInstance?.remove()
  mapInstance = null
  markerInstance = null
})
</script>

<template>
  <section class="map-module" aria-labelledby="map-title">
    <header>
      <div>
        <p>LOCATION / OPENSTREETMAP</p>
        <h2 id="map-title">위치 및 지도</h2>
      </div>
      <a v-if="osmLink" :href="osmLink" target="_blank" rel="noopener noreferrer">OpenStreetMap에서 열기 ↗</a>
    </header>
    <template v-if="hasValidCoordinates">
      <div ref="mapElement" class="weather-map" role="region" :aria-label="`${cityName} 위치 지도`"></div>
      <p class="coordinate-copy">
        <strong>{{ cityName }}</strong
        ><span>위도 {{ latitude.toFixed(4) }} / 경도 {{ longitude.toFixed(4) }}</span>
      </p>
    </template>
    <p v-else class="map-empty" role="status">이 도시의 유효한 좌표 정보가 없어 지도를 표시할 수 없습니다.</p>
  </section>
</template>

<style scoped>
.map-module {
  padding: clamp(3rem, 5vw, 4.5rem) clamp(1.25rem, 5vw, 5rem);
  border-bottom: 1px solid var(--atlas-line);
}
.map-module header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--atlas-line-strong);
}
.map-module header p {
  margin: 0 0 0.4rem;
  color: var(--atlas-muted);
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}
.map-module h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3.4vw, 3.8rem);
  font-weight: 570;
  letter-spacing: -0.055em;
  line-height: 0.95;
}
.map-module a {
  padding: 0.35rem 0;
  border-bottom: 1px solid currentColor;
  color: var(--atlas-ink);
  font-size: 0.73rem;
  text-decoration: none;
}
.map-module a:focus-visible {
  outline: 2px solid var(--atlas-accent);
  outline-offset: 4px;
}
.weather-map {
  height: clamp(360px, 34vw, 440px);
  border: 1px solid var(--atlas-line);
  background: #d9d8d1;
  z-index: 0;
}
.coordinate-copy {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin: 0.8rem 0 0;
  color: var(--atlas-muted);
  font-size: 0.73rem;
}
.coordinate-copy strong {
  color: var(--atlas-ink);
}
.map-empty {
  min-height: 18rem;
  margin: 0;
  display: grid;
  place-items: center;
  border: 1px solid var(--atlas-line);
  color: var(--atlas-muted);
}
:global(.atlas-map-marker) {
  border: 0 !important;
  background: transparent !important;
}
:global(.atlas-map-marker span) {
  display: block;
  width: 20px;
  height: 20px;
  border: 5px solid #f1eee6;
  border-radius: 50%;
  background: #26302e;
  box-shadow: 0 0 0 1px rgba(27, 31, 29, 0.65);
}
@media (max-width: 640px) {
  .map-module {
    padding: 2.75rem 1rem;
  }
  .map-module header {
    align-items: flex-start;
    flex-direction: column;
    gap: 1rem;
  }
  .weather-map {
    height: 280px;
  }
  .coordinate-copy {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
