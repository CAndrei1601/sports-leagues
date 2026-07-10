<template>
  <div
    class="state-message"
    role="status"
  >
    <p class="state-message__title">{{ title }}</p>
    <p
      v-if="description"
      class="state-message__desc"
    >
      {{ description }}
    </p>
    <button
      v-if="showRetry"
      class="state-message__retry"
      type="button"
      @click="$emit('retry')"
    >
      Try again
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  showRetry?: boolean
}>()

defineEmits<{ retry: [] }>()
</script>

<style scoped lang="scss">
.state-message {
  text-align: center;
  padding: $space-xl $space-md;
  color: $color-text-muted;

  &__title {
    margin: 0 0 $space-xs;
    font-size: 1.05rem;
    font-weight: 600;
    color: $color-text;
  }

  &__desc {
    margin: 0;
    font-size: 0.9rem;
  }

  &__retry {
    margin-top: $space-md;
    padding: $space-sm $space-lg;
    border: none;
    border-radius: $radius-sm;
    background: $color-accent;
    color: #fff;
    font-weight: 600;
    transition: background 0.15s ease;

    &:hover {
      background: $color-accent-hover;
    }
  }
}
</style>
