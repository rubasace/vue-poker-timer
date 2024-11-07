<script setup xmlns="http://www.w3.org/1999/html">
import {useCustomizationStore} from "@/stores/customizationStore.js";
import {useConfirm} from "primevue/useconfirm";
import {computed, ref} from "vue";
import { useToast } from 'primevue/usetoast';

const confirm = useConfirm()
const customizationStore = useCustomizationStore()

const toast = useToast();

const fileInput = ref(null);

const categorizedColors = computed(() => {
  const categories = {};
  for (const [key, color] of Object.entries(customizationStore.paletteColors)) {
    const category = customizationStore.getCategory(key);
    if (!categories[category]) {
      categories[category] = {};
    }
    categories[category][key] = color;
  }
  return categories;
});

function openFilePicker() {
  fileInput.value.choose()
}

function uploadNewLevelSound(event) {
  const file = event.files[0];
  if (file) {
    customizationStore.setNewLevelSound(file)
    toast.add({ severity: 'success', summary: 'File Uploaded', detail: `Audio file ${file.name} uploaded successfully`, life: 5000 });

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
      toast.add({ severity: 'success', summary: 'Customizations Reset', detail: `All customizations have been reset to their default values`, life: 5000 });
    }
  })
}

function clearNewLevelSound() {
  confirm.require({
    message: 'Do you want to remove the audio file? You will need to upload it again or reset to the default one if you want to undo the changes',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    accept: () => {
      const fileName = customizationStore.newLevelFileName
      customizationStore.clearNewLevelSound()
      toast.add({ severity: 'success', summary: 'File removed', detail: `File ${fileName} removed successfully`, life: 5000 });
    }
  })
}

const backgroundTypes = ref([
  {name: 'Solid Color', value: 'solid'},
  {name: 'Gradient', value: 'gradient'},
  {name: 'Custom CSS', value: 'custom'}
]);

</script>

<template>

  <div v-for="(colors, category) in categorizedColors" :key="category">
    <div class="section-title">{{ category }} Colors</div>
    <div class="form-container flex flex-wrap gap-2">
      <div v-for="(color, key) in colors" :key="key" class="p-field">
        <label class="label" :for="`${key}Color`">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</label>
        <input type="color" class="color-picker"
               :id="`${key}Color`"
               v-model="customizationStore.paletteColors[key]"
        />
      </div>
    </div>
  </div>

  <div class="section-title">Background</div>

  <div class="p-field">
    <label class="label" for="background-type">Type</label>
    <Select v-model="customizationStore.backgroundSetting.type" id="background-type" :options="backgroundTypes" optionLabel="name" optionValue="value"/>
  </div>

  <div class="p-field row">
    <label class="label" for="background-type">Value</label>
    <input type="color" class="color-picker"
           v-model="customizationStore.backgroundSetting.color"
           v-if="customizationStore.backgroundSetting.type === 'solid'"
    />
    <InputText v-model="customizationStore.backgroundSetting.gradient" id="tournamentSeries" style="width: 90%" v-if="customizationStore.backgroundSetting.type === 'gradient'"/>

    <Textarea v-model="customizationStore.backgroundSetting.customCSS" rows="7" cols="43" placeholder="Enter custom CSS for background"
              v-if="customizationStore.backgroundSetting.type === 'custom'"/>
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
    <Button icon="pi pi-trash" severity="secondary" @click="clearNewLevelSound()" class="action delete" raised v-visible="customizationStore.isNewLevelSound()"/>
    <Button label="Upload" icon="pi pi-upload" severity="primary" @click="openFilePicker" class="action" raised/>

  </div>

  <div class="danger section">
    <Button label="Reset Customization" icon="pi pi-history" @click="resetCustomization()" severity="danger"/>
  </div>

</template>

<style scoped lang="sass">
.label
  width: 120px

.p-field
  width: 32%
  display: flex
  flex-direction: row
  align-items: center
  justify-content: start
  margin-top: 1em
  &.row
    width: 100%

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
  text-transform: capitalize


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