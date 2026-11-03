<script setup lang="ts">
const props = defineProps<{
  page: number
  totalPages: number
  total: number
  pageSize: number
}>()

const emit = defineEmits<{
  'update:page': [page: number]
}>()

const from = computed(() => {
  if (props.total === 0) return 0
  return (props.page - 1) * props.pageSize + 1
})

const to = computed(() => Math.min(props.page * props.pageSize, props.total))
</script>

<template>
  <div
    v-if="total > 0"
    class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-600"
  >
    <p>
      {{ from }}–{{ to }} sur {{ total }}
    </p>
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="rounded-full border border-slate-200 px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40"
        :disabled="page <= 1"
        @click="emit('update:page', page - 1)"
      >
        Précédent
      </button>
      <span class="min-w-[4.5rem] text-center font-medium text-slate-800">
        {{ page }} / {{ totalPages }}
      </span>
      <button
        type="button"
        class="rounded-full border border-slate-200 px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40"
        :disabled="page >= totalPages"
        @click="emit('update:page', page + 1)"
      >
        Suivant
      </button>
    </div>
  </div>
</template>
