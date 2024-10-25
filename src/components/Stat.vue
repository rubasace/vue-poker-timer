<script setup lang="ts">

defineProps<{
  title: string
  value: number
}>()

</script>
<template>
  <div class="action-button">
    <div class="value">{{ value }}</div>
    <span class="title">{{ title }}</span>
  </div>
</template>


<style scoped lang="sass">
.action-button
  width: 12em
  border: 1px solid #aaa
  border-radius: 12px
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  padding: 1em 0
  box-shadow: 0 0 0 0 #bbb, 0 2px 2px 0 #bbb
  margin: 0.2em

  .title
    color: #444
    font-weight: bold
  .value
    font-size: 4em
    font-weight: bolder
    color: black
</style>