import {defineStore} from 'pinia';
import {useLocalStorage} from "@vueuse/core";
import {computed, watch} from "vue";
import {camelcaseToHyphenSeparated} from "@/util/formatUtils.js";
import newLevelSoundFile from "@/assets/sounds/nuevo_cambio_de_nivel.wav";

const defaultNewLevelAudio = new Audio(newLevelSoundFile);

export const useCustomizationStore = defineStore('customizationStore', () => {
        const customBackgroundStyle = "custom-background-style";
        const noSoundFileName = `No Sound`;
        const defaultSoundFileName = 'defaultNewLevel.mp3';

        const newLevelSoundBase64 = useLocalStorage('vue-poker-timer-new-level-sound', null);
        const newLevelFileName = useLocalStorage('vue-poker-timer-new-level-file-name', defaultSoundFileName);

        const newLevelAudio = computed(() => {
            if (noSoundFileName === newLevelFileName.value) {
                return null;
            }
            try {
                return newLevelSoundBase64.value ? new Audio(newLevelSoundBase64.value) : defaultNewLevelAudio;
            } catch (e) {
                return defaultNewLevelAudio;
            }
        });

        const defaultBackgroundSetting = {
            type: 'gradient',
            color: '#101010',
            gradient: 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(25,25,25,1) 50%, rgba(0,0,0,1) 100%)',
            customCSS: 'background: rgb(0,0,0);\n' +
                'background: radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(25,25,25,1) 50%, rgba(0,0,0,1) 100%);'
        }

        const backgroundSetting = useLocalStorage('vue-poker-timer-background-setting', defaultBackgroundSetting);


        watch(backgroundSetting, (settings) => {
            switch (backgroundSetting.value.type) {
                case 'solid':
                    document.body.style.backgroundColor = backgroundSetting.value.color;
                    document.body.style.backgroundImage = null;
                    document.getElementById(customBackgroundStyle)?.remove();
                    break;
                case 'gradient':
                    document.body.style.backgroundImage = backgroundSetting.value.gradient;
                    document.getElementById(customBackgroundStyle)?.remove();
                    break;
                case 'custom':
                    document.body.style.backgroundImage = null;
                    applyCustomCSS(backgroundSetting.value.customCSS);
                    break;
            }

        }, {immediate: true, deep: true});

        function applyCustomCSS(css) {
            // Check if a <style> element for custom CSS already exists
            let styleSheet = document.getElementById(customBackgroundStyle);
            if (!styleSheet) {
                // Create a new <style> element if it doesn't exist
                styleSheet = document.createElement("style");
                styleSheet.id = customBackgroundStyle;
                document.head.appendChild(styleSheet);
            }

            // Add the custom CSS to the <style> element
            styleSheet.innerHTML = `body { ${css} }`;
        }

        const defaultPrimaryColor = '#0b5404';
        const defaultSecondaryColor = '#d46f00';
        const defaultHighlightColor = '#bd34fe';
        const textColor = '#ffffff';

        const colorPalette = {
            series: {default: defaultSecondaryColor, category: 'Title'},
            tournament: {default: defaultPrimaryColor, category: 'Title'},
            level: {default: defaultSecondaryColor, category: 'Clock'},
            clockNumber: {default: textColor, category: 'Clock'},
            clockSeparator: {default: textColor, category: 'Clock'},
            blindsTitle: {default: defaultSecondaryColor, category: 'Clock'},
            blindsValue: {default: textColor, category: 'Clock'},
            infoTitle: {default: defaultSecondaryColor, category: 'Info'},
            infoValue: {default: textColor, category: 'Info'},
            nextLevel: {default: textColor, category: 'Clock'},
            pausedBox: {default: defaultPrimaryColor, category: 'Details'},
            decorationLines: {default: defaultPrimaryColor, category: 'Details'},
            controls: {default: defaultHighlightColor, category: 'Details'},
            hover: {default: defaultPrimaryColor, category: 'Details'},
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

        function getCategory(colorName) {
            return colorPalette[colorName].category;
        }

        function setNewLevelSound(file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                newLevelSoundBase64.value = event.target.result;
                newLevelFileName.value = file.name;
            };
            reader.readAsDataURL(file);
        }

        function clearNewLevelSound() {
            newLevelSoundBase64.value = null;
            newLevelFileName.value = noSoundFileName;
        }

        function updateVariable(variable, color) {
            if (!color.startsWith(`#`)) {
                color = '#' + color;
            }
            document.documentElement.style.setProperty(variable, color);
        }

        function resetStore() {
            for (const [key, colorRef] of Object.entries(paletteColors)) {
                colorRef.value = colorPalette[key].default;
            }
            newLevelSoundBase64.value = null;
            newLevelFileName.value = defaultSoundFileName;
            backgroundSetting.value = defaultBackgroundSetting;
        }

        return {
            paletteColors,
            newLevelAudio,
            newLevelFileName,
            backgroundSetting,
            setNewLevelSound,
            clearNewLevelSound,
            getCategory,
            resetStore
        };
    }
);