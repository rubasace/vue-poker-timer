import {defineStore} from 'pinia'
import {useLocalStorage} from '@vueuse/core'
import {useTimerStore} from "@/stores/timerState.js";

export const useTournamentInfoStore = defineStore({
    id: 'tournamentInfo',
    state: () => ({
        tournamentSeries: useLocalStorage('vue-poker-timer-tournament-series', 'Marcosfa Poker Tour'),
        tournamentName: useLocalStorage('vue-poker-timer-tournament-name', '#2'),
        currency: useLocalStorage('vue-poker-timer-currency', {name: 'Euro', code: 'EUR', symbol: '€'}),
        entryFee: useLocalStorage('vue-poker-timer-entry-fee', 0),
        initialStack: useLocalStorage('vue-poker-timer-initial-stack', 25000),
        addonEnabled: useLocalStorage('vue-poker-timer-addon-enabled', true),
        doubleAddonEnabled: useLocalStorage('vue-poker-timer-double-addon-enabled', false),
        addonFee: useLocalStorage('vue-poker-timer-addon-fee', 5),
        addonStack: useLocalStorage('vue-poker-timer-addon-stack', 10000),
        reentryEnabled: useLocalStorage('vue-poker-timer-reentry-enabled', true),
        reentryFee: useLocalStorage('vue-poker-timer-reentry-fee', 5),
        maxReentries: useLocalStorage('vue-poker-timer-max-reentries', 0),
        addedPrize: useLocalStorage('vue-poker-timer-added-prize', 0),
        guaranteedPrize: useLocalStorage('vue-poker-timer-guaranteed-prize', 20),
        levels: useLocalStorage('vue-poker-timer-levels', [
            {id: 1, smallBlind: 100, bigBlind: 100, ante: 100, minutes: 20},
            {id: 2, smallBlind: 100, bigBlind: 200, ante: 200, minutes: 20},
            {id: 3, smallBlind: 100, bigBlind: 300, ante: 300, minutes: 20},
            {id: 4, smallBlind: 200, bigBlind: 400, ante: 400, minutes: 20},
            {id: 5, smallBlind: 200, bigBlind: 500, ante: 500, minutes: 20},
            {id: 6, smallBlind: 300, bigBlind: 600, ante: 600, minutes: 20},
            {id: 7, break: true, minutes: 20},
            {id: 8, smallBlind: 400, bigBlind: 800, ante: 800, minutes: 20},
            {id: 9, smallBlind: 500, bigBlind: 1000, ante: 1000, minutes: 20},
        ]),
    }),
    actions: {},
    getters: {
        currentLevel: (state) => {
            return state.levels[useTimerStore().levelIndex]
        },
        nextLevel: (state) => {
            let next = state.levels[useTimerStore().levelIndex + 1]
            if (next?.break) {
                next = state.levels[useTimerStore().levelIndex + 2]
            }
            return next
        },
        lastLevel: (state) => {
            let last = state.levels[state.levels.length - 1]
            if (last?.break) {
                last = state.levels[state.levels.length - 2]
            }
            return last
        },
        allowsDoubleAddon: (state) => {
            return state.addonEnabled && state.doubleAddonEnabled
        },
        nextLevelSecondsUntilBreak: (state) => {
            let totalMinutes = 0;
            let i = 1;
            let nextLevel = state.levels[useTimerStore().levelIndex + 1];
            while (nextLevel && !nextLevel?.break) {
                totalMinutes += nextLevel.minutes;
                i++;
                nextLevel = state.levels[useTimerStore().levelIndex + i];
            }
            if (!nextLevel?.break) {
                return 0;
            }
            return totalMinutes * 60 + useTimerStore().levelTimer;
        }
    }

})