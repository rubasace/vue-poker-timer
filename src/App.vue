<script setup>
import {computed, nextTick, onBeforeUnmount, onMounted, ref} from "vue";
import BlindsInfo from "@/components/BlindsInfo.vue";
import Clock from "@/components/Clock.vue";
import TitleValue from "@/components/TitleValue.vue";
import Configuration from "@/components/configuration/Configuration.vue";
import Dialog from "primevue/dialog";
import {useEntriesStore} from "@/stores/playerActions";
import {useTimerStore} from "@/stores/timerState.js";
import {useTournamentInfoStore} from "@/stores/tournamentInfo.js";
import {formatClockValue} from "@/util/formatUtils.js";

const entriesStore = useEntriesStore();
const timerStore = useTimerStore();
const tournamentInfoStore = useTournamentInfoStore();

const showDialog = ref(false);


const currentBlinds = computed(() => tournamentInfoStore.currentLevel ? `${tournamentInfoStore.currentLevel.smallBlind}/${tournamentInfoStore.currentLevel.bigBlind}/${tournamentInfoStore.currentLevel.ante}`: '0/0/0');
const smallBlind = computed(() => normalizeBetAmount(currentBlinds.value.split('/')[0], tournamentInfoStore.currentLevel.bigBlind));
const bigBlind = computed(() => normalizeBetAmount(currentBlinds.value.split('/')[1]));
const ante = computed(() => normalizeBetAmount(currentBlinds.value.split('/')[2]));

const nextBlinds = computed(() => {
  if(!tournamentInfoStore.nextLevel){
    return 'NONE';
  }
  return `${normalizeBetAmount(tournamentInfoStore.nextLevel.smallBlind, tournamentInfoStore.nextLevel.bigBlind)} / ${normalizeBetAmount(tournamentInfoStore.nextLevel.bigBlind)}(${normalizeBetAmount(tournamentInfoStore.nextLevel.ante)})`;
});
const totalStack = computed(() => {
  return tournamentInfoStore.initialStack * (entriesStore.entries + entriesStore.reentries) + entriesStore.addons * tournamentInfoStore.addonStack;
});
const totalPrizePool = computed(() => {
  return (
      entriesStore.entries * tournamentInfoStore.entryFee +
      entriesStore.reentries * tournamentInfoStore.reentryFee +
      entriesStore.addons * tournamentInfoStore.addonFee +
      tournamentInfoStore.addedPrize
  );
});
const avgStack = computed(() => {
  if (entriesStore.remainingPlayers === 0) {
    return 0;
  }
  let avg = Math.round(totalStack.value / entriesStore.remainingPlayers);
  if (avg >= 1000000) return (avg / 1000000).toFixed(1) + "M";
  if (avg >= 100000) return (avg / 1000).toFixed(1) + "K";
  return avg;
});

const nextBreak = computed(() => {
  if(!tournamentInfoStore.nextLevelSecondsUntilBreak){
    return 'NONE';
  }
  return formatClockValue(tournamentInfoStore.nextLevelSecondsUntilBreak)
});

const normalizeBetAmount = (amount, bigBlind) => {
  const value = parseFloat(amount);
  const bigBlindValue = bigBlind ? parseFloat(bigBlind) : parseFloat(value);
  if(bigBlindValue > 5000 && value > 1000){
    if(value % 1000 === 0){
      return (value / 1000).toFixed(0) + "K";
    }
    return (value / 1000).toFixed(1) + "K";
  }
  if(value > 1000000){
    if(value % 1000000 === 0){
      return (value / 1000000).toFixed(0) + "M";
    }
    return (value / 1000000).toFixed(1) + "M";
  }
  return value
};

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
      <TitleValue title="Prize pool" :value="totalPrizePool+tournamentInfoStore.currency.symbol"/>
      <TitleValue title="Payouts" value=""/>
      <TitleValue title="Reentries" :value="entriesStore.reentries"/>
      <TitleValue title="Addons" :value="entriesStore.addons"/>
    </div>
    <div class="central-panel">
      <div class="header">
        <div class="series secondary" v-if="tournamentInfoStore.tournamentSeries">{{ tournamentInfoStore.tournamentSeries }}</div>
        <div class="tournament primary">{{ tournamentInfoStore.tournamentName }}</div>
      </div>
      <div class="timer">
        <Clock class="clock" ref="clock"/>
      </div>
      <div class="current-level" v-if="!tournamentInfoStore.currentLevel.break">
        <BlindsInfo text="blinds" :value="`${smallBlind}/${bigBlind}`"/>
        <BlindsInfo text="ante" :value="ante"/>
        <BlindsInfo text="Next Level" :value="nextBlinds"/>
      </div>
      <div class="break" v-else>
        <BlindsInfo text="Next Level" :value="nextBlinds"/>
        <span>BREAK</span>
      </div>
    </div>
    <div class="aside right-panel">
      <TitleValue title="Players" :value="entriesStore.remainingPlayers + '/' + entriesStore.entries"/>
      <TitleValue title="Level" :value="timerStore.levelIndex + 1"/>
      <TitleValue title="Avg Stack" :value="avgStack.toLocaleString()"/>
      <TitleValue title="Next Break" :value="nextBreak"/>
    </div>
  </main>
  <Dialog class="dialog" v-model:visible="showDialog" modal header="Settings" style="width: 85%;max-width: 1000px;height: 100%">
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

    .break
      width: 100%
      text-align: center
      span
        color: $secondary-color
        font-size: 2.8em

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
