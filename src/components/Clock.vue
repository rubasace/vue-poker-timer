<script setup>

import {computed, defineProps, ref, watch} from "vue";
import {useTimerStore} from "@/stores/timerState.js";
import {useTournamentInfoStore} from "@/stores/tournamentInfo.js";

const timerStore = useTimerStore();
const tournamentInfoStore = useTournamentInfoStore();

const props = defineProps({
  minutes: {
    type: Number,
    required: true
  }
})


const countDown = ref(getLevelTime())
const active = ref(true)


const clockValue = computed(() => {
  const minutes = Math.floor(countDown.value / 60)
  const seconds = countDown.value - minutes * 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const toggleIcon = computed(() => {
  if (active.value) {
    return '⏸'
  } else {
    return '▶'
  }
})

const levelIndex = computed(() => {
  return timerStore.levelIndex
})

function countDownTimer() {
  setTimeout(() => {
    if (active.value) {
      countDown.value -= 1
    }
    if (countDown.value <= 0) {
      countDown.value = 0
      timerStore.incrementLevel()
    }
    countDownTimer()
  }, 1000)
}

function toggle() {
  active.value = !active.value
}

function getLevelTime(){
  return 60 * tournamentInfoStore.currentLevel.minutes
}

watch(levelIndex, () => {
  countDown.value = getLevelTime()
})

countDownTimer()

</script>
<template>
  <div class="clock">
    <div class="value">{{ clockValue }}</div>
    <div class="controls">
      <div class="previous" @click="timerStore.reduceLevel">‹</div>
      <div class="previous" @click="countDown -= 60">-1</div>
      <div class="toggle" @click="toggle()">{{ toggleIcon }}</div>
      <div class="previous" @click="countDown += 60">+1</div>
      <div class="next" @click="timerStore.incrementLevel">›</div>
    </div>
  </div>
</template>

<style scoped lang="sass">
$highlight-color: #04479c
.clock
  font-size: 1em
  text-shadow: 10px 10px 10px #1e1e1e
  position: relative

  .controls
    visibility: hidden
    backdrop-filter: blur(10px)
    position: absolute
    margin: auto
    top: 0
    bottom: 0
    width: 100%
    display: flex
    flex-direction: row
    align-items: center
    justify-content: center

    div
      display: inline-block
      padding: 0.1em 0.3em
      font-size: 0.6em
      margin: auto auto
      vertical-align: center
      text-shadow: 10px 10px 10px #1e1e1e

      &:hover
        cursor: pointer
        color: $highlight-color

  &:hover
    .controls
      visibility: visible
</style>