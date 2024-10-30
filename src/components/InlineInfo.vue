<script setup lang="ts">

const props = defineProps<{
  text: string
  value: number | string
}>()


</script>
<template>
  <div class="inline-info">
    <span class="text">{{ text }}:</span>
    <div class="value">{{ value }}</div>
  </div>
</template>


<style scoped lang="sass">
.inline-info
  display: flex
  justify-content: space-between
  font-size: 0.6em

</style>