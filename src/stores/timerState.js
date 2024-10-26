import {defineStore} from 'pinia'
import {useLocalStorage} from '@vueuse/core'
import {nextTick} from "vue";
import {useTournamentInfoStore} from "@/stores/tournamentInfo.js";


export const useTimerStore = defineStore({
    id: 'timerState',
    state: () => ({
        levelIndex: useLocalStorage('vue-poker-timer-level-index', 0)
    }),
    actions: {
        reduceLevel() {
            this.levelIndex--;
            //Done like this so when reducing first level it restarts it instead of ignoring it
            if (this.levelIndex < 0) {
                nextTick(() => (this.levelIndex = 0));
            }
        },
        incrementLevel() {
            if (this.levelIndex >= useTournamentInfoStore().levels.length - 1) {
                return
            }
            this.levelIndex++;
        },
        resetStore() {
            this.levelIndex = 0
        }
    }
})