<template>
  <div class="dialog">
    <div class="content">
      <div class="slot">
        <slot/>
      </div>
      <span class="close" @click="$emit('close')">X</span>
    </div>
  </div>
</template>


<style scoped lang="sass">
.dialog
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  width: 100%
  height: 100%
  align-content: center
  background: rgba(255, 255, 255, 0.5)
  backdrop-filter: blur(5px)
  z-index: 10

  .content
    position: relative
    background-color: whitesmoke
    border-radius: 5px
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5)
    max-width: 1000px
    min-width: 300px
    width: 80%
    height: 95%
    margin: auto

  &:hover
    cursor: auto

  .slot
    padding: 20px
  .close
    color: black
    border-radius: 9999px
    border: 1px solid black
    position: absolute
    right: 10px
    top: 20px
    font-size: 1.5em
    cursor: pointer
    &:hover
      background-color: black
      color: white
</style>
<script setup lang="ts">
</script>