<script setup lang="ts">

const props = defineProps<{
  title: string
  value: number | string
}>()

</script>
<template>
  <div class="title-value">
    <span class="text">{{ title }}</span>
    <div class="value">{{ value }}</div>
  </div>
</template>


<style scoped lang="sass">
.title-value
  width: 70%
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  //font-weight: bolder
  text-transform: uppercase

  .text
    font-weight: 500
    color: var(--c-info-title-color)

  .value
    font-size: 2.5em
    font-weight: 600
    color: var(--c-info-value-color)

</style>