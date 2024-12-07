<script setup>
import {computed, onMounted, ref, watch} from "vue";
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
import {useKeyboardShortcuts} from "@/composables/useKeyboardShortcuts.js";
import InlineInfo from "@/components/InlineInfo.vue";
import {useIdleMouse} from "@/composables/useIdleMouse.js";

const confirm = useConfirm();
const {idleMouse} = useIdleMouse()
const showDialog = ref(false);

useKeyboardShortcuts({paused: showDialog})


const entriesStore = useEntriesStore();
const timerStore = useTimerStore();
const tournamentInfoStore = useTournamentInfoStore();


//TODO show minutes of next level

const currentBlinds = computed(() => tournamentInfoStore.currentLevel ? `${tournamentInfoStore.currentLevel.smallBlind}/${tournamentInfoStore.currentLevel.bigBlind}/${tournamentInfoStore.currentLevel.ante}` : '0/0/0');
const smallBlind = computed(() => normalizeBetAmount(currentBlinds.value.split('/')[0], tournamentInfoStore.currentLevel?.bigBlind));
const bigBlind = computed(() => normalizeBetAmount(currentBlinds.value.split('/')[1]));
const ante = computed(() => normalizeBetAmount(currentBlinds.value.split('/')[2]));

const nextBlinds = computed(() => {
  if (!tournamentInfoStore.nextLevel) {
    return 'NONE';
  }
  return `${normalizeBetAmount(tournamentInfoStore.nextLevel.smallBlind, tournamentInfoStore.nextLevel.bigBlind)}/${normalizeBetAmount(tournamentInfoStore.nextLevel.bigBlind)}(${normalizeBetAmount(tournamentInfoStore.nextLevel.ante)})`;
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

watch(idleMouse, idle => {
  if (idle) {
    document.body.style.cursor = "none"
  } else {
    document.body.style.cursor = "unset"
  }
})

onMounted(() => {
  checkForOldData()
});

</script>

<template>
  <main>
    <div class="settings-bar" v-if="!idleMouse">
      <i class="pi pi-cog settings-button" @click="showDialog = true"/>
    </div>
    <div class="aside entries-data">
      <TitleValue title="Prize pool" :value="totalPrizePool+tournamentInfoStore.currency.symbol"/>
      <TitleValue title="Reentries" :value="entriesStore.reentries.toLocaleString()" v-if="tournamentInfoStore.reentryEnabled"/>
      <TitleValue title="Addons" :value="entriesStore.addons" v-if="tournamentInfoStore.addonEnabled"/>
      <TitleValue title="Double Addons" :value="entriesStore.doubleAddons" v-if="tournamentInfoStore.doubleAddonEnabled"/>
    </div>
    <div class="central-panel">
      <div class="header">
        <div class="series" v-if="tournamentInfoStore.tournamentSeries">{{ tournamentInfoStore.tournamentSeries }}</div>
        <div class="tournament">{{ tournamentInfoStore.tournamentName }}</div>
      </div>
      <div class="level-name">
        <span class="controls decrease-button" @click="timerStore.reduceLevel()">▼</span>
        <span class="current-level-name"> {{ tournamentInfoStore.currentLevelNumber ? `Level ${tournamentInfoStore.currentLevelNumber}` : `Break` }}</span>
        <span class="controls increase-button" @click="timerStore.incrementLevel()">▲</span>
      </div>
      <div class="timer">
        <Clock class="clock" ref="clock"/>
        <div class="current-level" v-if="!tournamentInfoStore.currentLevel?.break">
          <BlindsInfo class="level-blinds" :small-blind="smallBlind" :big-blind="bigBlind" :ante="ante"/>
        </div>
        <div class="break" v-else>
          <span>BREAK</span>
        </div>
      </div>
      <div class="next-level">
        <InlineInfo :text="`Next Level(${tournamentInfoStore.nextLevel?.minutes}′)`" :value="nextBlinds" v-visible="tournamentInfoStore.nextLevel"/>
      </div>

    </div>
    <div class="aside tournament-data">
      <TitleValue title="Players" :value="entriesStore.remainingPlayers.toLocaleString() + '/' + entriesStore.entries.toLocaleString()"/>
      <TitleValue title="Avg Stack" :value="avgStack.toLocaleString()"/>
      <TitleValue :title="nextBreakTitle" :value="nextBreak"/>
    </div>
  </main>
  <Dialog class="dialog" v-model:visible="showDialog" modal header="Settings" style="width: 85%;max-width: 1000px;height: 100%">
    <Configuration/>
  </Dialog>
  <ConfirmDialog/>
  <Toast position="top-left"/>
</template>

<style lang="sass" scoped>

@mixin bordered-lines($border-color, $border-width: 4px, $separation: 0.2em)
  position: relative

  &::before, &::after
    content: ''
    position: absolute
    height: 75%

  &::before
    left: -$separation
    border-left: $border-width solid $border-color

  &::after
    right: -$separation
    border-right: $border-width solid $border-color


main
  width: 100%
  height: 90vh
  color: whitesmoke
  margin: auto 0
  user-select: none
  display: flex
  align-content: center
  justify-content: center
  flex-direction: row
  text-transform: uppercase
  font-size: 1.8rem
  font-family: 'Chivo Mono Variable', monospace


  .settings-bar
    position: absolute
    top: 0
    width: 100%
    height: 3em

    .settings-button
      position: absolute
      top: 25px
      right: 50px
      font-size: 2rem

      &:hover
        cursor: pointer
        color: var(--c-hover-color)

  .aside
    padding: 0
    flex: 1
    display: flex
    flex-direction: column
    align-items: center
    justify-content: space-around
    font-size: 1em

  .level-name
    position: relative
    margin-bottom: 1em

    .current-level-name
      color: var(--c-level-color)

    .controls
      background: none
      border: none
      cursor: pointer
      color: var(--c-controls-color)
      margin: 0.5em
      visibility: hidden

      &.increase-button
        top: -1.2em

      &.decrease-button
        bottom: -1.2em

      &:hover
        color: var(--c-hover-color)

    &:hover
      .controls
        visibility: visible

  .central-panel
    flex: 1
    display: flex
    flex-direction: column
    align-items: center
    justify-content: space-around
    font-size: 2em
    gap: 1em

    .series
      color: var(--c-series-color)
    .tournament
      color: var(--c-tournament-color)

    .header
      text-align: center
      line-height: 1.2em

      .tournament
        font-size: 1.7em
        flex-grow: 0

    .timer
      @include bordered-lines(var(--c-decoration-lines-color))
      position: relative
      text-align: center
      width: 100%
      max-height: 45%
      display: flex
      flex-direction: column
      align-items: center
      justify-content: space-between
      text-transform: uppercase
      line-height: 1em
      padding: 0.3em
      flex-grow: 1

      .clock
        font-size: 5.5em
        flex-shrink: 0
        margin-bottom: 0.5em

      .current-level
        width: 100%
        text-align: center

        .level-blinds
          font-size: 1.1em

      .break
        color: var(--c-secondary-color)
        margin-top: 0.3em
        font-size: 3.5em

        span
          font-weight: 600

    .next-level
      flex-grow: 0
      font-size: 0.8em
      width: 100%
      color: var(--c-next-level-color)

@media (min-height: 350px)
  @media (max-width: 1900px)
    main
      font-size: 1.5em

  @media (max-width: 1450px)
    main
      font-size: 1.3em

  @media (max-width: 1150px)
    main
      font-size: 1.1em

  @media (max-width: 980px)
    main
      font-size: 0.9em

  @media (max-width: 820px)
    main
      font-size: 0.7em

  @media (max-width: 650px)
    main
      font-size: 0.55em

@media (max-height: 449px)
  main
    font-size: 0.6em
    .aside
      font-size: 1.2em

@media (max-height: 350px)
  main
    font-size: 0.4em

@media (max-height: 260px)
  main
    font-size: 0.3em

@media (orientation: portrait)
  main
    font-size: 1.6em
    flex-wrap: wrap

    .central-panel
      margin-bottom: 1em
      flex-basis: 100%

    .aside
      order: 2
      flex-basis: 50%

  @media (max-width: 900px)
    main
      font-size: 1.1em

  @media (max-height: 1400px)
    main
      font-size: 1em
      .aside
        font-size: 1.3em

  @media (max-height: 920px)
    main
      font-size: 0.8em

  @media (max-height: 750px)
    main
      font-size: 0.6em

  @media (max-width: 700px)
    main
      font-size: 0.6em

      .aside
        font-size: 1.3em

  @media (max-height: 750px)
    main
      font-size: 0.5em

</style>
