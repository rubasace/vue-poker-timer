<script setup lang="ts">

const props = defineProps<{
  title: string
  value: number | string
}>()

</script>
<template>
  <div class="title-value">
    <span class="text secondary">{{ title }}</span>
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
  font-weight: bolder
  text-transform: uppercase

  .value
    font-size: 2.2em

</style>