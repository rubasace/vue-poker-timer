import { defineStore } from 'pinia';
import { computed, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { useTimerStore } from "@/stores/timerState.js";

export const useTournamentInfoStore = defineStore('tournamentInfo', () => {
    // State
    const tournamentSeries = useLocalStorage('vue-poker-timer-tournament-series', 'Marcosfa Poker Tour');
    const tournamentName = useLocalStorage('vue-poker-timer-tournament-name', '#2');
    const currency = useLocalStorage('vue-poker-timer-currency', { name: 'Euro', code: 'EUR', symbol: '€' });
    const entryFee = useLocalStorage('vue-poker-timer-entry-fee', 0);
    const entryRake = useLocalStorage('vue-poker-timer-entry-rake', 0);
    const initialStack = useLocalStorage('vue-poker-timer-initial-stack', 25000);
    const addonEnabled = useLocalStorage('vue-poker-timer-addon-enabled', true);
    const doubleAddonEnabled = useLocalStorage('vue-poker-timer-double-addon-enabled', false);
    const addonFee = useLocalStorage('vue-poker-timer-addon-fee', 5);
    const addonRake = useLocalStorage('vue-poker-timer-addon-rake', 0);
    const addonStack = useLocalStorage('vue-poker-timer-addon-stack', 10000);
    const reentryEnabled = useLocalStorage('vue-poker-timer-reentry-enabled', true);
    const reentryFee = useLocalStorage('vue-poker-timer-reentry-fee', 5);
    const reentryRake = useLocalStorage('vue-poker-timer-reentry-rake', 0);
    const maxReentries = useLocalStorage('vue-poker-timer-max-reentries', 0);
    const addedPrize = useLocalStorage('vue-poker-timer-added-prize', 0);
    const guaranteedPrize = useLocalStorage('vue-poker-timer-guaranteed-prize', 20);
    const estimatedDurationHours = useLocalStorage('vue-poker-timer-estimated-duration', 8);
    const levels = useLocalStorage('vue-poker-timer-levels', [
        { id: 1, smallBlind: 100, bigBlind: 100, ante: 100, minutes: 20 },
        { id: 2, smallBlind: 100, bigBlind: 200, ante: 200, minutes: 20 },
        { id: 3, smallBlind: 100, bigBlind: 300, ante: 300, minutes: 20 },
        { id: 4, smallBlind: 200, bigBlind: 400, ante: 400, minutes: 20 },
        { id: 5, smallBlind: 200, bigBlind: 500, ante: 500, minutes: 20 },
        { id: 6, smallBlind: 300, bigBlind: 600, ante: 600, minutes: 20 },
        { id: 7, break: true, minutes: 20 },
        { id: 8, smallBlind: 400, bigBlind: 800, ante: 800, minutes: 20 },
        { id: 9, smallBlind: 500, bigBlind: 1000, ante: 1000, minutes: 20 },
    ]);

    // Timer store
    const timerStore = useTimerStore();

    // Watch addonEnabled and set doubleAddonEnabled to false if addonEnabled is false
    watch(addonEnabled, (newVal) => {
        if (!newVal) {
            doubleAddonEnabled.value = false;
        }
    }, {immediate: true});

    // Getters
    const currentLevel = computed(() => levels.value[timerStore.levelIndex]);
    const nextLevel = computed(() => {
        let next = levels.value[timerStore.levelIndex + 1];
        if (next?.break) {
            next = levels.value[timerStore.levelIndex + 2];
        }
        return next;
    });
    const lastLevel = computed(() => {
        let last = levels.value[levels.value.length - 1];
        if (last?.break) {
            last = levels.value[levels.value.length - 2];
        }
        return last;
    });
    const nextLevelSecondsUntilBreak = computed(() => {
        let totalMinutes = 0;
        let i = 1;
        let nextLevel = levels.value[timerStore.levelIndex + 1];
        while (nextLevel && !nextLevel?.break) {
            totalMinutes += nextLevel.minutes;
            i++;
            nextLevel = levels.value[timerStore.levelIndex + i];
        }
        if (!nextLevel?.break) {
            return 0;
        }
        return totalMinutes * 60 + timerStore.levelTimer;
    });
    const nextBreak = computed(() => {
        let i = 1;
        let nextLevel = levels.value[timerStore.levelIndex + 1];
        while (nextLevel && !nextLevel?.break) {
            i++;
            nextLevel = levels.value[timerStore.levelIndex + i];
        }
        if (!nextLevel?.break) {
            return undefined;
        }
        return nextLevel;
    });

    return {
        // State
        tournamentSeries,
        tournamentName,
        currency,
        entryFee,
        entryRake,
        initialStack,
        addonEnabled,
        doubleAddonEnabled,
        addonFee,
        addonRake,
        addonStack,
        reentryEnabled,
        reentryFee,
        reentryRake,
        maxReentries,
        addedPrize,
        guaranteedPrize,
        estimatedDurationHours,
        levels,

        // Getters
        currentLevel,
        nextLevel,
        lastLevel,
        nextLevelSecondsUntilBreak,
        nextBreak
    };
});