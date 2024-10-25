<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { storeToRefs } from 'pinia'
import BlindsInfo from "@/components/BlindsInfo.vue";
import Clock from "@/components/Clock.vue";
import TitleValue from "@/components/TitleValue.vue";
import Configuration from "@/components/Configuration.vue";
import Dialog from "primevue/dialog";
import { useEntriesStore } from "@/stores/playerActions";

const entriesStore = useEntriesStore();

// Reactive data properties
const tournamentSeries = ref("Marcosfa Poker Tour");
const tournamentName = ref("#2");
const currency = ref("€");
const levelIndex = ref(0);
const initialStack = ref(25000);
const addonStack = ref(10000);
const entryFee = ref(0);
const reentryFee = ref(5);
const addonFee = ref(5);
const addedPrize = ref(20);
const minutes = ref(15);
const blinds = ref(['20/40/40', '30/60/60', '40/80/80', '50/100/100', '60/120/120', '80/160/160', '100/200/200']);
const breaks = ref(['15/6', '15/12', '15/18', '15/24', '15/30']);
const showDialog = ref(false);

// Computed properties
const currentBlinds = computed(() => blinds.value[levelIndex.value]);
const smallBlind = computed(() => currentBlinds.value.split('/')[0]);
const bigBlind = computed(() => currentBlinds.value.split('/')[1]);
const ante = computed(() => currentBlinds.value.split('/')[2]);
const nextBlinds = computed(() => {
  const parts = blinds.value[levelIndex.value + 1]?.split('/') || [];
  return `${parts[0]}/${parts[1]}(${parts[2]})`;
});
const totalStack = computed(() => {
  return initialStack.value * (entriesStore.entries + entriesStore.reentries) + entriesStore.addons * addonStack.value;
});
const totalPrizePool = computed(() => {
  console.log('entries:', entriesStore.entries);
  console.log('reentries:', entriesStore.reentries);
  console.log('addons:', entriesStore.addons);
  console.log('entryFee:', entryFee.value);
  console.log('reentryFee:', reentryFee.value);
  console.log('addonFee:', addonFee.value);
  console.log('addedPrize:', addedPrize.value);

  return (
      entriesStore.entries * entryFee.value +
      entriesStore.reentries * reentryFee.value +
      entriesStore.addons * addonFee.value +
      addedPrize.value
  );
});
const avgStack = computed(() => {
  if (entriesStore.remainingPlayers === 0) return 0;
  let avg = Math.round(totalStack.value / entriesStore.remainingPlayers);
  if (avg >= 1000000) return (avg / 1000000).toFixed(1) + "M";
  if (avg >= 100000) return (avg / 1000).toFixed(1) + "K";
  return avg;
});

// Methods
function reduceLevel() {
  levelIndex.value--;
  if (levelIndex.value < 0) nextTick(() => (levelIndex.value = 0));
}

function incrementLevel() {
  levelIndex.value++;
}

// Cursor reset logic
let cursorTimer;
function resetCursorTimer() {
  clearTimeout(cursorTimer);
  document.body.style.cursor = "unset";
  cursorTimer = setTimeout(() => {
    if (!showDialog.value) document.body.style.cursor = "none";
  }, 5000);
}

// Lifecycle hooks
onMounted(() => {
  resetCursorTimer();
  document.body.addEventListener("mousemove", resetCursorTimer);
});

onBeforeUnmount(() => {
  clearTimeout(cursorTimer);
  document.body.removeEventListener("mousemove", resetCursorTimer);
});
</script>

<template>
  <main @mousemove="resetCursorTimer">
    <div class="aside left-panel">
      <TitleValue title="Prize pool" :value="totalPrizePool+currency"/>
      <TitleValue title="Payouts" value=""/>
      <TitleValue title="Reentries" :value="entriesStore.reentries"/>
      <TitleValue title="Addons" :value="entriesStore.addons"/>
    </div>
    <div class="central-panel">
      <div class="header">
        <div class="series secondary" v-if="tournamentSeries">{{ tournamentSeries }}</div>
        <div class="tournament primary">{{ tournamentName }}</div>
      </div>
      <div class="timer">
        <Clock class="clock" ref="clock" :minutes="minutes" :key="levelIndex" @finished="incrementLevel()" @previous="reduceLevel()" @next="incrementLevel()"/>
      </div>
      <div class="current-level">
        <BlindsInfo text="blinds" :value="`${smallBlind}/${bigBlind}`"/>
        <BlindsInfo text="ante" :value="ante"/>
        <BlindsInfo text="Next Level" :value="nextBlinds"/>
      </div>
    </div>
    <div class="aside right-panel">
      <TitleValue title="Players" :value="entriesStore.remainingPlayers + '/' + entriesStore.entries"/>
      <TitleValue title="Level" :value="levelIndex + 1"/>
      <TitleValue title="Avg Stack" :value="avgStack.toLocaleString()"/>
    </div>
  </main>
  <Dialog class="dialog" v-model:visible="showDialog" modal header="Settings" style="width: 66%;max-width: 1000px;height: 100%">
    <Configuration/>
  </Dialog>
  <i class="pi pi-cog settings-button" @click="showDialog = true"/>
</template>

<style lang="sass" scoped>
$primary-color: #0b5404
//$secondary-color: #d46f00
$secondary-color: #d46f00
main
  width: 100%
  height: 90vh
  display: grid
  margin: auto 0
  user-select: none
  grid-template-columns: 2fr 3.8fr 2fr
  grid-column-gap: 0
  text-transform: uppercase
  font-size: 2rem
  font-weight: bold

  .aside
    padding: 0
    display: flex
    flex-direction: column
    align-items: center
    justify-content: space-around
    font-size: 1em

  .central-panel
    font-size: 1.3em
    display: grid
    grid-template-rows: 1fr 3fr 2fr
    min-width: 420px
    max-width: 1000px

    .header
      text-align: center
      font-size: 0.85em
      line-height: 1.4em

      .tournament
        font-size: 2em

    .timer
      position: relative
      text-align: center
      padding: 0 0.3em
      width: 100%
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      text-transform: uppercase
      font-size: 1em

      $border: 4px solid $primary-color
      $separation: -0.3em

      &::before, &::after
        content: ''
        position: absolute
        height: 65%

      &::before
        left: $separation
        border-left: $border

      &::after
        right: $separation
        border-right: $border

      .clock
        font-size: 3em
        height: 30%

    .current-level
      font-size: 1.5em
      width: 100%
      text-align: center

.primary, :deep(.primary)
  color: $primary-color

.secondary, :deep(.secondary)
  color: $secondary-color

.settings-button
  position: absolute
  top: 25px
  right: 25px
  font-size: 2em
  &:hover
    cursor: pointer
    color: $primary-color

//margin-top: 140px
@media (max-width: 1024px)
  main
    font-size: 1rem

    .central-panel
      min-width: 200px

@media (min-width: 1440px)
  main
    font-size: 2.3rem

    .central-panel
      font-size: 1.8em


</style>
