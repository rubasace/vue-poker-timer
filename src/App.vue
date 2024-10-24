<template>
  <main @mousemove="resetCursorTimer">
    <div class="aside left-panel">
      <TitleValue title="Prize pool" :value="totalPrizePool+currency"/>
      <TitleValue title="Payouts" value=""/>
      <TitleValue title="Reentries" :value="reentries"/>
      <TitleValue title="Addons" :value="addons"/>
    </div>
    <div class="central-panel">
      <div class="header">
        <div class="series secondary" v-if="tournamentSeries">{{ tournamentSeries }}</div>
        <div class="tournament primary">{{ tournamentName }}</div>
      </div>
      <div class="timer">
        <Clock class="clock" :minutes="minutes" :key="levelIndex" ref="clock" @finished="incrementLevel()" @previous="reduceLevel()" @next="incrementLevel()"/>
      </div>
      <div class="current-level">
        <BlindsInfo text="blinds" :value="`${smallBlind}/${bigBlind}`"/>
        <BlindsInfo text="ante" :value="ante"/>
        <BlindsInfo text="Next Level" :value="nextBlinds"/>
      </div>
    </div>
    <div class="aside right-panel">
      <TitleValue title="Players" :value="remainingPlayers + '/' + totalPlayers"/>
      <TitleValue title="Level" :value="levelIndex + 1"/>
      <TitleValue title="Avg Stack" :value="avgStack.toLocaleString()"/>
    </div>
  </main>
  <Dialog v-if="showDialog" @close="showDialog = false">
    <div class="settings-form">
      <ConfigLine title="Entries" :value="entries" @increment="registerPlayer" @decrement="unRegisterPlayer"/>
      <ConfigLine title="Reentries" :value="reentries" @increment="addReentry" @decrement="removeReentry"/>
      <ConfigLine title="Addons" :value="addons" @increment="addons++" @decrement="addons--"/>
      <ConfigLine title="Remaining Players" :value="remainingPlayers" @increment="remainingPlayers++" @decrement="remainingPlayers--"/>
    </div>
  </Dialog>
  <span class="settings" @click="showDialog = true">Settings</span>
</template>

<script>
import BlindsInfo from "@/components/BlindsInfo.vue";
import Clock from "@/components/Clock.vue";
import {nextTick} from "vue";
import TitleValue from "@/components/TitleValue.vue";
import Dialog from "@/components/Dialog.vue";
import ConfigLine from "@/components/ConfigLine.vue";

export default {
  components: {ConfigLine, Dialog, TitleValue, Clock, BlindsInfo},
  computed: {
    currentBlinds() {
      return this.blinds[this.levelIndex]
    },
    smallBlind() {
      return this.currentBlinds.split('/')[0]
    },
    bigBlind() {
      return this.currentBlinds.split('/')[1]
    },
    ante() {
      return this.currentBlinds.split('/')[2]
    },
    nextBlinds() {
      const parts = this.blinds[this.levelIndex + 1].split('/')
      return `${parts[0]}/${parts[1]}(${parts[2]})`
    },
    totalPlayers() {
      return this.entries
    },
    totalStack() {
      return this.initialStack * (this.entries + this.reentries) + this.addons * this.addonStack
    },
    totalPrizePool() {
      return this.entries * this.entryFee + this.reentries * this.reentryFee + this.addons * this.addonFee + this.addedPrize
    },
    avgStack() {
      let avgStack =  Math.round(this.totalStack / this.remainingPlayers)
      if(isNaN(avgStack)){
        return 0
      }
      if(avgStack >= 1000000){
        return (avgStack / 1000000).toFixed(1) + 'M';
      }
      if(avgStack >= 100000){
        return (avgStack / 1000).toFixed(1) + 'K';
      }
      return avgStack;
    }
  },
  data() {
    return {
      tournamentSeries: "Marcosfa Poker Tour",
      tournamentName: "#2",
      currency: "€",
      levelIndex: 0,
      remainingPlayers: 0,
      entries: 0,
      reentries: 0,
      addons: 0,
      initialStack: 25000,
      addonStack: 10000,
      entryFee: 0,
      reentryFee: 5,
      addonFee: 5,
      addedPrize: 20,
      minutes: 15,
      //TODO support breaks (probably as we extract structure to JSON/YAML file
      blinds: ['20/40/40', '30/60/60', '40/80/80', '50/100/100', '60/120/120', '80/160/160', '100/200/200'],
      breaks: ['15/6', '15/12', '15/18', '15/24', '15/30'],
      showDialog: false
    }
  },
  methods: {
    reduceLevel() {
      this.levelIndex--
      if (this.levelIndex < 0) {
        nextTick(() => this.levelIndex = 0)
      }
    },
    incrementLevel() {
      this.levelIndex++
    },
    //TODO move to a separate component and use Composition API
    resetCursorTimer() {
      // Reset any previous timer
      clearTimeout(this.cursorTimer);
      // Show the cursor again
      document.body.style.cursor = "unset";
      // Set a new timer to hide the cursor after 5 seconds
      this.cursorTimer = setTimeout(() => {
        document.body.style.cursor = "none";
      }, 5000);
    },
    toggle() {
      this.$refs.clock?.toggle()
    },
    registerPlayer(){
      this.remainingPlayers++
      this.entries++
    },
    unRegisterPlayer(){
      this.remainingPlayers--
      this.entries--
    },
    addReentry(){
      this.remainingPlayers++
      this.reentries++
    },
    removeReentry(){
      this.remainingPlayers--
      this.reentries--
    }
  },
  mounted() {
    // Set initial cursor hide timer
    this.resetCursorTimer();
  },
  beforeDestroy() {
    // Clean up the timer when the component is destroyed
    clearTimeout(this.cursorTimer);
  }
}
</script>

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

.settings
  position: absolute
  top: 0
  right: 0
  padding: 15px

.settings-form
  padding: 20px
  display: flex
  flex-direction: column
  align-content: space-between
  color: black


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
