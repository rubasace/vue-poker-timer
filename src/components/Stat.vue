<script setup lang="ts">

defineProps<{
  title: string
  value: number | string
}>()

</script>
<template>
  <Card style="width: 13em">
    <template #title>
      <div class="text-xl font-bold">
        {{ value }}
      </div>
    </template>
    <template #content>
      <div>
        {{ title }}
      </div>
    </template>
  </Card>
</template>


<style scoped lang="sass">
//.action-button
//  width: 13em
//  border: 1px solid #aaa
//  border-radius: 12px
//  display: flex
//  flex-direction: column
//  align-items: center
//  justify-content: center
//  padding: 1em 0
//  box-shadow: 0 0 0 0 #bbb, 0 2px 2px 0 #bbb
//  margin: 0.2em
//
//  .title
//    color: #444
//    font-weight: bold
//  .value
//    font-size: 4em
//    font-weight: bolder
    //color: $primary-color
</style>