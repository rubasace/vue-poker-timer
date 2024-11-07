import {defineStore} from 'pinia'
import {useLocalStorage} from "@vueuse/core";
import {computed, watch} from "vue";
import {camelcaseToHyphenSeparated} from "@/util/formatUtils.js";
import newLevelSoundFile from "@/assets/sounds/nuevo_cambio_de_nivel.wav";

const defaultNewLevelAudio = new Audio(newLevelSoundFile);

export const useCustomizationStore = defineStore('customizationStore', () => {

    const noSoundFileName = `No Sound`;

    const defaultSoundFileName = 'defaultNewLevel.mp3';

    const newLevelSoundBase64 = useLocalStorage('vue-poker-timer-new-level-sound', null)
    const newLevelFileName = useLocalStorage('vue-poker-timer-new-level-file-name', defaultSoundFileName)

    const newLevelAudio = computed(() => {
        if(noSoundFileName === newLevelFileName.value) {
            return null
        }
        try {
            return newLevelSoundBase64.value ? new Audio(newLevelSoundBase64.value) : defaultNewLevelAudio
        } catch (e) {
            return defaultNewLevelAudio
        }
    })

    const defaultPrimaryColor = '#0b5404'
    const defaultSecondaryColor = '#d46f00'
    const defaultHighlightColor = '#bd34fe'
    const textColor = '#ffffff';

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
            default: textColor
        },
        clockSeparator: {
            default: textColor
        },
        blindsTitle: {
            default: defaultSecondaryColor
        },
        blindsValue: {
            default: textColor
        },
        infoTitle: {
            default: defaultSecondaryColor
        },
        infoValue: {
            default: textColor
        },
        nextLevel: {
            default: textColor
        },
        pausedBox: {
            default: defaultPrimaryColor
        },
        decorationLines: {
            default: defaultPrimaryColor
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

    function setNewLevelSound(file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            newLevelSoundBase64.value = event.target.result;
            newLevelFileName.value = file.name
        };

        reader.readAsDataURL(file);
    }

    function clearNewLevelSound() {
        newLevelSoundBase64.value = null
        newLevelFileName.value = noSoundFileName
    }


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
        newLevelSoundBase64.value = null
        newLevelFileName.value = defaultSoundFileName
    }

    return {
        paletteColors,
        newLevelAudio,
        newLevelFileName,
        setNewLevelSound,
        clearNewLevelSound,
        resetStore
    }
})