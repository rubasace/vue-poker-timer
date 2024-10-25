<script setup lang="ts">

import Stat from "@/components/Stat.vue";
import ActionButton from "@/components/ActionButton.vue";
import {useEntriesStore} from "@/stores/playerActions";

const playerActionsStore = useEntriesStore();

</script>
<template>

  <div class="card">
    <Tabs value="0">
      <TabList>
        <Tab value="0">Actions</Tab>
        <Tab value="1">Tournament Structure</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <div class="settings-form">
            <div class="details section">
              <Stat title="Entries" :value="playerActionsStore.entries"/>
              <Stat title="Reentries" :value="playerActionsStore.reentries"/>
              <Stat title="Addons" :value="playerActionsStore.addons"/>
              <Stat title="Remaining Players" :value="playerActionsStore.remainingPlayers+'/'+playerActionsStore.entries"/>
            </div>
            <div class="actions section">
              <ActionButton title="Register Player" icon="pi-user-plus" @click="playerActionsStore.registerPlayer"/>
              <ActionButton title="Unregister Player" icon="pi-user-minus" @click="playerActionsStore.unRegisterPlayer()"/>
              <ActionButton title="Add Reentry" icon="pi-refresh" @click="playerActionsStore.addReentry"/>
              <ActionButton title="Remove Reentry" icon="pi-replay" @click="playerActionsStore.removeReentry"/>
              <ActionButton title="Add Addon" icon="pi-arrow-up" @click="playerActionsStore.addAddon"/>
              <ActionButton title="Remove Addon" icon="pi-arrow-down" @click="playerActionsStore.removeAddon"/>
              <ActionButton title="Eliminate Player" icon="pi-times" @click="playerActionsStore.eliminatePlayer"/>
              <ActionButton title="Undo Elimination" icon="pi-history" @click="playerActionsStore.undoElimination"/>
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
    width: 80%
    margin: 0 auto
    font-size: 0.8em
</style>