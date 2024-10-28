import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useEntriesStore = defineStore({
    id: 'playerActions',
    state: () => ({
        remainingPlayers: useLocalStorage('vue-poker-timer-remaining-players', 0),
        entries: useLocalStorage('vue-poker-timer-entries', 0),
        reentries: useLocalStorage('vue-poker-timer-reentries', 0),
        addons: useLocalStorage('vue-poker-timer-addons', 0),
        doubleAddons: useLocalStorage('vue-poker-timer-double-addons', 0),
        kos: useLocalStorage('vue-poker-timer-kos', 0)
    }),
    actions: {
        registerPlayer() {
            this.remainingPlayers++
            this.entries++
        },
        unRegisterPlayer() {
            if (this.remainingPlayers > 0) {
                this.remainingPlayers--
            }
            if (this.entries > 0) {
                this.entries--
            }
        },
        addReentry() {
            if (this.remainingPlayers < this.entries) {
                this.remainingPlayers++
                this.reentries++
            }
        },
        removeReentry() {
            if (this.reentries > 0) {
                if (this.remainingPlayers > 0) {
                    this.remainingPlayers--
                }
                this.reentries--
            }
        },
        addAddon() {
            this.addons++
        },
        addDoubleAddon() {
            this.doubleAddons++
        },
        removeAddon() {
            if (this.addons > 0) {
                this.addons--
            }
        },
        removeDoubleAddon() {
            if (this.doubleAddons > 0) {
                this.doubleAddons--
            }
        },
        eliminatePlayer() {
            if (this.remainingPlayers > 1) {
                this.remainingPlayers--
                this.kos++
            }
        },
        undoElimination() {
            if (this.remainingPlayers < this.entries) {
                this.remainingPlayers++
                this.kos--
            }
        },
        resetStore(){
            this.remainingPlayers = 0
            this.entries = 0
            this.reentries = 0
            this.addons = 0
            this.doublAddons = 0
            this.kos = 0
        }
    }
})