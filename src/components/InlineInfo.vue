<script setup lang="ts">

const props = defineProps<{
  text: string
  value: number | string
}>()


</script>
<template>
  <div class="inline-info">
    <div class="text"><span>{{ text }}:</span></div>
    <div class="value"><span>{{ value }}</span></div>
  </div>
</template>


<style scoped lang="sass">
.inline-info
  display: flex
  align-content: center
  justify-content: space-around
</style>