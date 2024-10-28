<script setup>
import {useTournamentInfoStore} from "@/stores/tournamentInfo.js";
import TournamentStructureConfiguration from "@/components/configuration/TournamentStructureConfiguration.vue";
import {ref} from "vue";

const tournamentInfoStore = useTournamentInfoStore();

const addonEnabled = ref(true)

const currencies = [
  {name: 'Euro', code: 'EUR', symbol: '€'},
  {name: 'US Dollar', code: 'USD', symbol: '$'},
  {name: 'British Pound', code: 'GBP', symbol: '£'},
  {name: 'Japanese Yen', code: 'JPY', symbol: '¥'},
  {name: 'Australian Dollar', code: 'AUD', symbol: '$'},
];
</script>

<template>
  <div class="form-container">
    <div class="section-title">General Info</div>
    <div class="p-field">
      <label for="tournamentSeries">Tournament Series*</label>
      <InputText v-model="tournamentInfoStore.tournamentSeries" id="tournamentSeries"/>
    </div>

    <div class="p-field">
      <label for="tournamentName">Tournament Name</label>
      <InputText v-model="tournamentInfoStore.tournamentName" id="tournamentName"/>
    </div>

    <div class="p-field">
      <label for="currency">Currency*</label>
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
      <label for="tournamentName">Estimated Duration (h)</label>
      <InputText v-model="tournamentInfoStore.estimatedDurationHours" id="estimatedDurationHours"/>
    </div>

    <div class="section-title">Prizes</div>

    <div class="p-field">
      <label for="guaranteedPrize">Guaranteed Prize</label>
      <InputNumber v-model="tournamentInfoStore.guaranteedPrize" id="guaranteedPrize" :min="0" :currency="tournamentInfoStore.currency?.code" mode="currency"/>
    </div>

    <div class="p-field">
      <label for="addedPrize">Added Prize</label>
      <InputNumber v-model="tournamentInfoStore.addedPrize" id="addedPrize" :min="0" :currency="tournamentInfoStore.currency?.code" mode="currency"/>
    </div>

    <div class="section-title">Buy-In Info</div>

    <div class="p-field">
      <label for="entryFee">Entry Fee*</label>
      <InputNumber v-model="tournamentInfoStore.entryFee" id="entryFee" :min="0" :currency="tournamentInfoStore.currency?.code" mode="currency"/>
    </div>

    <div class="p-field">
      <label for="entryFee">Entry Rake*</label>
      <InputNumber v-model="tournamentInfoStore.entryRake" id="entryRake" :min="0" :currency="tournamentInfoStore.currency?.code" mode="currency"/>
    </div>

    <div class="p-field">
      <label for="initialStack">Initial Stack*</label>
      <InputNumber v-model="tournamentInfoStore.initialStack" id="initialStack" :min="0"/>
    </div>

    <div class="section-title">Reentry</div>
    <div class="p-field">
      <label for="reentryEnabled">Enable Reentry</label>
      <Checkbox v-model="tournamentInfoStore.reentryEnabled" id="reentryEnabled" binary/>
    </div>
    <div/>

    <div class="p-field">
      <label for="reentryFee">Reentry Fee</label>
      <InputNumber v-model="tournamentInfoStore.reentryFee" id="reentryFee" :min="0" :currency="tournamentInfoStore.currency?.code" mode="currency" :disabled="!tournamentInfoStore.reentryEnabled"/>
    </div>

    <div class="p-field">
      <label for="reentryFee">Reentry Rake</label>
      <InputNumber v-model="tournamentInfoStore.reentryRake" id="reentryRake" :min="0" :currency="tournamentInfoStore.currency?.code" mode="currency" :disabled="!tournamentInfoStore.reentryEnabled"/>
    </div>

    <div class="p-field">
      <label for="maxReentries">Max Reentries</label>
      <InputNumber v-model="tournamentInfoStore.maxReentries" id="maxReentries" :min="0" :disabled="!tournamentInfoStore.reentryEnabled"/>
    </div>

    <div class="section-title">Addon</div>
    <div class="p-field">
      <label for="addonEnabled">Enable Addon</label>
      <Checkbox v-model="tournamentInfoStore.addonEnabled" id="addonEnabled" binary/>
    </div>

    <div class="p-field">
      <label for="addonEnabled">Enable Double Addon</label>
      <Checkbox v-model="tournamentInfoStore.doubleAddonEnabled" id="doubleAddonEnabled" :disabled="!tournamentInfoStore.addonEnabled" binary/>
    </div>

    <div class="p-field">
      <label for="addonFee">Addon Fee</label>
      <InputNumber v-model="tournamentInfoStore.addonFee" id="addonFee" :min="0" :currency="tournamentInfoStore.currency?.code" mode="currency" :disabled="!tournamentInfoStore.addonEnabled"/>
    </div>

    <div class="p-field">
      <label for="addonFee">Addon Rake</label>
      <InputNumber v-model="tournamentInfoStore.addonRake" id="addonRake" :min="0" :currency="tournamentInfoStore.currency?.code" mode="currency" :disabled="!tournamentInfoStore.addonEnabled"/>
    </div>

    <div class="p-field">
      <label for="addonStack">Addon Stack</label>
      <InputNumber v-model="tournamentInfoStore.addonStack" id="addonStack" :min="0" :disabled="!tournamentInfoStore.addonEnabled"/>
    </div>

  </div>

  <div class="structure">
    <TournamentStructureConfiguration/>
  </div>
</template>

<style scoped lang="sass">
.form-container
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 1em

.p-field
  display: flex
  flex-direction: column

.section-title
  grid-column: span 2
  font-weight: bold
  font-size: 1.2em
  margin-top: 1em

.structure
  margin-top: 2em
</style>