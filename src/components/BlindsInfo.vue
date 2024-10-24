<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  text: string
  value: number
}>()

const blindValues = computed(() => {
  return props.blinds?.split('/').map(b => parseInt(b))
})

</script>
<template>
  <div class="blinds-info" >
    <div class="blinds-data">
      <div class="info-line">
        <span class="text">{{text}}:</span>
        <div class="value">{{value}}</div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="sass">
.blinds-info
  font-weight: bolder
  .info-line
    display: flex
    font-size: 0.6em
    justify-content: space-between
</style>