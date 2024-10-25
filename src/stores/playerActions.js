import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useEntriesStore = defineStore('playerActions', () => {
    const remainingPlayers = ref(0)
    const entries = ref(0)
    const reentries = ref(0)
    const addons = ref(0)


    function registerPlayer() {
        remainingPlayers.value++
        entries.value++
    }

    function unRegisterPlayer() {
        //TODO revisit logic, maybe can be done with watch better?
        if (remainingPlayers.value > 0) {
            remainingPlayers.value--
        }
        if (entries.value > 0) {
            entries.value--
        }
    }

    function addReentry() {
        if (remainingPlayers.value >= entries.value) {
            return
        }
        remainingPlayers.value++
        reentries.value++
    }

    function removeReentry() {
        if (reentries.value <= 0) {
            return
        }
        if (remainingPlayers.value > 0) {
            remainingPlayers.value--
        }
        reentries.value--
    }

    function addAddon() {
        addons.value++
    }

    function removeAddon() {
        if (addons.value > 0) {
            addons.value--
        }
    }

    function eliminatePlayer() {
        if (remainingPlayers.value > 1) {
            remainingPlayers.value--
        }
    }

    function undoElimination() {
        if (remainingPlayers.value < entries.value) {
            remainingPlayers.value++
        }
    }

    return {
        remainingPlayers,
        entries,
        reentries,
        addons,
        registerPlayer,
        unRegisterPlayer,
        addReentry,
        removeReentry,
        addAddon,
        removeAddon,
        eliminatePlayer,
        undoElimination
    }
})
