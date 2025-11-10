<template>
  <div class="booking-map-compact">
    <iframe
      v-if="mapSrc"
      :src="mapSrc"
      width="100%"
      height="100%"
      style="border: 0"
      allowfullscreen=true
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      class=" flex justify-center items-center rounded-lg mx-auto  shrink-0 bg-gray-100 outline -outline-offset-1 outline-black/5 overflow-hidden"
    ></iframe>
    <div v-else class="w-full h-full flex items-center justify-center">
      <div class="text-3xl text-gray-500">📍</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { BookingResponseDto } from '@/types/booking-response-dto'

interface Props {
  booking: BookingResponseDto
}

const props = defineProps<Props>()

const apiKey = import.meta.env.VITE_GOOGLEMAPS
const iframeError = ref(false)

// Reset error state when booking changes
watch(() => props.booking?.bookingId, () => {
  iframeError.value = false
})

const mapSrc = computed(() => {
  if (!props.booking || !apiKey || iframeError.value) {
    return null
  }

  if (hasValidRoute.value) {
    return buildDirectionsUrl()
  } else if (hasPickupLocation.value) {
    return buildPlaceUrl()
  }
  
  return null
})

const hasPickupLocation = computed(() => {
  return props.booking.pickUpLatitude && props.booking.pickUpLongitude
})

const hasDropOffLocation = computed(() => {
  return props.booking.dropOffLatitude && props.booking.dropOffLongitude
})

const hasValidRoute = computed(() => {
  return hasPickupLocation.value && hasDropOffLocation.value
})

const buildDirectionsUrl = () => {
  const baseUrl = 'https://www.google.com/maps/embed/v1/directions'
  const params = new URLSearchParams({
    key: apiKey,
    origin: `${props.booking.pickUpLatitude},${props.booking.pickUpLongitude}`,
    destination: `${props.booking.dropOffLatitude},${props.booking.dropOffLongitude}`,
    mode: 'driving'
  })

  // Add waypoints if stops exist
  const waypoints = []
  
  if (props.booking.firstStopLatitude && props.booking.firstStopLongitude) {
    waypoints.push(`${props.booking.firstStopLatitude},${props.booking.firstStopLongitude}`)
  }
  
  if (props.booking.secondStopLatitude && props.booking.secondStopLongitude) {
    waypoints.push(`${props.booking.secondStopLatitude},${props.booking.secondStopLongitude}`)
  }
  
  if (waypoints.length > 0) {
    params.set('waypoints', waypoints.join('|'))
  }

  return `${baseUrl}?${params.toString()}`
}

const buildPlaceUrl = () => {
  // Fallback to place mode if only pickup location is available
  const baseUrl = 'https://www.google.com/maps/embed/v1/place'
  const params = new URLSearchParams({
    key: apiKey,
    q: `${props.booking.pickUpLatitude},${props.booking.pickUpLongitude}`,
    zoom: '12'
  })

  return `${baseUrl}?${params.toString()}`
}
</script>

