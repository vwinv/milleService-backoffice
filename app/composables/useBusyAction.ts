/**
 * Empêche les double-clics pendant une action async (API admin).
 */
export function useBusyAction() {
  const busy = ref(false)

  async function run<T>(fn: () => Promise<T>): Promise<T | undefined> {
    if (busy.value) return undefined
    busy.value = true
    try {
      return await fn()
    } finally {
      busy.value = false
    }
  }

  return { busy, run }
}
