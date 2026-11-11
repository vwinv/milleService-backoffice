<script setup lang="ts">
withDefaults(
  defineProps<{
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit'
    variant?: 'primary' | 'danger' | 'success' | 'ghost'
    block?: boolean
  }>(),
  {
    loading: false,
    disabled: false,
    type: 'button',
    variant: 'primary',
    block: false,
  },
)

const emit = defineEmits<{ click: [MouseEvent] }>()

const variantClass: Record<string, string> = {
  primary:
    'bg-[#020B51] text-white shadow-sm hover:bg-[#020B51]/90 disabled:bg-[#020B51]',
  danger:
    'bg-rose-600 text-white shadow-sm hover:bg-rose-700 disabled:bg-rose-600',
  success:
    'bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 disabled:bg-emerald-500',
  ghost:
    'bg-white text-slate-700 shadow-sm hover:bg-slate-50 disabled:bg-white',
}

function onClick(e: MouseEvent) {
  emit('click', e)
}
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
    :class="[variantClass[variant], block ? 'w-full' : '']"
    :disabled="disabled || loading"
    @click="onClick"
  >
    <span
      v-if="loading"
      class="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>
