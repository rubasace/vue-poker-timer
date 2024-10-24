<template>
  <div class="clock">
    <div class="value">{{ clockValue }}</div>
    <div class="controls">
      <div class="previous" @click="$emit('previous')">‹</div>
      <div class="previous" @click="countDown -= 60">-1</div>
      <div class="toggle" @click="toggle()">{{ toggleIcon }}</div>
      <div class="previous" @click="countDown += 60">+1</div>
      <div class="next" @click="$emit('next')">›</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['minutes'],
  data() {
    return {
      countDown: this.minutes * 60,
      active: false
    }
  },
  methods: {
    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          if (this.active) {
            this.countDown -= 1
          }
          this.countDownTimer()
        }, 1000)
      } else {
        this.countDown = 0
        this.$emit('finished')
      }
    },
    toggle() {
      this.active = !this.active
      this.$emit('toggle', this.active)
    }
  },
  computed: {
    clockValue() {
      const minutes = Math.floor(this.countDown / 60)
      const seconds = this.countDown - minutes * 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },
    toggleIcon() {
      return this.active ? '⏸︎' : '▶'
    }
  },
  created() {
    this.countDownTimer()
  },
  mounted() {
    this.$emit('toggle', this.active)
  }
}
</script>

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
      padding:  0.1em 0.3em
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