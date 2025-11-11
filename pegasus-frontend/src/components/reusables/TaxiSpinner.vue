<template>
  <div class="taxi-spinner" :class="{ 
    'loading': isLoading,
    [`size-${size}`]: size !== 'medium'
  }">
    <div class="taxi-container">
      <!-- Taxi Body -->
      <div class="taxi-body">
        <!-- Taxi Roof -->
        <div class="taxi-roof">
          <div class="taxi-sign">TAXI</div>
          <div class="taxi-light"></div>
        </div>
        
        <!-- Main Car Body -->
        <div class="car-main">
          <div class="car-window"></div>
          <div class="car-door"></div>
        </div>
        
        <!-- Wheels -->
        <div class="wheel wheel-front">
          <div class="wheel-inner">
            <div class="wheel-spokes">
              <div class="spoke spoke-1"></div>
              <div class="spoke spoke-2"></div>
              <div class="spoke spoke-3"></div>
              <div class="spoke spoke-4"></div>
            </div>
          </div>
        </div>
        <div class="wheel wheel-rear">
          <div class="wheel-inner">
            <div class="wheel-spokes">
              <div class="spoke spoke-1"></div>
              <div class="spoke spoke-2"></div>
              <div class="spoke spoke-3"></div>
              <div class="spoke spoke-4"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading Dots -->
      <div class="loading-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
    
    <!-- Optional Loading Text -->
    <div v-if="showText" class="loading-text">
      {{ loadingText }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isLoading?: boolean
  showText?: boolean
  loadingText?: string
  size?: 'small' | 'medium' | 'large'
}

withDefaults(defineProps<Props>(), {
  isLoading: true,
  showText: true,
  loadingText: 'Getting your ride ready...',
  size: 'medium'
})
</script>

<style scoped>
.taxi-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.taxi-container {
  position: relative;
  width: 120px;
  height: 80px;
}

/* Taxi Body */
.taxi-body {
  position: relative;
  width: 100%;
  height: 60px;
  margin-bottom: 20px;
}

/* Taxi Roof */
.taxi-roof {
  position: absolute;
  top: 0;
  left: 15px;
  right: 15px;
  height: 25px;
  background: #FFD700;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.taxi-sign {
  background: #000;
  color: #FFD700;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
  border-radius: 2px;
  font-family: 'Arial', sans-serif;
}

.taxi-light {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 8px;
  height: 8px;
  background: #FF4444;
  border-radius: 50%;
  animation: blink 1.5s infinite;
}

/* Main Car Body */
.car-main {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 35px;
  background: #FFD700;
  border-radius: 5px;
  border: 2px solid #FFA500;
}

.car-window {
  position: absolute;
  top: 3px;
  left: 8px;
  right: 8px;
  height: 15px;
  background: #87CEEB;
  border-radius: 3px;
  opacity: 0.8;
}

.car-door {
  position: absolute;
  top: 20px;
  left: 50%;
  width: 1px;
  height: 12px;
  background: #FFA500;
}

/* Wheels */
.wheel {
  position: absolute;
  bottom: -15px;
  width: 24px;
  height: 24px;
  background: #333;
  border-radius: 50%;
  border: 3px solid #666;
}

.wheel-front {
  left: 15px;
  animation: spin 1s linear infinite;
}

.wheel-rear {
  right: 15px;
  animation: spin 1s linear infinite reverse;
}

.wheel-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: #555;
  border-radius: 50%;
  border: 2px solid #888;
}

.wheel-spokes {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
}

.spoke {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 8px;
  background: #222;
  transform-origin: center center;
  border-radius: 1px;
}

.spoke-1 {
  transform: translate(-50%, -50%) rotate(0deg);
}

.spoke-2 {
  transform: translate(-50%, -50%) rotate(45deg);
}

.spoke-3 {
  transform: translate(-50%, -50%) rotate(90deg);
}

.spoke-4 {
  transform: translate(-50%, -50%) rotate(135deg);
}

.wheel-inner::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border-radius: 50%;
  background: #777;
  border: 1px solid #999;
}

/* Loading Dots */
.loading-dots {
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #FFD700;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

/* Loading Text */
.loading-text {
  margin-top: 1rem;
  color: #666;
  font-size: 14px;
  text-align: center;
  animation: pulse 2s infinite;
}

/* Animations */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Hover Effect */
.taxi-spinner:hover .taxi-body {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

/* Size Variants */
.taxi-spinner.size-small .taxi-container {
  width: 80px;
  height: 60px;
  transform: scale(0.7);
}

.taxi-spinner.size-large .taxi-container {
  width: 120px;
  height: 100px;
  transform: scale(1.4);
}

/* Loading State */
.loading .taxi-body {
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .loading-text {
    color: #CCC;
  }
  
  .car-window {
    background: #4A90B8;
  }
}
</style>