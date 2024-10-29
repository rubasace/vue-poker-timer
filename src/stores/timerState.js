import {defineStore} from 'pinia'
import {useLocalStorage} from '@vueuse/core'
import {nextTick, onBeforeUnmount, onMounted, watch} from 'vue'
import {useTournamentInfoStore} from "@/stores/tournamentInfo.js"
import {useLeaderStore} from "@/stores/leaderState.js";

export const useTimerStore = defineStore('timerState', () => {
    const levelIndex = useLocalStorage('vue-poker-timer-level-index', 0)
    const levelTimer = useLocalStorage('vue-poker-timer-level-timer', 0)
    const tournamentStartTime = useLocalStorage('vue-poker-timer-tournament-start-time', null)
    const active = useLocalStorage('vue-poker-timer-tournament-start-time', false)


    let timer = null

    const leaderStore = useLeaderStore()
    const runCountDownTimer = () => {

        timer = setTimeout(() => {
            if (leaderStore.isLeaderTab) {
                if (active.value) {
                    levelTimer.value -= 1
                }
                if (levelTimer.value < 0) {
                    levelTimer.value = 0
                    nextTick(() => incrementLevel())
                }
                runCountDownTimer()
            } else {
                runCountDownTimer()
            }

        }, 1000)
    }


    const reduceLevel = () => {
        levelIndex.value--
        if (levelIndex.value < 0) {
            nextTick(() => (levelIndex.value = 0))
        }
    }

    const incrementLevel = () => {
        const tournamentInfoStore = useTournamentInfoStore()
        if (levelIndex.value >= tournamentInfoStore.levels.length - 1) {
            return
        }
        levelIndex.value++
    }

    const addSeconds = (seconds) => {
        levelTimer.value += seconds
    }

    const reduceSeconds = (seconds) => {
        levelTimer.value -= seconds
    }

    const stopCountDownTimer = () => {
        clearTimeout(timer)
    }

    const toggle = () => {
        active.value = !active.value
        if (active.value) {
            if (!tournamentStartTime.value) {
                tournamentStartTime.value = Date.now()
            }
        }
    }

    function calculateLevelSeconds() {
        return 60 * (useTournamentInfoStore().currentLevel?.minutes ?? 0)
    }

    const resetStore = () => {
        levelIndex.value = 0
        levelTimer.value = 0
        tournamentStartTime.value = null
        active.value = false
    }

    watch(levelIndex, () => {
        levelTimer.value = calculateLevelSeconds()
    })

    onMounted(() => {
        runCountDownTimer()
    })

    onBeforeUnmount(() => {
        stopCountDownTimer()
    })

    return {
        levelIndex,
        levelTimer,
        tournamentStartTime,
        active,
        reduceLevel,
        incrementLevel,
        addSeconds,
        reduceSeconds,
        toggle,
        resetStore
    }
})