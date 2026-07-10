import { ref, watch, type Ref } from 'vue'

// Returns a ref that mirrors `source`, but only after `delay` ms of quiet.
// The source (bound to the input) stays instant; filtering reads the debounced
// copy — so typing feels responsive while the heavy filter work is throttled.
export function useDebounced<T>(source: Ref<T>, delay = 250): Ref<T> {
  const debounced = ref(source.value) as Ref<T>
  let timeout: ReturnType<typeof setTimeout>

  watch(source, (value) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debounced.value = value
    }, delay)
  })

  return debounced
}
