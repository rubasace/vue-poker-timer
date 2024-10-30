<script setup>
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import BlindsInfo from "@/components/BlindsInfo.vue";
import Clock from "@/components/Clock.vue";
import TitleValue from "@/components/TitleValue.vue";
import Configuration from "@/components/configuration/Configuration.vue";
import Dialog from "primevue/dialog";
import {useEntriesStore} from "@/stores/entriesStore.js";
import {useTimerStore} from "@/stores/timerStore.js";
import {useTournamentInfoStore} from "@/stores/tournamentInfoStore.js";
import {formatClockValue} from "@/util/formatUtils.js";
import {useConfirm} from "primevue/useconfirm";
import {useMouse} from '@vueuse/core'
import {useKeyboardShortcuts} from "@/composables/useKeyboardShortcuts.js";
import InlineInfo from "@/components/InlineInfo.vue";

const confirm = useConfirm();
const {x, y} = useMouse()
useKeyboardShortcuts()


const entriesStore = useEntriesStore();
const timerStore = useTimerStore();
const tournamentInfoStore = useTournamentInfoStore();

const showDialog = ref(false);
const showSettingsBar = ref(true); // Reactive variable to control the settings bar visibility

//TODO show minutes of next level

const currentBlinds = computed(() => tournamentInfoStore.currentLevel ? `${tournamentInfoStore.currentLevel.smallBlind}/${tournamentInfoStore.currentLevel.bigBlind}/${tournamentInfoStore.currentLevel.ante}` : '0/0/0');
const smallBlind = computed(() => normalizeBetAmount(currentBlinds.value.split('/')[0], tournamentInfoStore.currentLevel?.bigBlind));
const bigBlind = computed(() => normalizeBetAmount(currentBlinds.value.split('/')[1]));
const ante = computed(() => normalizeBetAmount(currentBlinds.value.split('/')[2]));

const nextBlinds = computed(() => {
  if (!tournamentInfoStore.nextLevel) {
    return 'NONE';
  }
  return `${normalizeBetAmount(tournamentInfoStore.nextLevel.smallBlind, tournamentInfoStore.nextLevel.bigBlind)}/${normalizeBetAmount(tournamentInfoStore.nextLevel.bigBlind)} (${normalizeBetAmount(tournamentInfoStore.nextLevel.ante)})`;
});
const totalChipsInGame = computed(() => {
  return tournamentInfoStore.initialStack * (entriesStore.entries + entriesStore.reentries) + entriesStore.addons * tournamentInfoStore.addonStack + entriesStore.doubleAddons * tournamentInfoStore.addonStack * 2;
});
const totalPrizePool = computed(() => {
  const collectedPrizePool =
      (entriesStore.entries * tournamentInfoStore.entryFee) +
      (entriesStore.reentries * tournamentInfoStore.reentryFee) +
      (entriesStore.addons * tournamentInfoStore.addonFee) +
      (entriesStore.doubleAddons * tournamentInfoStore.addonFee * 2) +
      tournamentInfoStore.addedPrize;
  return Math.max(
      collectedPrizePool,
      tournamentInfoStore.guaranteedPrize
  ).toLocaleString();
});

const avgStack = computed(() => {
  if (entriesStore.remainingPlayers === 0) {
    return 0;
  }
  let avg = Math.round(totalChipsInGame.value / entriesStore.remainingPlayers);
  if (avg >= 1000000) return (avg / 1000000).toFixed(1) + "M";
  if (avg >= 100000) return (avg / 1000).toFixed(1) + "K";
  return avg;
});

const nextBreak = computed(() => {
  if (!tournamentInfoStore.nextLevelSecondsUntilBreak) {
    return 'NONE';
  }
  return formatClockValue(tournamentInfoStore.nextLevelSecondsUntilBreak);
});

const nextBreakTitle = computed(() => {
  if (!tournamentInfoStore.nextLevelSecondsUntilBreak) {
    return 'Next Break';
  }
  return `Next Break (${tournamentInfoStore.nextBreak.minutes}′)`;
});

