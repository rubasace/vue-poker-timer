<script setup>
import {useThemeStore} from "@/stores/themeStore.js";
import {useConfirm} from "primevue/useconfirm";

const confirm = useConfirm()
const themeStore = useThemeStore()

function resetTheme() {
  confirm.require({
    message: 'Do you want to load the original theme? Your theme will be lost',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    accept: () => {
      themeStore.resetStore()
    }
  })
}

</script>

<template>
  <div class="p-field p-fluid">
    <label for="primaryColor">Primary Color</label>
    <ColorPicker
        id="primaryColor"
        v-model="themeStore.primaryColor"
        format="hex"
    />
  </div>
  <div class="p-field p-fluid">
    <label for="secondaryColor">Secondary Color</label>
    <ColorPicker
        id="secondaryColor"
        v-model="themeStore.secondaryColor"
        format="hex"
    />
  </div>

  <div class="danger section">
    <Button label="Reset Theme" icon="pi pi-history" @click="resetTheme()" severity="danger"/>
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