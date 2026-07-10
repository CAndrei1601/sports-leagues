import type { AllLeaguesResponse, League, Season, SeasonsResponse } from '@/types/league'

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3'
const BADGE_CACHE_KEY = 'sports-leagues:badge-cache'

// --- Leagues cache -----------------------------------------------------------
// The full league list never changes during a session, so we fetch it once and
// reuse the same in-flight promise to dedupe concurrent callers.
let leaguesPromise: Promise<League[]> | null = null

export function fetchAllLeagues(): Promise<League[]> {
  if (!leaguesPromise) {
    leaguesPromise = fetch(`${BASE_URL}/all_leagues.php`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json() as Promise<AllLeaguesResponse>
      })
      .then((data) => data.leagues ?? [])
      .catch((err) => {
        // Reset so a later retry can attempt the request again.
        leaguesPromise = null
        throw err
      })
  }
  return leaguesPromise
}

// --- Badge cache -------------------------------------------------------------
// Badges are cached per league id, in memory + sessionStorage so repeat clicks
// (and page refreshes within the session) never re-hit the network.
const badgeCache = new Map<string, Season[]>(loadBadgeCache())

function loadBadgeCache(): [string, Season[]][] {
  try {
    const raw = sessionStorage.getItem(BADGE_CACHE_KEY)
    return raw ? (JSON.parse(raw) as [string, Season[]][]) : []
  } catch {
    return []
  }
}

function persistBadgeCache(): void {
  try {
    sessionStorage.setItem(BADGE_CACHE_KEY, JSON.stringify([...badgeCache.entries()]))
  } catch {
    // sessionStorage may be unavailable (private mode / quota) — ignore.
  }
}

export async function fetchSeasonBadges(leagueId: string): Promise<Season[]> {
  const cached = badgeCache.get(leagueId)
  if (cached) return cached

  const res = await fetch(
    `${BASE_URL}/search_all_seasons.php?badge=1&id=${encodeURIComponent(leagueId)}`,
  )
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)

  const data = (await res.json()) as SeasonsResponse
  const seasons = data.seasons ?? []
  badgeCache.set(leagueId, seasons)
  persistBadgeCache()
  return seasons
}

export function getFirstBadgeUrl(seasons: Season[]): string | null {
  return seasons.find((s) => s.strBadge)?.strBadge ?? null
}
