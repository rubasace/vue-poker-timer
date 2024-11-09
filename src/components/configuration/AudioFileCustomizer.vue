<script setup>
import { ref } from 'vue';
import {useCustomizationStore} from "@/stores/customizationStore.js";
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";

const toast = useToast();
const confirm = useConfirm();
const customizationStore = useCustomizationStore();

const props = defineProps({
  label: String,
  fileName: String,
  uploadFile: Function,
  clearFile: Function,
  isFileUploaded: Boolean,
});

const fileInput = ref(null);

const onFileSelect = (event) => {
  const file = event.files[0];
  if (file) {
    props.uploadFile(file);
  }
};

const openFilePicker = () => {
  fileInput.value.choose();
};

function clearSound() {
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
      props.clearFile()
      toast.add({ severity: 'success', summary: 'File removed', detail: `File ${fileName} removed successfully`, life: 5000 });
    }
  })
}
</script>

<template>
  <div class="audio-field">
    <FileUpload
        ref="fileInput"
        mode="basic"
        @select="onFileSelect"
        customUpload
        auto
        accept="audio/*"
        style="display: none"
        :maxFileSize="1000000"
    />

    <label class="label">{{ label }}</label>
    <span class="file-name">{{ fileName }}</span>
    <Button
        icon="pi pi-trash"
        severity="secondary"
        @click="clearSound"
        class="action delete"
        raised
        v-visible="customizationStore.isSoundFile(fileName)"
    />
    <Button
        label="Upload"
        icon="pi pi-upload"
        severity="primary"
        @click="openFilePicker"
        class="action"
        raised
    />
  </div>
</template>

<style scoped lang="sass">
.audio-field
  width: 100%
  display: flex
  flex-direction: row
  align-items: center
  justify-content: start
  margin-top: 1em

  .label
    width: 120px

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
</style>