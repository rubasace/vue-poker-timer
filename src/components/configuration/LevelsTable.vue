<script setup>

import {useTournamentInfoStore} from "@/stores/tournamentInfo.js";

const tournamentInfoStore = useTournamentInfoStore();


const addLevel = () => {
  const bigBlind = guessBigBlind();
  tournamentInfoStore.levels.push({
    id: Date.now(), // Unique ID for tracking in DataTable
    smallBlind: Math.max(100, bigBlind / 2),
    bigBlind: bigBlind,
    ante: bigBlind,
    minutes: guessMinutes(),
  });

};

const guessBigBlind = () => {
  console.log(tournamentInfoStore.lastLevel)
  if (tournamentInfoStore.levels.length === 0) {
    return 100;
  }
  const lastBigBlind = tournamentInfoStore.lastLevel.bigBlind;

  if (lastBigBlind < 600) {
    return lastBigBlind + 100;
  }
  if (lastBigBlind < 2000) {
    return lastBigBlind + 200;
  }
  if (lastBigBlind < 3000) {
    return lastBigBlind + 500
  }

  if (lastBigBlind < 6000) {
    return lastBigBlind + 1000
  }
  if (lastBigBlind < 10000) {
    return lastBigBlind + 2000
  }
  if (lastBigBlind < 40000) {
    return lastBigBlind + 5000
  }
  return lastBigBlind + 10000
}

const guessMinutes = () => {
  if (tournamentInfoStore.levels.length === 0) {
    return 30;
  } else {
    return tournamentInfoStore.lastLevel.minutes;
  }
}

const addBreak = () => {
  tournamentInfoStore.levels.push({
    id: Date.now(), // Unique ID for tracking in DataTable
    minutes: 20,
    break: true
  });
};

const onCellEditComplete = (event) => {
  let {data, newValue, field} = event;

  data[field] = newValue;
};

const deleteLevel = (rowData) => {
  // console.log(JSON.stringify(rowData))
  //TODO investigate why it doesn't seem to delete the desired one when not logging
  const index = tournamentInfoStore.levels.findIndex(level => level.id === rowData.id);
  if (index !== -1) {
    tournamentInfoStore.levels.splice(index, 1);
  }
};

const reorderLevels = (event) => {
  tournamentInfoStore.levels = event.value;
};

</script>

<template>
  <DataTable :value="tournamentInfoStore.levels"
             @cell-edit-complete="onCellEditComplete"
             @rowReorder="reorderLevels"
             editMode="cell"
             showGridlines stripedRows
             :reorderableColumns="true"
             dataKey="id">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="table-title">Blinds Structure</span>
      </div>
    </template>
    <Column rowReorder headerStyle="width: 3rem" :reorderableColumn="false"/>
    <Column field="smallBlind" header="Small Blind" editor="true">
      <template #editor="{ data }">
        <InputNumber v-model="data.smallBlind" min="0"/>
      </template>
    </Column>
    <Column field="bigBlind" header="Big Blind" editor="true">
      <template #editor="{ data }">
        <InputNumber v-model="data.bigBlind" min="0"/>
      </template>
    </Column>

    <Column field="ante" header="Ante" editor="true">
      <template #editor="{ data }">
        <InputNumber v-model="data.ante" min="0"/>
      </template>
    </Column>

    <Column field="minutes" header="Duration (min)" editor="true">
      <template #editor="{ data }">
        <InputNumber v-model="data.minutes" min="0"/>
      </template>
    </Column>

    <Column field="break" header="Break?"/>

    <Column class="w-24 !text-end">
      <template #body="{ data }">
        <Button icon="pi pi-trash" @click="deleteLevel(data)" severity="secondary" rounded/>
      </template>
    </Column>
  </DataTable>

  <div class="tableActions">
    <Button label="Add Level" icon="pi pi-plus" @click="addLevel" class="action"/>
    <Button label="Add break" severity="secondary" icon="pi pi-plus" @click="addBreak" class="action"/>
  </div>
</template>

<style scoped lang="sass">
.table-title
  font-size: 1.2em
  font-weight: bold
  text-align: center
  width: 100%

.tableActions
  margin-top: 1.3em
.action
  margin-right: 1em
  font-size: 0.9em
</style>