import {defineStore} from 'pinia'
import {useLocalStorage} from '@vueuse/core'
import {computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, watch} from 'vue'
import {useTournamentInfoStore} from "@/stores/tournamentInfoStore.js"
import {useLeaderStore} from "@/stores/leaderStore.js";
import {extractClockParts, formatClockValue} from "@/util/formatUtils.js";

export const useTimerStore = defineStore('timerStore', () => {
    const levelIndex = useLocalStorage('vue-poker-timer-level-index', 0)
    const levelTimer = useLocalStorage('vue-poker-timer-level-timer', -1)
    const tournamentStartTime = useLocalStorage('vue-poker-timer-tournament-start-time', 0)
    const active = useLocalStorage('vue-poker-timer-tournament-start-time', false)

    const clockValue = computed(() => {
        return formatClockValue(levelTimer.value)
    })

    const clockParts = computed(() => {
        return extractClockParts(levelTimer.value)
    });

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
        levelTimer.value =  Math.max(levelTimer.value - seconds, 0)
    }

    const toggle = () => {
        active.value = !active.value
        if (active.value) {
            if (!tournamentStartTime.value) {
                tournamentStartTime.value = Date.now()
            }
        }
    }

    function setStartTime() {
        tournamentStartTime.value = Date.now()
    }

    function calculateLevelSeconds() {
        return 60 * (useTournamentInfoStore().currentLevel?.minutes ?? 0)
    }

    const resetStore = () => {
        levelIndex.value = 0
        levelTimer.value = -1
        tournamentStartTime.value = 0
        active.value = false
    }

    watch(levelIndex, () => {
        levelTimer.value = calculateLevelSeconds()
    })

    onMounted(() => {
        runCountDownTimer()
    })

    onBeforeMount(() => {
        if (levelTimer.value === -1) {
            levelTimer.value = calculateLevelSeconds()
        }
    })

    onBeforeUnmount(() => {
        clearTimeout(timer)
    })

    return {
        levelIndex,
        levelTimer,
        tournamentStartTime,
        active,
        clockValue,
        clockParts,
        reduceLevel,
        incrementLevel,
        addSeconds,
        reduceSeconds,
        toggle,
        setStartTime,
        resetStore
    }
})