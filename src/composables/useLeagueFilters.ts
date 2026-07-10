import { computed, ref, type Ref } from 'vue'
import { useDebounced } from '@/composables/useDebounce'
import type { League } from '@/types/league'

export const ALL_SPORTS = 'all'

export function useLeagueFilters(leagues: Ref<League[]>) {
  const search = ref('')
  const selectedSport = ref<string>(ALL_SPORTS)

  const debouncedSearch = useDebounced(search, 250)

  // Sport options derived from the data, so we never hardcode sport types.
  const sportOptions = computed(() => {
    const sports = new Set(leagues.value.map((l) => l.strSport).filter(Boolean))
    return [...sports].sort((a, b) => a.localeCompare(b))
  })

  const filteredLeagues = computed(() => {
    const term = debouncedSearch.value.trim().toLowerCase()
    const sport = selectedSport.value

    return leagues.value.filter((league) => {
      const matchesSport = sport === ALL_SPORTS || league.strSport === sport
      if (!matchesSport) return false

      if (!term) return true
      const name = league.strLeague?.toLowerCase() ?? ''
      const alt = league.strLeagueAlternate?.toLowerCase() ?? ''
      return name.includes(term) || alt.includes(term)
    })
  })

  return { search, selectedSport, sportOptions, filteredLeagues }
}
