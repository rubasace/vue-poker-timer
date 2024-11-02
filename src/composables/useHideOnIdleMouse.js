import {onKeyStroke} from "@vueuse/core";
import {useTimerStore} from "@/stores/timerStore.js";
import {useEntriesStore} from "@/stores/entriesStore.js";

export function useKeyboardShortcuts() {

    const timerStore = useTimerStore()
    const entriesStore = useEntriesStore()

    const shortcuts = {
        toggle: ' ',
        reduceLevel: 'ArrowLeft',
        incrementLevel: 'ArrowRight',
        reduceMinute: 'ArrowDown',
        addMinute: 'ArrowUp',
        registerPlayer: 'p',
        unregisterPlayer: 'o',
        // eliminatePlayer: 'k',
        // undoElimination: 'l',
        // addReentry: 'q',
        // removeReentry: 'w',
        // addAddon: 'a',
        // removeAddon: 's',
        // addDoubleAddon: 'd',
        // removeDoubleAddon: 'f'
    }

    const possibleActions = {
        toggle: timerStore.toggle,
        reduceLevel: timerStore.reduceLevel,
        incrementLevel: timerStore.incrementLevel,
        reduceMinute: () => timerStore.reduceSeconds(60),
        addMinute: () => timerStore.addSeconds(60),
        registerPlayer: entriesStore.registerPlayer,
        unregisterPlayer: entriesStore.unRegisterPlayer,
        eliminatePlayer: entriesStore.eliminatePlayer,
        undoElimination: entriesStore.undoElimination,
        addReentry: entriesStore.addReentry,
        removeReentry: entriesStore.removeReentry,
        addAddon: entriesStore.addAddon,
        removeAddon: entriesStore.removeAddon,
        addDoubleAddon: entriesStore.addDoubleAddon,
        removeDoubleAddon: entriesStore.removeDoubleAddon

    }

    for (const action in possibleActions) {
        if (!shortcuts[action]) {
            continue
        }
        onKeyStroke(shortcuts[action], (e) => {
            e.preventDefault()
            possibleActions[action]()
        })
    }

}