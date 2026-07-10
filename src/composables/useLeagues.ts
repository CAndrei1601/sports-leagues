import { ref, shallowRef } from 'vue'
import { fetchAllLeagues } from '@/api/leaguesApi'
import type { League } from '@/types/league'

export function useLeagues() {
  const data = shallowRef<League[]>([])
  const pending = ref(false)
  const error = ref<Error | null>(null)

  async function refresh() {
    pending.value = true
    error.value = null
    try {
      data.value = await fetchAllLeagues()
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Unknown error')
    } finally {
      pending.value = false
    }
  }

  refresh()

  return { data, pending, error, refresh }
}
