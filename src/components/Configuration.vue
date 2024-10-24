<script setup lang="ts">

const props = defineProps<{
  entries: number
  reentries: number
  addons: number
  remainingPlayers: number
}>()

</script>
<template>
  <div class="settings-form">
    <div class="details">
      <span>Entries: {{ entries }}</span>
      <span>Reentries: {{ reentries }}</span>
      <span>Addons: {{ addons }}</span>
      <span>Remaining Players: {{ remainingPlayers }}</span>
    </div>
    <div class="actions">
      <button @click="$emit('registerPlayer')">Register Player</button>
      <button @click="$emit('unregisterPlayer')">Unregister Player</button>
      <button @click="$emit('addReentry')">Add Reentry</button>
      <button @click="$emit('removeReentry')">Remove Reentry</button>
      <button @click="$emit('addAddon')">Add Addon</button>
      <button @click="$emit('removeAddon')">Remove Addon</button>
      <button @click="$emit('eliminatePlayer')">Register Elimination</button>
      <button @click="$emit('undoElimination')">Undo Elimination</button>
    </div>
  </div>
</template>


<style scoped lang="sass">
.settings-form
  .details
    display: grid
    grid-template-columns: 1fr 1fr 1fr 1fr
    grid-auto-rows: minmax(10px, auto)
    grid-gap: 10px
    margin-bottom: 3em
    span
      display: block
      border: 1px solid black
      text-align: center
      height: 3em
  .actions
    display: grid
    grid-template-columns: 1fr 1fr 1fr 1fr
    grid-auto-rows: minmax(10px, auto)
    grid-gap: 10px

    button
      padding: 0.5em

</style>