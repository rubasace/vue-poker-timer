<script setup>
import {useTournamentInfoStore} from "@/stores/tournamentInfoStore.js";
import {ref} from "vue";
import {useEntriesStore} from "@/stores/entriesStore.js";
import {useTimerStore} from "@/stores/timerStore.js";
import {useConfirm} from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import {useCustomizationStore} from "@/stores/customizationStore.js";

const tournamentInfoStore = useTournamentInfoStore();
const entriesStore = useEntriesStore()
const timerStore = useTimerStore()
const customizationStore = useCustomizationStore()

const confirm = useConfirm()
const toast = useToast();

const details = "Tournament Details";
const timerStatus = "Timer Status";
const liveActions = "Live Actions";
const customization = "Customization";

const exportableData = ref([
  {name: details, key: "TD"},
  {name: liveActions, key: "LA"},
  {name: timerStatus, key: "TS"},
  {name: customization, key: "CZ"}
]);

const selectedExportableData = ref([details, liveActions, timerStatus, customization]);

const fileInput = ref(null);

function exportTournamentDetails() {
  const tournamentDetails = {
    tournamentDetails: {
      ...selectedExportableData.value.includes(details) ? tournamentInfoStore.$state : {}
    },
    liveActions: {
      ...selectedExportableData.value.includes(liveActions) ? entriesStore.$state : {}
    },
    timerStatus: {
      ...selectedExportableData.value.includes(timerStatus) ? timerStore.$state : {}
    },
    theme: {
      ...selectedExportableData.value.includes(customization) ? customizationStore.$state : {}
    }
  }
  const json = JSON.stringify(tournamentDetails, null, 2)
  const blob = new Blob([json], {type: 'application/json'})
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  const prefix = tournamentInfoStore.tournamentSeries ? `${tournamentInfoStore.tournamentSeries}-` : ''
  a.download = `${prefix}${tournamentInfoStore.tournamentName}-tournament-details.json`.replace(/ /g, '_')
  a.click()

  URL.revokeObjectURL(url)

  toast.add({ severity: 'success', summary: 'Configuration exported successfully', detail: `Downloaded file ${a.download}`, life: 5000 });
}

function importTournamentDetails(event) {
  const file = event.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      const data = JSON.parse(fileContent);
      if (selectedExportableData.value.includes(details)) {
        tournamentInfoStore.$patch(data?.tournamentDetails);
      }
      if (selectedExportableData.value.includes(liveActions)) {
        entriesStore.$patch(data?.liveActions);
      }
      if (selectedExportableData.value.includes(timerStatus)) {
        timerStore.$patch(data?.timerStatus);
      }
      if (selectedExportableData.value.includes(customization)) {
        customizationStore.$patch(data?.theme);
      }
    }

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    reader.readAsText(file);
    toast.add({ severity: 'success', summary: 'Configuration imported successfully', detail: `Loaded content from ${file.name}`, life: 5000 });
  }
}

function openFilePicker() {
  fileInput.value.choose()
}

function resetEntries() {
  confirm.require({
    message: 'This will clear all registered actions on the tournament. Do you want to proceed?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    accept: () => {
      entriesStore.resetStore()
      timerStore.resetStore()
      toast.add({ severity: 'success', summary: 'Tournament Restarted', detail: `Tournament state successfully restarted`, life: 5000 });
    }
  });
}

</script>

<template>
  <FileUpload
      ref="fileInput"
      mode="basic"
      @select="importTournamentDetails"
      customUpload
      auto
      accept="application/json"
      style="display: none"
  />
  <div class="flex flex-column gap-5">
    <div class="card flex justify-center">
      <div class="flex flex-column gap-4">
        <div v-for="data of exportableData" :key="data.key" class="flex items-center gap-2">
          <Checkbox v-model="selectedExportableData" :inputId="data.key" name="category" :value="data.name"/>
          <label :for="data.key">{{ data.name }}</label>
        </div>
      </div>
    </div>
    <div class="actions flex gap-2">
      <Button label="Export" icon="pi pi-download" severity="info" @click="exportTournamentDetails" class="action" raised/>
      <Button label="Import" icon="pi pi-upload" severity="primary" @click="openFilePicker" class="action" raised/>
    </div>
    <div class="danger section">
      <Button label="Restart Tournament" icon="pi pi-history" @click="resetEntries()" severity="danger"/>
    </div>
  </div>

</template>

<style scoped lang="sass">
.danger
  position: relative
  text-align: center
  margin-top: 3em
</style>