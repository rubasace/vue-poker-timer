<script setup lang="ts">

const props = defineProps<{
  smallBlind: number | string
  bigBlind: number | string
  ante?: number | string
}>()


</script>
<template>
  <div class="blinds-info">
    <div class="blinds">
      <span class="title">Blinds</span>
      <div class="value">
        <span class="small-blind">{{ smallBlind }}</span>
        <span class="separator">/</span>
        <span class="big-blind">{{ bigBlind }}</span>
      </div>
    </div>
    <div class="ante" v-if="ante">
      <span class="title">Ante</span>
      <div class="value">
        <span class="ante">{{ ante }}</span>
      </div>
    </div>
  </div>
</template>


<style scoped lang="sass">
.blinds-info
  display: flex
  justify-content: space-around
  line-height: 2em
  .title
    color: var(--c-blinds-title-color)
  .value
    span
      color: var(--c-blinds-value-color)
      font-size: 1.7em
      font-weight: 600
</style>