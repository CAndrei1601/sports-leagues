<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="search-bar">
    <span
      class="search-bar__icon"
      aria-hidden="true"
      >🔍</span
    >
    <input
      :value="modelValue"
      class="search-bar__input"
      type="search"
      placeholder="Search leagues by name…"
      aria-label="Search leagues by name"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1 1 260px;

  &__icon {
    position: absolute;
    left: $space-md;
    font-size: 0.9rem;
    opacity: 0.6;
    pointer-events: none;
  }

  &__input {
    width: 100%;
    padding: $space-sm $space-md $space-sm ($space-xl + $space-xs);
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    color: $color-text;
    font-size: 0.95rem;
    transition: border-color 0.15s ease;

    &::placeholder {
      color: $color-text-muted;
    }

    &:focus {
      outline: none;
      border-color: $color-accent;
    }
  }
}
</style>
