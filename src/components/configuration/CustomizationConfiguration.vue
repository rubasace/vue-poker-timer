<script setup>
import {useCustomizationStore} from "@/stores/customizationStore.js";
import {useConfirm} from "primevue/useconfirm";

const confirm = useConfirm()
const customizationStore = useCustomizationStore()

function resetCustomization() {
  confirm.require({
    message: 'Do you want to load the original customization? Your changes will be lost',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    accept: () => {
      customizationStore.resetStore()
    }
  })
}

</script>

<template>

  <div class="form-container flex flex-wrap gap-2">
    <div v-for="(color, key) in customizationStore.paletteColors" :key="key" class="p-field">
      <label class="label" :for="`${key}Color`">{{ key.charAt(0).toUpperCase() + key.slice(1) }} Color</label>
      <input type="color" class="color-picker"
                   :id="`${key}Color`"
                   v-model="customizationStore.paletteColors[key]"
      />
    </div>
  </div>

  <div class="danger section">
    <Button label="Reset Customization" icon="pi pi-history" @click="resetCustomization()" severity="danger"/>
  </div>
</template>

<style scoped lang="sass">
.p-field
  width: 32%
  display: flex
  flex-direction: row
  align-items: center
  justify-content: start
  margin-top: 1em
  .label
    width: 13em
  .color-picker
    $size: 1.8em
    width: $size
    height: $size
    margin: 0
    padding: 0
    -webkit-appearance: none
    -moz-appearance: none
    appearance: none
    background-color: transparent
    border: none
    cursor: pointer

    &::-webkit-color-swatch-wrapper
      padding: 0
      border-radius: 15px
      border: none

    &::-moz-color-swatch
      border-radius: 15px
      border: 3px solid #000

.section-title
  width: 100%
  margin-top: 1em
  font-weight: bold
  font-size: 1.2em

.danger
  position: relative
  text-align: center
  margin-top: 3em

@media (max-width: 1080px)
  .p-field
    width: 100%
</style>