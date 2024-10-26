<script setup>
import {useTournamentInfoStore} from "@/stores/tournamentInfo.js";
import LevelsTable from "@/components/configuration/LevelsTable.vue";

const tournamentInfoStore = useTournamentInfoStore();

  const currencies = [
    { name: 'Euro', code: 'EUR', symbol: '€' },
    { name: 'US Dollar', code: 'USD', symbol: '$' },
    { name: 'British Pound', code: 'GBP', symbol: '£' },
    { name: 'Japanese Yen', code: 'JPY', symbol: '¥' },
    { name: 'Australian Dollar', code: 'AUD', symbol: '$' },
  ];

</script>

<template>
  <div class="p-field">
    <label for="tournamentSeries">Tournament Series</label>
    <InputText v-model="tournamentInfoStore.tournamentSeries" id="tournamentSeries"/>
  </div>

  <div class="p-field">
    <label for="tournamentName">Tournament Name</label>
    <InputText v-model="tournamentInfoStore.tournamentName" id="tournamentName"/>
  </div>

  <div class="p-field">
    <label for="currency">Currency</label>
    <Select
        filter
        v-model="tournamentInfoStore.currency"
        id="currency"
        :options="currencies"
        option-label="name"
        placeholder="Select a currency"
    />
  </div>

  <div class="p-field">
    <label for="initialStack">Initial Stack</label>
    <InputNumber v-model="tournamentInfoStore.initialStack" id="initialStack" :min="0"/>
  </div>

  <div class="p-field">
    <label for="addonStack">Addon Stack</label>
    <InputNumber v-model="tournamentInfoStore.addonStack" id="addonStack" :min="0"/>
  </div>

  <div class="p-field">
    <label for="entryFee">Entry Fee</label>
    <InputNumber v-model="tournamentInfoStore.entryFee" id="entryFee" :min="0" :currency="tournamentInfoStore.currency?.code" mode="currency"/>
  </div>

  <div class="p-field">
    <label for="reentryFee">Reentry Fee</label>
    <InputNumber v-model="tournamentInfoStore.reentryFee" id="reentryFee" :min="0" :currency="tournamentInfoStore.currency?.code" mode="currency"/>
  </div>

  <div class="p-field">
    <label for="addonFee">Addon Fee</label>
    <InputNumber v-model="tournamentInfoStore.addonFee" id="addonFee" :min="0" :currency="tournamentInfoStore.currency?.code" mode="currency"/>
  </div>

  <div class="p-field">
    <label for="addedPrize">Added Prize</label>
    <InputNumber v-model="tournamentInfoStore.addedPrize" id="addedPrize" :min="0" :currency="tournamentInfoStore.currency?.code" mode="currency"/>
  </div>

  <LevelsTable/>

<!--  TODO allow to cancel/save by binding to intermediary in-memory model -->
<!--  <div class="actions">-->
<!--    <Button label="Save" @click="saveConfiguration" class="button p-button-success"/>-->
<!--    <Button label="Save" @click="saveConfiguration" class="button p-button-success"/>-->
<!--  </div>-->
</template>

<style scoped lang="sass">
.p-field
  margin-bottom: 1em
  display: grid
  grid-template-columns: 1fr 3fr
  grid-column-gap: 1em
.actions
  position: absolute
  bottom: 0
  right: 0
  margin: 2em
  .button
    font-size: 1.2em
    margin-left: 1em

</style>