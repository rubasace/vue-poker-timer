<script setup>
import Stat from "@/components/Stat.vue";
import {useEntriesStore} from "@/stores/playerActions.js";
import {useTournamentInfoStore} from "@/stores/tournamentInfo.js";
const entriesStore = useEntriesStore();
const tournamentInfoStore = useTournamentInfoStore();
</script>

<template>
  <div class="settings-form">
    <div class="details section">
      <Stat title="Entries" :value="entriesStore.entries.toLocaleString()"/>
      <Stat title="Reentries" :value="entriesStore.reentries.toLocaleString()"/>
      <Stat title="Addons" :value="entriesStore.addons.toLocaleString()"/>
      <Stat title="Double Addons" :value="entriesStore.doubleAddons.toLocaleString()"/>
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
      <Button label="Add Double Addon" icon="pi pi-arrow-up" @click="entriesStore.addDoubleAddon()" severity="info" icon-pos="top" iconClass="action-icon" rounded raised outlined  :disabled="!tournamentInfoStore.allowsDoubleAddon"/>
      <Button label="Remove Double Addon" icon="pi pi-arrow-down" @click="entriesStore.removeDoubleAddon()" severity="secondary" icon-pos="top" iconClass="action-icon" rounded raised outlined :disabled="!tournamentInfoStore.allowsDoubleAddon"/>
    </div>
    <div class="danger section">
      <Button label="Reset" icon="pi pi-times" @click="entriesStore.resetStore()" severity="danger"/>
    </div>
  </div>
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
    position: absolute
    bottom: 0
    right: 5%
    font-size: 0.6em
</style>