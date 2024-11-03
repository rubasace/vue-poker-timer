import {useMouse} from "@vueuse/core";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";

export function useIdleMouse({idleDuration = 5000} = {}) {

    const {x, y} = useMouse()

    const idleMouse = ref(false)

    let cursorTimer;


    function resetCursorTimer() {
        clearTimeout(cursorTimer);
        idleMouse.value = false
        cursorTimer = setTimeout(() => {
            idleMouse.value = true;
        }, idleDuration);
    }

    watch([x, y], () => {
        resetCursorTimer();
    })

    onMounted(() => {
        resetCursorTimer()
    })
    onBeforeUnmount(() => {
        clearTimeout(cursorTimer);
    });

    return {
        idleMouse
    }

}