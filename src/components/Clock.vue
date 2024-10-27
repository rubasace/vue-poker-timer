<script setup>

import {computed, onUnmounted, ref, watch} from "vue";
import {useTimerStore} from "@/stores/timerState.js";
import {useTournamentInfoStore} from "@/stores/tournamentInfo.js";
import {formatClockValue} from "@/util/formatUtils.js";
import beepSound from "@/assets/700-hz-beeps-86815.mp3";

const timerStore = useTimerStore();
const tournamentInfoStore = useTournamentInfoStore();

const audio = new Audio(beepSound);

timerStore.levelTimer = calculateLevelSeconds()

const clockValue = computed(() => {
  return formatClockValue(timerStore.levelTimer)
})

const toggleIcon = computed(() => {
  if (timerStore.active) {
    return '⏸'
  } else {
    return '▶'
  }
})

const levelIndex = computed(() => {
  return timerStore.levelIndex
})

let timer = null;

function countDownTimer() {
  timer = setTimeout(() => {
    if (timerStore.active) {
      timerStore.levelTimer -= 1
    }
    if (timerStore.levelTimer <= 0) {
      timerStore.levelTimer = 0

      playAudio()
      timerStore.incrementLevel()
    } else {
      countDownTimer()
    }
  }, 1000)
}

//TODO cut audio accordingly to avoid issues and stop pausing it
// TODO allow to configure audio
function playAudio() {
  audio.play()
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0; // Reset to the start
  }, 1000);
}

function calculateLevelSeconds() {
  return 60 * (tournamentInfoStore.currentLevel?.minutes ?? 0)
}

watch(levelIndex, () => {
  clearTimeout(timer)
  timerStore.levelTimer = calculateLevelSeconds()
  countDownTimer()
})

onUnmounted(() => {
  clearTimeout(timer)
})

if(timer){
  clearTimeout(timer)
}
countDownTimer()

</script>
<template>
  <div class="clock">
    <div class="value">{{ clockValue }}</div>
    <div class="controls">
      <div class="previous" @click="timerStore.reduceLevel">‹</div>
      <div class="previous" @click="timerStore.reduceSeconds(60)">-1</div>
      <div class="toggle" @click="timerStore.toggle()">{{ toggleIcon }}</div>
      <div class="previous" @click="timerStore.addSeconds(60)">+1</div>
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