<template>
  <section class="league-list">
    <header class="league-list__controls">
      <SearchBar v-model="search" />
      <SportFilter
        v-model="selectedSport"
        :options="sportOptions"
      />
    </header>

    <StateMessage
      v-if="error"
      title="Something went wrong"
      description="We couldn't load the leagues. Please try again."
      show-retry
      @retry="refresh"
    />

    <StateMessage
      v-else-if="pending"
      title="Loading leagues…"
      description="Fetching the latest sports leagues."
    />

    <StateMessage
      v-else-if="filteredLeagues.length === 0"
      title="No leagues found"
      description="Try a different search term or sport filter."
    />

    <template v-else>
      <p class="league-list__count">{{ resultLabel }}</p>
      <div class="league-list__grid">
        <LeagueCard
          v-for="league in filteredLeagues"
          :key="league.idLeague"
          :league="league"
        />
      </div>
    </template>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useLeagues } from '@/composables/useLeagues'
import { useLeagueFilters } from '@/composables/useLeagueFilters'
import SearchBar from '@/components/SearchBar.vue'
import SportFilter from '@/components/SportFilter.vue'
import LeagueCard from '@/components/LeagueCard.vue'
import StateMessage from '@/components/StateMessage.vue'

const { data: leagues, pending, error, refresh } = useLeagues()
const { search, selectedSport, sportOptions, filteredLeagues } = useLeagueFilters(leagues)

const resultLabel = computed(() => {
  const n = filteredLeagues.value.length
  return `${n} ${n === 1 ? 'league' : 'leagues'}`
})
</script>

<style scoped lang="scss">
.league-list {
  &__controls {
    display: flex;
    flex-wrap: wrap;
    gap: $space-sm;
    margin-bottom: $space-lg;
  }

  &__count {
    margin: 0 0 $space-md;
    color: $color-text-muted;
    font-size: 0.85rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    align-items: start;
    gap: $space-md;
  }
}
</style>
