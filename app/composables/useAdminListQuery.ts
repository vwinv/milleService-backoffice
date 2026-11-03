export const ADMIN_LIST_PAGE_SIZE = 10

/** Recherche globale du header admin (filtrage local des listes). */
export function useAdminListSearch() {
  const search = useState('admin-list-search', () => '')

  function clearSearch() {
    search.value = ''
  }

  return { search, clearSearch }
}

function flattenSearchableValues(value: unknown, out: string[] = []): string[] {
  if (value == null) return out
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    const s = String(value).trim()
    if (s) out.push(s)
    return out
  }
  if (Array.isArray(value)) {
    for (const item of value) flattenSearchableValues(item, out)
    return out
  }
  if (typeof value === 'object') {
    for (const v of Object.values(value as Record<string, unknown>)) {
      flattenSearchableValues(v, out)
    }
  }
  return out
}

/** True si le terme apparaît dans n'importe quel champ (toutes colonnes / objets imbriqués). */
export function rowMatchesSearch(row: unknown, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase()
  if (!q) return true
  const haystack = flattenSearchableValues(row).join(' · ').toLowerCase()
  return haystack.includes(q)
}

export function filterRowsBySearch<T>(rows: T[], rawQuery: string): T[] {
  const q = rawQuery.trim()
  if (!q) return rows
  return rows.filter((row) => rowMatchesSearch(row, q))
}

export function paginateRows<T>(
  rows: T[],
  page: number,
  pageSize: number = ADMIN_LIST_PAGE_SIZE,
): { items: T[]; total: number; totalPages: number; page: number } {
  const total = rows.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  return {
    items: rows.slice(start, start + pageSize),
    total,
    totalPages,
    page: safePage,
  }
}

/**
 * Filtre + pagination locale pour une liste admin.
 * `source` = liste déjà chargée (éventuellement pré-filtrée par onglet).
 */
export function useAdminListQuery<T>(source: Ref<T[]> | ComputedRef<T[]>) {
  const { search } = useAdminListSearch()
  const page = ref(1)

  const filtered = computed(() => filterRowsBySearch(toValue(source), search.value))

  const total = computed(() => filtered.value.length)
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / ADMIN_LIST_PAGE_SIZE)))

  const pageItems = computed(() => {
    const start = (page.value - 1) * ADMIN_LIST_PAGE_SIZE
    return filtered.value.slice(start, start + ADMIN_LIST_PAGE_SIZE)
  })

  watch(search, () => {
    page.value = 1
  })

  watch(totalPages, (n) => {
    if (page.value > n) page.value = n
  })

  function goToPage(n: number) {
    page.value = Math.min(Math.max(1, n), totalPages.value)
  }

  return {
    search,
    page,
    pageSize: ADMIN_LIST_PAGE_SIZE,
    filtered,
    pageItems,
    total,
    totalPages,
    goToPage,
  }
}
