import { nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ALL_SPORTS, useLeagueFilters } from '@/composables/useLeagueFilters'
import type { League } from '@/types/league'

// A deliberately multi-sport fixture: the live free API only returns Soccer, so
// this is how we prove filtering works across sports deterministically.
const LEAGUES: League[] = [
  {
    idLeague: '4328',
    strLeague: 'English Premier League',
    strSport: 'Soccer',
    strLeagueAlternate: 'Premier League, EPL',
  },
  {
    idLeague: '4335',
    strLeague: 'Spanish La Liga',
    strSport: 'Soccer',
    strLeagueAlternate: 'La Liga',
  },
  {
    idLeague: '4387',
    strLeague: 'NBA',
    strSport: 'Basketball',
    strLeagueAlternate: 'National Basketball Association',
  },
  {
    idLeague: '4370',
    strLeague: 'Formula 1',
    strSport: 'Motorsport',
    strLeagueAlternate: 'F1',
  },
  {
    idLeague: '4407',
    strLeague: 'NASCAR Cup Series',
    strSport: 'Motorsport',
    strLeagueAlternate: null,
  },
]

const setup = () => useLeagueFilters(ref([...LEAGUES]))
const names = (leagues: League[]) => leagues.map((l) => l.strLeague)

describe('useLeagueFilters — sport filtering', () => {
  it('derives unique, alphabetically sorted sport options from the data', () => {
    const { sportOptions } = setup()
    // Motorsport appears twice in the fixture but must surface only once.
    expect(sportOptions.value).toEqual(['Basketball', 'Motorsport', 'Soccer'])
  })

  it('returns every league by default (ALL_SPORTS, no search)', () => {
    const { selectedSport, filteredLeagues } = setup()
    expect(selectedSport.value).toBe(ALL_SPORTS)
    expect(filteredLeagues.value).toHaveLength(LEAGUES.length)
  })

  it('keeps only Basketball leagues when Basketball is selected', () => {
    const { selectedSport, filteredLeagues } = setup()
    selectedSport.value = 'Basketball'
    expect(names(filteredLeagues.value)).toEqual(['NBA'])
  })

  it('keeps all Motorsport leagues when Motorsport is selected', () => {
    const { selectedSport, filteredLeagues } = setup()
    selectedSport.value = 'Motorsport'
    expect(names(filteredLeagues.value)).toEqual(['Formula 1', 'NASCAR Cup Series'])
  })

  it('restores the full list when switching back to ALL_SPORTS', () => {
    const { selectedSport, filteredLeagues } = setup()
    selectedSport.value = 'Soccer'
    expect(filteredLeagues.value).toHaveLength(2)
    selectedSport.value = ALL_SPORTS
    expect(filteredLeagues.value).toHaveLength(LEAGUES.length)
  })
})

describe('useLeagueFilters — search filtering (debounced)', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  // The search ref is debounced (250ms), so a change only reaches the filter
  // after the timer fires. This helper mirrors that flow.
  const applySearch = async (search: { value: string }, term: string) => {
    search.value = term
    await nextTick() // let the debounce watcher schedule its timeout
    vi.advanceTimersByTime(250)
    await nextTick() // let the debounced value propagate
  }

  it('does not filter until the debounce delay elapses', async () => {
    const { search, filteredLeagues } = setup()
    search.value = 'liga'
    await nextTick()
    // Timer hasn't fired yet — still the full list.
    expect(filteredLeagues.value).toHaveLength(LEAGUES.length)
    vi.advanceTimersByTime(250)
    await nextTick()
    expect(names(filteredLeagues.value)).toEqual(['Spanish La Liga'])
  })

  it('matches by league name, case-insensitively', async () => {
    const { search, filteredLeagues } = setup()
    await applySearch(search, 'FORMULA')
    expect(names(filteredLeagues.value)).toEqual(['Formula 1'])
  })

  it('matches by alternate name', async () => {
    const { search, filteredLeagues } = setup()
    await applySearch(search, 'f1')
    expect(names(filteredLeagues.value)).toEqual(['Formula 1'])
  })

  it('handles leagues with a null alternate name without crashing', async () => {
    const { search, filteredLeagues } = setup()
    await applySearch(search, 'nascar')
    expect(names(filteredLeagues.value)).toEqual(['NASCAR Cup Series'])
  })

  it('combines sport + search filters', async () => {
    const { search, selectedSport, filteredLeagues } = setup()
    selectedSport.value = 'Motorsport'
    await applySearch(search, 'nascar')
    expect(names(filteredLeagues.value)).toEqual(['NASCAR Cup Series'])
  })

  it('returns nothing when search and sport contradict each other', async () => {
    const { search, selectedSport, filteredLeagues } = setup()
    selectedSport.value = 'Soccer'
    await applySearch(search, 'f1') // F1 is Motorsport, not Soccer
    expect(filteredLeagues.value).toEqual([])
  })
})
