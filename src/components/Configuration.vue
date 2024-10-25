<script setup lang="ts">

import Stat from "@/components/Stat.vue";
import ActionButton from "@/components/ActionButton.vue";
import {useEntriesStore} from "@/stores/playerActions";

const entriesStore = useEntriesStore();

</script>
<template>

  <div class="card">
    <Tabs value="0">
      <TabList>
        <Tab value="0">Entries</Tab>
        <Tab value="1">Structure</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <div class="settings-form">
            <div class="details section">
              <Stat title="Entries" :value="entriesStore.entries"/>
              <Stat title="Reentries" :value="entriesStore.reentries"/>
              <Stat title="Addons" :value="entriesStore.addons"/>
              <Stat title="Remaining Players" :value="entriesStore.remainingPlayers+'/'+entriesStore.entries"/>
            </div>
            <div class="actions section">
              <ActionButton title="Register Player" icon="pi-user-plus" @click="entriesStore.registerPlayer"/>
              <ActionButton title="Unregister Player" icon="pi-user-minus" @click="entriesStore.unRegisterPlayer()"/>
              <ActionButton title="Add Reentry" icon="pi-refresh" @click="entriesStore.addReentry"/>
              <ActionButton title="Remove Reentry" icon="pi-replay" @click="entriesStore.removeReentry"/>
              <ActionButton title="Add Addon" icon="pi-arrow-up" @click="entriesStore.addAddon"/>
              <ActionButton title="Remove Addon" icon="pi-arrow-down" @click="entriesStore.removeAddon"/>
              <ActionButton title="Eliminate Player" icon="pi-times" @click="entriesStore.eliminatePlayer"/>
              <ActionButton title="Undo Elimination" icon="pi-history" @click="entriesStore.undoElimination"/>
            </div>
            <div class="danger section">
              <ActionButton title="Reset" icon="pi-times" @click="entriesStore.resetStore()"/>
            </div>
          </div>
        </TabPanel>
        <TabPanel value="1">
          Work in Progress
        </TabPanel>
      </TabPanels>
    </Tabs>
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

    & > *
      //flex-basis: calc(22% - 10px)
      //max-width: calc(22% - 10px)

  .actions
    margin-left: 10%
    margin-right: 10%
    font-size: 0.8em
  .danger
    position: absolute
    bottom: 0
    right: 10%
    font-size: 0.6em
</style>