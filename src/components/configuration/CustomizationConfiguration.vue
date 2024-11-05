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
  <div v-for="(color, key) in customizationStore.paletteColors" :key="key" class="p-field p-fluid">
    <label :for="`${key}Color`">{{ key.charAt(0).toUpperCase() + key.slice(1) }} Color</label>
    <ColorPicker
        :id="`${key}Color`"
        v-model="customizationStore.paletteColors[key]"
        format="hex"
    />
  </div>

  <div class="danger section">
    <Button label="Reset Customization" icon="pi pi-history" @click="resetCustomization()" severity="danger"/>
  </div>
</template>

<style scoped lang="sass">
.p-field
  width: 48%
  min-width: 200px
  display: flex
  flex-direction: column
  margin-top: 1em
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