<script setup>
import Stat from "@/components/Stat.vue";
import {useConfirm} from "primevue/useconfirm";
import {useEntriesStore} from "@/stores/playerActions.js";
import {useTournamentInfoStore} from "@/stores/tournamentInfo.js";

const confirm = useConfirm();
const entriesStore = useEntriesStore();
const tournamentInfoStore = useTournamentInfoStore();

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
    }
  });
}
</script>

<template>
  <div class="settings-form">
    <div class="details section">
      <Stat title="Entries" :value="entriesStore.entries.toLocaleString()"/>
      <Stat title="Reentries" :value="entriesStore.reentries.toLocaleString()"/>
      <Stat title="Addons" :value="entriesStore.addons.toLocaleString()"/>
      <Stat title="Double Addons" :value="entriesStore.doubleAddons.toLocaleString()"/>
      <Stat title="KO's" :value="entriesStore.kos.toLocaleString()"/>
      <Stat title="Remaining Players" :value="entriesStore.remainingPlayers.toLocaleString()+'/'+entriesStore.entries.toLocaleString()"/>
    </div>
    <div class="actions section">
      <Button label="Register Player" icon="pi pi-user-plus" @click="entriesStore.registerPlayer" severity="primary" icon-pos="top" iconClass="action-icon" rounded raised outlined/>
      <Button label="Unregister Player" icon="pi pi-user-minus" @click="entriesStore.unRegisterPlayer()" severity="secondary" icon-pos="top" iconClass="action-icon" rounded raised outlined/>
      <Button label="Eliminate Player" icon="pi pi-times" @click="entriesStore.eliminatePlayer" severity="danger" icon-pos="top" iconClass="action-icon" rounded raised outlined/>
      <Button label="Undo Elimination" icon="pi pi-history" @click="entriesStore.undoElimination" severity="secondary" icon-pos="top" iconClass="action-icon" rounded raised outlined/>
      <Button label="Add Reentry" icon="pi pi-refresh" @click="entriesStore.addReentry" severity="info" icon-pos="top" iconClass="action-icon" rounded raised outlined :disabled="!tournamentInfoStore.reentryEnabled"/>
      <Button label="Remove Reentry" icon="pi pi-replay" @click="entriesStore.removeReentry" severity="secondary" icon-pos="top" iconClass="action-icon" rounded raised outlined :disabled="!tournamentInfoStore.reentryEnabled"/>
      <Button label="Add Addon" icon="pi pi-arrow-up" @click="entriesStore.addAddon" severity="info" icon-pos="top" iconClass="action-icon" rounded raised outlined :disabled="!tournamentInfoStore.addonEnabled"/>
      <Button label="Remove Addon" icon="pi pi-arrow-down" @click="entriesStore.removeAddon" severity="secondary" icon-pos="top" iconClass="action-icon" rounded raised outlined :disabled="!tournamentInfoStore.addonEnabled"/>
      <Button label="Add Double Addon" icon="pi pi-arrow-up" @click="entriesStore.addDoubleAddon()" severity="info" icon-pos="top" iconClass="action-icon" rounded raised outlined  :disabled="!tournamentInfoStore.doubleAddonEnabled"/>
      <Button label="Remove Double Addon" icon="pi pi-arrow-down" @click="entriesStore.removeDoubleAddon()" severity="secondary" icon-pos="top" iconClass="action-icon" rounded raised outlined :disabled="!tournamentInfoStore.doubleAddonEnabled"/>
    </div>
    <div class="danger section">
      <Button label="Restart Tournament" icon="pi pi-times" @click="resetEntries()" severity="danger"/>
    </div>
  </div>
  <ConfirmDialog/>
</template>

<style scoped lang="sass">
.settings-form
  .section
    display: flex
    flex-wrap: wrap
    flex-direction: row
    justify-content: space-evenly
    align-content: space-around
    margin-bottom: 5em
    gap: 10px

  //& > *
    //flex-basis: calc(22% - 10px)
    //max-width: calc(22% - 10px)

  //.details
  //  font-size: 0.85em
  .actions
    margin-left: 10%
    margin-right: 10%
    ::v-deep(.action-icon)
      font-size: 1.7em
  .danger
    position: relative
    //bottom: 0
    //right: 50%
    font-size: 0.6em
</style>