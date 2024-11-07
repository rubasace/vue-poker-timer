<script setup lang="ts">

defineProps<{
  value: number | string
  title: string
}>()

</script>
<template>
  <Card style="width: 100%" >
    <template #title>
      <div class="value">
        {{ value }}
      </div>
    </template>
    <template #content>
      <div class="title">
        {{ title }}
      </div>
    </template>
  </Card>
</template>
<style scoped lang="sass">
.value
  font-size: 2.3em !important
  font-weight: bold
</style>