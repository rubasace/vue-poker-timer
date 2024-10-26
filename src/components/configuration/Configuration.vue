<script setup>

import EntriesConfiguration from "@/components/configuration/EntriesConfiguration.vue";
import TournamentStructureConfiguration from "@/components/configuration/TournamentStructureConfiguration.vue";
</script>
<template>

  <div class="card">
    <Tabs value="0">
      <TabList>
        <Tab value="0">Entries</Tab>
        <Tab value="1">Structure</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <EntriesConfiguration/>
        </TabPanel>
        <TabPanel value="1">
          <TournamentStructureConfiguration/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>


