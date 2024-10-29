import {defineStore} from 'pinia'
import {useTabLeaderElection} from "@/composables/useTabLeaderElection.js";

export const useLeaderStore = defineStore('leaderStore', () => {
    const {isLeaderTab} = useTabLeaderElection()

    return {
        isLeaderTab
    }
})