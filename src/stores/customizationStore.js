import {defineStore} from 'pinia'
import {useLocalStorage} from "@vueuse/core";
import {watch} from "vue";
import {camelcaseToHyphenSeparated} from "@/util/formatUtils.js";

export const useCustomizationStore = defineStore('customizationStore', () => {

    const defaultPrimaryColor = '#0b5404'
    const defaultSecondaryColor = '#d46f00'
    const defaultHighlightColor = '#bd34fe'
    const whiteColor = '#ffffff';

    const colorPalette = {
        series: {
          default: defaultSecondaryColor
        },
        tournament: {
            default: defaultPrimaryColor
        },
        level: {
            default: defaultSecondaryColor
        },
        clockNumber: {
            default: whiteColor
        },
        clockSeparator: {
            default: defaultPrimaryColor
        },
        blindsTitle: {
            default: defaultSecondaryColor
        },
        blindsValue: {
            default: whiteColor
        },
        infoTitle: {
            default: defaultSecondaryColor
        },
        infoValue: {
            default: whiteColor
        },
        nextLevel: {
            default: whiteColor
        },
        controls: {
            default: defaultHighlightColor
        },
        hover: {
            default: defaultPrimaryColor
        }
    };

    // Create color references and watchers dynamically
    const paletteColors = Object.fromEntries(
        Object.entries(colorPalette).map(([key, {default: defaultValue}]) => {

            const colorRef = useLocalStorage(`vue-poker-timer-${camelcaseToHyphenSeparated(key)}-color`, defaultValue);

            watch(colorRef, (value) => {
                updateVariable(`--c-${camelcaseToHyphenSeparated(key)}-color`, value);
            }, {immediate: true});

            return [key, colorRef];
        })
    );



    function updateVariable(variable, color) {
        if (!color.startsWith(`#`)) {
            color = '#' + color
        }
        document.documentElement.style.setProperty(variable, color);
    }

    function resetStore() {
        for (const [key, colorRef] of Object.entries(paletteColors)) {
            colorRef.value = colorPalette[key].default
        }
    }

    return {
        paletteColors,
        resetStore
    }
})