<script setup>

import {computed, watch} from "vue";
import {useTimerStore} from "@/stores/timerStore.js";
import {useLeaderStore} from "@/stores/leaderStore.js";
import {useCustomizationStore} from "@/stores/customizationStore.js";
import {useTournamentInfoStore} from "@/stores/tournamentInfoStore.js";

const timerStore = useTimerStore();
const leaderStore = useLeaderStore()
const customizationStore = useCustomizationStore()
const tournamentInfoStore = useTournamentInfoStore()


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

function playSound(audio) {
  if (!audio) {
    return
  }
  audio.play()
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, 5000);
}

watch(levelTimer, (newVal) => {
  if (!leaderStore.isLeaderTab) {
    return
  }
  if (newVal === 0) {
    if (tournamentInfoStore.currentLevel.break || tournamentInfoStore.next?.break) {
      playSound(customizationStore.newBreakAudio);
    } else {
      playSound(customizationStore.newLevelAudio);
    }
  }
  if (newVal === 60) {
    playSound(customizationStore.oneMinuteAudio);
  }
})

</script>
<template>
  <div class="clock">
    <div class="paused-message" v-if="!timerStore.active">
      <span>Clock Paused</span>
    </div>
    <div class="value">
      <div class="time-part" v-if="timerStore.clockParts.hours">
        <span class="controls increase-button" @click="timerStore.addSeconds(3600)">▲</span>
        <span class="hours number">{{ timerStore.clockParts.hours.toString().padStart(2, '0') }}</span>
        <span class="controls decrease-button" @click="timerStore.reduceSeconds(3600)">▼</span>
      </div>
      <div class="time-part" v-if="timerStore.clockParts.hours">
        <span class="separator">:</span>
      </div>

      <div class="time-part">
        <span class="controls increase-button" @click="timerStore.addSeconds(60)">▲</span>
        <span class="minutes number">{{ timerStore.clockParts.minutes.toString().padStart(2, '0') }}</span>
        <span class="controls decrease-button" @click="timerStore.reduceSeconds(60)">▼</span>
      </div>

      <div class="time-part">
        <span class="controls toggle" @click="timerStore.toggle()">{{ toggleIcon }}</span>
        <span class="separator">:</span>
      </div>

      <div class="time-part">
        <span class="controls increase-button" @click="timerStore.addSeconds(1)">▲</span>
        <span class="seconds number">{{ timerStore.clockParts.seconds.toString().padStart(2, '0') }}</span>
        <span class="controls decrease-button" @click="timerStore.reduceSeconds(1)">▼</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
@use "sass:color"

.clock
  font-size: 1em
  position: relative

  .paused-message
    font-size: 0.55em
    line-height: 0.7em
    position: absolute
    top: 1em
    padding: 0.5em
    width: 100%

    span
      position: relative
      z-index: 1
      color: white

    &::before
      content: ""
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      pointer-events: none
      background-color: var(--c-paused-box-color)
      opacity: 0.8

    div
      display: inline-block
      padding: 0.1em 0.3em
      font-size: 0.6em
      margin: auto auto
      vertical-align: center

      &:hover
        cursor: pointer
        color: var(--c-hover-color)

  .value
    display: flex
    align-items: center

    .time-part
      display: flex
      flex-direction: column
      align-items: center
      margin: 0

      .number
        color: var(--c-clock-number-color)

      .separator
        color: var(--c-clock-separator-color)

      span
        font-weight: 700

      .controls
        font-size: 0.4em
        background: none
        border: none
        cursor: pointer
        color: var(--c-controls-color)
        position: absolute
        visibility: hidden

        &.toggle
          font-size: 0.8em

        &.increase-button
          top: -1em

        &.decrease-button
          bottom: -1em

        &:hover
          color: var(--c-hover-color)

      &:hover
        .controls
          visibility: visible
</style>