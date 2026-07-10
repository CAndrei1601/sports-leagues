<script setup lang="ts">
import { ALL_SPORTS } from '@/composables/useLeagueFilters'

defineProps<{
  modelValue: string
  options: string[]
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="sport-filter">
    <select
      :value="modelValue"
      class="sport-filter__select"
      aria-label="Filter by sport type"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option :value="ALL_SPORTS">All sports</option>
      <option
        v-for="sport in options"
        :key="sport"
        :value="sport"
      >
        {{ sport }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
.sport-filter {
  flex: 0 0 auto;

  &__select {
    width: 100%;
    padding: $space-sm ($space-xl - $space-xs) $space-sm $space-md;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    color: $color-text;
    font-size: 0.95rem;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%239aa3c4' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right $space-md center;
    cursor: pointer;
    transition: border-color 0.15s ease;

    &:focus {
      outline: none;
      border-color: $color-accent;
    }
  }

  @media (min-width: $breakpoint-sm) {
    &__select {
      min-width: 180px;
    }
  }
}
</style>