const normalizeBetAmount = (amount, bigBlind) => {
  const value = parseFloat(amount);
  const bigBlindValue = bigBlind ? parseFloat(bigBlind) : parseFloat(value);
  if (bigBlindValue > 5000 && value > 1000) {
    if (value % 1000 === 0) {
      return (value / 1000).toFixed(0) + "K";
    }
    return (value / 1000).toFixed(1) + "K";
  }
  if (value > 1000000) {
    if (value % 1000000 === 0) {
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
  showSettingsBar.value = true;
  cursorTimer = setTimeout(() => {
    if (!showDialog.value) {
      document.body.style.cursor = "none";
    }
    showSettingsBar.value = false;
  }, 5000);
}

function checkForOldData() {
  if (!timerStore.tournamentStartTime) {
    return;
  }
  const extraMarginHours = 3;
  const maxTournamentDuration = (tournamentInfoStore.estimatedDurationHours + extraMarginHours) * 60 * 60 * 1000;
  const isOlderThanTournamentDuration = (Date.now() - timerStore.tournamentStartTime) > maxTournamentDuration
  if (isOlderThanTournamentDuration) {
    confirm.require({
      message: 'Data from an existing tournament state has been found. It might be an old tournament no longer valid, do you want to clear it?',
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
      },
      reject: () => {
        timerStore.setStartTime()
      }
    });
  }
}

watch([x, y], () => {
  resetCursorTimer();
})

// Lifecycle hooks
onMounted(() => {
  checkForOldData()
});

onBeforeUnmount(() => {
  clearTimeout(cursorTimer);
});

</script>


<template>
  <main>
    <div class="settings-bar" v-if="showSettingsBar">
      <i class="pi pi-cog settings-button" @click="showDialog = true"/>
    </div>
    <div class="aside left-panel">
      <TitleValue title="Prize pool" :value="totalPrizePool+tournamentInfoStore.currency.symbol"/>
      <!--      <TitleValue title="" value=""/>-->
      <TitleValue title="Reentries" :value="entriesStore.reentries.toLocaleString()"/>
      <TitleValue title="Addons" :value="entriesStore.addons.toLocaleString()"/>
    </div>
    <div class="central-panel">
      <div class="header">
        <div class="series secondary" v-if="tournamentInfoStore.tournamentSeries">{{ tournamentInfoStore.tournamentSeries }}</div>
        <div class="tournament primary">{{ tournamentInfoStore.tournamentName }}</div>
      </div>
      <div class="timer">
        <Clock class="clock" ref="clock"/>
      </div>
      <div class="current-level" v-if="!tournamentInfoStore.currentLevel?.break">
        <InlineInfo text="blinds" :value="`${smallBlind}/${bigBlind}`"/>
        <InlineInfo text="ante" :value="ante"/>
        <InlineInfo text="Next Level" :value="nextBlinds"/>
      </div>
      <div class="break" v-else>
        <InlineInfo text="Next Level" :value="nextBlinds"/>
        <span>BREAK</span>
      </div>
    </div>
    <div class="aside right-panel">
      <TitleValue title="Players" :value="entriesStore.remainingPlayers.toLocaleString() + '/' + entriesStore.entries.toLocaleString()"/>
      <TitleValue title="Level" :value="timerStore.levelIndex + 1"/>
      <TitleValue title="Avg Stack" :value="avgStack.toLocaleString()"/>
      <TitleValue :title="nextBreakTitle" :value="nextBreak"/>
    </div>
  </main>
  <Dialog class="dialog" v-model:visible="showDialog" modal header="Settings" style="width: 85%;max-width: 1000px;height: 100%">
    <Configuration/>
  </Dialog>
  <ConfirmDialog/>
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
  font-size: 2.2em
  font-family: 'Chivo Mono Variable', monospace

  .settings-bar
    position: fixed
    top: 0
    width: 100%
    height: 3em

    .settings-button
      position: absolute
      top: 25px
      right: 50px
      font-size: 1.3em

      &:hover
        cursor: pointer
        color: $primary-color

  .aside
    padding: 0
    display: flex
    flex-direction: column
    align-items: center
    justify-content: space-around
    font-size: 1em

  .central-panel
    font-size: 2em
    display: grid
    grid-template-rows: 1fr 3fr 2fr
    .header
      text-align: center
      line-height: 1.2em
      .tournament
        font-size: 1.7em

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
        font-size: 4em
    .current-level
      font-size: 1.2em
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

@media (max-width: 1900px)
  main
    font-size: 1.5em

@media (max-width: 1440px)
  main
    font-size: 1.3em


@media (orientation: portrait)
  @media (max-width: 700px)
    main
      font-size: 0.45em


</style>
