<script setup>

import EntriesConfiguration from "@/components/configuration/EntriesConfiguration.vue";
import TournamentDetailsConfiguration from "@/components/configuration/TournamentDetailsConfiguration.vue";
import ImportConfiguration from "@/components/configuration/ImportConfiguration.vue";
</script>
<template>
  <div class="configuration">
    <Tabs value="0">
      <TabList>
        <Tab value="0">Tournament Details</Tab>
        <Tab value="1">Live Actions</Tab>
        <Tab value="99">Import/Export</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <TournamentDetailsConfiguration/>
        </TabPanel>
        <TabPanel value="1">
          <EntriesConfiguration/>
        </TabPanel>
        <TabPanel value="99">
          <ImportConfiguration/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style lang="sass" scoped>
.configuration
  user-select: none
</style>


