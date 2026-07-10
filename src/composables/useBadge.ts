import { ref } from 'vue'
import { fetchSeasonBadges, getFirstBadgeUrl } from '@/api/leaguesApi'

// Per-league badge loader. Toggling closes an already-open badge; the api layer
// handles the actual caching, so re-opening is instant.
export function useBadge(leagueId: string) {
  const badgeUrl = ref<string | null>(null)
  const isOpen = ref(false)
  const pending = ref(false)
  const error = ref<Error | null>(null)

  async function toggle() {
    if (isOpen.value) {
      isOpen.value = false
      return
    }

    isOpen.value = true

    // Already resolved once — just reveal it again.
    if (badgeUrl.value !== null || error.value) return

    pending.value = true
    try {
      const seasons = await fetchSeasonBadges(leagueId)
      badgeUrl.value = getFirstBadgeUrl(seasons)
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
    } finally {
      pending.value = false
    }
  }

  return { badgeUrl, isOpen, pending, error, toggle }
}
