<script setup>

import {computed, watch} from "vue";
import {useTimerStore} from "@/stores/timerStore.js";
import {formatClockValue} from "@/util/formatUtils.js";
import newLevelSound from "@/assets/sounds/nuevo_cambio_de_nivel.wav";
import {useLeaderStore} from "@/stores/leaderStore.js";

const timerStore = useTimerStore();
const leaderStore = useLeaderStore()

const newLevelAudio = new Audio(newLevelSound);

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

const levelTimer = computed(() => {
  return timerStore.levelTimer
})

watch(levelTimer, (newVal) => {
  if (newVal === 1 && leaderStore.isLeaderTab) {
    newLevelAudio.play()
  }
})

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

  .value
    font-weight: 700
  &:hover
    .controls
      visibility: visible
</style>