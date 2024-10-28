<script setup>

import EntriesConfiguration from "@/components/configuration/EntriesConfiguration.vue";
import TournamentDetailsConfiguration from "@/components/configuration/TournamentDetailsConfiguration.vue";
</script>
<template>

  <div class="card">
    <Tabs value="0">
      <TabList>
        <Tab value="0">Tournament Details</Tab>
        <Tab value="1">Live Actions</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <TournamentDetailsConfiguration/>
        </TabPanel>
        <TabPanel value="1">
          <EntriesConfiguration/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>


