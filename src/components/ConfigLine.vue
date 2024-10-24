<script setup lang="ts">

const props = defineProps<{
  title: string
  value: number
}>()

</script>
<template>
  <div class="config-line">
    <span class="text">{{ title }}</span>
    <span class="action" @click="$emit('decrement')">-</span>
    <div class="value">{{ value }}</div>
    <span class="action" @click="$emit('increment')">+</span>
  </div>
</template>


<style scoped lang="sass">
.config-line
  color: black
  //width: 70%
  display: grid
  grid-template-columns: 3fr 1fr 1fr 1fr 3fr 3fr
  align-items: center
  justify-content: space-around
  font-weight: bolder
  text-transform: uppercase
  .action
    cursor: pointer
    font-size: 1.8em

</style>