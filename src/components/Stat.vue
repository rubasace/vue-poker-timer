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