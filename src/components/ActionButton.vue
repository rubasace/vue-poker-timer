<script setup lang="ts">
defineProps<{
  title: string
  icon: string
}>()

</script>
<template>
  <div class="action-button">
    <i :class="'icon pi ' + icon"/>
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

  //TODO use theme colors
  &:hover
    cursor: pointer
    border-color: red
  &:active
    background-color: blue

  .title
    color: #444
    font-weight: bold

  .icon
    font-size: 3em
    font-weight: bolder
    color: black
    padding: 0.4em
</style>