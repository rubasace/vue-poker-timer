import {defineStore} from 'pinia'
import {useLocalStorage} from "@vueuse/core";
import {watch} from "vue";

export const useThemeStore = defineStore('themeStore', () => {

    const defaultPrimary = '#0b5404'
    const defaultSecondary = '#d46f00'

    const primaryColor = useLocalStorage('vue-poker-timer-primary-color', defaultPrimary)
    const secondaryColor = useLocalStorage('vue-poker-timer-secondary-color', defaultSecondary)

    function updateVariable(variable, color) {
        if(!color.startsWith(`#`)) {
            color = '#' + color
        }
        document.documentElement.style.setProperty(variable, color);
    }

    function resetStore() {
        primaryColor.value = defaultPrimary
        secondaryColor.value = defaultSecondary
    }

    watch(primaryColor, (value) => {
        updateVariable('--c-primary-color', value)
    }, {immediate: true})

    watch(secondaryColor, (value) => {
        updateVariable('--c-secondary-color', value)
    }, {immediate: true})

    return {
        primaryColor,
        secondaryColor,
        resetStore
    }
})