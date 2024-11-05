<script setup>

</script>

<template>
  <input type="color" class="color-picker"
         :id="`${key}Color`"
         v-model="customizationStore.paletteColors[key]"/>
</template>

<style scoped lang="sass">
.color-picker
  -webkit-appearance: none
  -moz-appearance: none
  appearance: none
  width: 100px
  height: 100px
  background-color: transparent
  border: none
  cursor: pointer

  &::-webkit-color-swatch
    border-radius: 15px
    border: none

  &::-moz-color-swatch
    border-radius: 15px
    border: none

</style>