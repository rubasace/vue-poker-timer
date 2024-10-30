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
      <span class="title secondary">Blinds</span>
      <div class="value">
        <span class="small-blind">{{ smallBlind }}</span>
        <span class="separator">/</span>
        <span class="big-blind">{{ bigBlind }}</span>
      </div>
    </div>
    <div class="ante" v-if="ante">
      <span class="title secondary">Ante</span>
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
  .value
    font-size: 1.7em
    font-weight: 900
</style>