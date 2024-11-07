<script setup xmlns="http://www.w3.org/1999/html">
import {useCustomizationStore} from "@/stores/customizationStore.js";
import {useConfirm} from "primevue/useconfirm";
import {ref} from "vue";

const confirm = useConfirm()
const customizationStore = useCustomizationStore()

const fileInput = ref(null);

function openFilePicker() {
  fileInput.value.choose()
}

function uploadNewLevelSound(event) {
  const file = event.files[0];
  if (file) {
    customizationStore.setNewLevelSound(file)
  }
}

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

  <div class="section-title">Colors</div>

  <div class="form-container flex flex-wrap gap-2">
    <div v-for="(color, key) in customizationStore.paletteColors" :key="key" class="p-field">
      <label class="label" :for="`${key}Color`">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</label>
      <input type="color" class="color-picker"
             :id="`${key}Color`"
             v-model="customizationStore.paletteColors[key]"
      />
    </div>
  </div>

  <div class="section-title">Sounds</div>

  <div class="audio-field">
    <FileUpload
        ref="fileInput"
        mode="basic"
        @select="uploadNewLevelSound"
        customUpload
        auto
        accept="audio/*"
        style="display: none"
        :maxFileSize="1000000"
    />

    <label class="label">New Level</label>
    <span class="file-name">{{ customizationStore.newLevelFileName }}</span>
    <Button icon="pi pi-trash" severity="secondary" @click="customizationStore.clearNewLevelSound()" class="action delete" raised/>
    <Button label="Upload" icon="pi pi-upload" severity="primary" @click="openFilePicker" class="action" raised/>

  </div>

  <div class="danger section">
    <Button label="Reset Customization" icon="pi pi-history" @click="resetCustomization()" severity="danger"/>
  </div>

</template>

<style scoped lang="sass">
.label
  width: 9em

.p-field
  width: 32%
  display: flex
  flex-direction: row
  align-items: center
  justify-content: start
  margin-top: 1em

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



.audio-field
  width: 100%
  display: flex
  flex-direction: row
  align-items: center
  justify-content: start
  margin-top: 1em
  .file-name
    width: 13em
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
    margin-right: 1em

  .action
    font-size: 0.95em
    margin-right: 0.6em
    &.delete
      color: #e20f0f


.section-title
  width: 100%
  margin-top: 1em
  font-weight: bold
  font-size: 1.2em



.danger
  position: relative
  text-align: center
  margin-top: 3em

@media (max-width: 800px)
  .p-field
    width: 48%

@media (max-width: 550px)
  .p-field
    width: 100%
</style>