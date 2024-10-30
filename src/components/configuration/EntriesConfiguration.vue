<script setup>
import Stat from "@/components/Stat.vue";
import {useConfirm} from "primevue/useconfirm";
import {useEntriesStore} from "@/stores/entriesStore.js";
import {useTournamentInfoStore} from "@/stores/tournamentInfoStore.js";
import {useTimerStore} from "@/stores/timerStore.js";
import {computed} from "vue";

const confirm = useConfirm();
const entriesStore = useEntriesStore();
const timerStore = useTimerStore();
const tournamentInfoStore = useTournamentInfoStore();

const remainingPlayers = computed(() => {
  return entriesStore.remainingPlayers.toLocaleString() + ' / ' + entriesStore.entries.toLocaleString()
})

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
    }
  });
}
</script>

<template>
  <div class="settings-form">
    <div class="details section">
      <div class="section-item">
        <Stat title="Entries" :value="entriesStore.entries.toLocaleString()"/>
      </div>
      <div class="section-item">
        <Stat title="KO's" :value="entriesStore.kos.toLocaleString()"/>
      </div>
      <div class="section-item">
        <Stat title="Reentries" :value="entriesStore.reentries.toLocaleString()"/>
      </div>
      <div class="section-item">
        <Stat title="Addons" :value="entriesStore.addons.toLocaleString()"/>
      </div>
      <div class="section-item">
        <Stat title="Double Addons" :value="entriesStore.doubleAddons.toLocaleString()"/>
      </div>
      <div class="section-item">
        <Stat title="Players" :value="remainingPlayers"/>
      </div>
    </div>
    <div class="actions section">
      <div class="section-item">
        <Button label="Register Player" icon="pi pi-user-plus" @click="entriesStore.registerPlayer" severity="primary" icon-pos="top" iconClass="action-icon" rounded raised
                outlined/>
      </div>
      <div class="section-item">
        <Button label="Unregister Player" icon="pi pi-user-minus" @click="entriesStore.unRegisterPlayer()" severity="secondary" icon-pos="top" iconClass="action-icon" rounded
                raised outlined/>
      </div>
      <div class="section-item">
        <Button label="Eliminate Player" icon="pi pi-times" @click="entriesStore.eliminatePlayer" severity="danger" icon-pos="top" iconClass="action-icon" rounded raised outlined/>
      </div>
      <div class="section-item">
        <Button label="Undo Elimination" icon="pi pi-history" @click="entriesStore.undoElimination" severity="secondary" icon-pos="top" iconClass="action-icon" rounded raised
                outlined/>
      </div>
      <div class="section-item">
        <Button label="Add Reentry" icon="pi pi-refresh" @click="entriesStore.addReentry" severity="info" icon-pos="top" iconClass="action-icon" rounded raised outlined
                :disabled="!tournamentInfoStore.reentryEnabled"/>
      </div>
      <div class="section-item">
        <Button label="Remove Reentry" icon="pi pi-replay" @click="entriesStore.removeReentry" severity="secondary" icon-pos="top" iconClass="action-icon" rounded raised outlined
                :disabled="!tournamentInfoStore.reentryEnabled"/>
      </div>
      <div class="section-item">
        <Button label="Add Addon" icon="pi pi-arrow-up" @click="entriesStore.addAddon" severity="info" icon-pos="top" iconClass="action-icon" rounded raised outlined
                :disabled="!tournamentInfoStore.addonEnabled"/>
      </div>
      <div class="section-item">
        <Button label="Remove Addon" icon="pi pi-arrow-down" @click="entriesStore.removeAddon" severity="secondary" icon-pos="top" iconClass="action-icon" rounded raised outlined
                :disabled="!tournamentInfoStore.addonEnabled"/>
      </div>
      <div class="section-item">
        <Button label="Add Double Addon" icon="pi pi-arrow-up" @click="entriesStore.addDoubleAddon()" severity="info" icon-pos="top" iconClass="action-icon" rounded raised outlined
                :disabled="!tournamentInfoStore.doubleAddonEnabled"/>
      </div>
      <div class="section-item">
        <Button label="Remove Double Addon" icon="pi pi-arrow-down" @click="entriesStore.removeDoubleAddon()" severity="secondary" icon-pos="top" iconClass="action-icon" rounded
                raised outlined :disabled="!tournamentInfoStore.doubleAddonEnabled"/>
      </div>
    </div>
    <div class="danger section">
      <Button label="Restart Tournament" icon="pi pi-history" @click="resetEntries()" severity="danger"/>
    </div>
  </div>
</template>

<style scoped lang="sass">
.settings-form
  .section
    display: flex
    flex-wrap: wrap
    flex-direction: row
    justify-content: center
    align-content: center
    margin-bottom: 5em
    row-gap: 1em

    .section-item
      display: flex
      justify-content: center
      align-content: center

  .details
    justify-content: space-around

    .section-item
      width: 33%

      ::v-deep(.p-card-title)
        div
          font-size: 2em

  .actions
    .section-item
      width: 35%

      & > *
        width: 12em

    ::v-deep(.action-icon)
      font-size: 2.3em

  .danger
    position: relative

@media (max-width: 820px)
  .settings-form
    .details
      .section-item
        width: 45%

        ::v-deep(.p-card)
          font-size: 0.8em

    .actions
      .section-item
        width: 100%


</style>