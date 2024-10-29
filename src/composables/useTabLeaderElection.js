import {onBeforeUnmount, onMounted, ref} from 'vue'

export function useTabLeaderElection(activeTabKey = 'leader-election-active-tab',
                                     heartbeatKey = 'leader-election-tab-last-heartbeat',
                                     heartbeatInterval = 400,
                                     heartbeatTimeout = 900) {
    const tabId = (Date.now() + Math.random()).toString() // Unique ID for this tab

    const isLeaderTab = ref(false)



    let heartbeatExecution = null
    const startHeartbeat = () => {
        heartbeatExecution = setInterval(() => {

            if (isLeaderMissing()) {
                navigator.locks.request(activeTabKey, {ifAvailable: true}, () => {
                    if (isLeaderMissing()) {
                        localStorage.setItem(activeTabKey, tabId)
                        localStorage.setItem(heartbeatKey, Date.now().toString())
                    }
                })
            }
            isLeaderTab.value = localStorage.getItem(activeTabKey) === tabId
            if (isLeaderTab.value) {
                localStorage.setItem(heartbeatKey, Date.now().toString())
            }

        }, heartbeatInterval)
    }

    function isLeaderMissing() {
        const lastHeartbeat = parseInt(localStorage.getItem(heartbeatKey), 10) || 0
        return !localStorage.getItem(activeTabKey) || Date.now() - lastHeartbeat > heartbeatTimeout
    }

    onMounted(() => {
        startHeartbeat()
    })

    onBeforeUnmount(() => {
        clearInterval(heartbeatExecution)
    })

    return {
        isLeaderTab
    }
}