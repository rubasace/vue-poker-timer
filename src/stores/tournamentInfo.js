import {defineStore} from 'pinia'
import {useLocalStorage} from '@vueuse/core'
import {useTimerStore} from "@/stores/timerState.js";

export const useTournamentInfoStore = defineStore({
    id: 'tournamentInfo',
    state: () => ({
        tournamentSeries: useLocalStorage('vue-poker-timer-tournament-series', 'Marcosfa Poker Tour'),
        tournamentName: useLocalStorage('vue-poker-timer-tournament-name', '#2'),
        currency: useLocalStorage('vue-poker-timer-currency', '€'),
        initialStack: useLocalStorage('vue-poker-timer-initial-stack', 25000),
        addonStack: useLocalStorage('vue-poker-timer-addon-stack', 10000),
        entryFee: useLocalStorage('vue-poker-timer-entry-fee', 0),
        reentryFee: useLocalStorage('vue-poker-timer-reentry-fee', 5),
        addonFee: useLocalStorage('vue-poker-timer-addon-fee', 5),
        addedPrize: useLocalStorage('vue-poker-timer-added-prize', 20),
        levels: useLocalStorage('vue-poker-timer-levels', [
            {smallBlind: 20, bigBlind: 40, ante: 40, minutes: 20},
            {smallBlind: 30, bigBlind: 60, ante: 60, minutes: 20},
            {smallBlind: 40, bigBlind: 80, ante: 80, minutes: 20},
            {smallBlind: 50, bigBlind: 100, ante: 100, minutes: 20},
            {smallBlind: 60, bigBlind: 120, ante: 120, minutes: 20},
            {smallBlind: 80, bigBlind: 160, ante: 160, minutes: 20},
            {break: true, minutes: 20},
            {smallBlind: 100, bigBlind: 200, ante: 200, minutes: 20},
            {smallBlind: 150, bigBlind: 300, ante: 300, minutes: 20},
        ]),
    }),
    actions: {

    },
    getters: {
        currentLevel: (state) => {
            return state.levels[useTimerStore().levelIndex]
        },
        nextLevel: (state) => {
            return state.levels[useTimerStore().levelIndex+1]
        }
    }

})