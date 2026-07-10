<template>
  <div class="badge">
    <div
      v-if="pending"
      class="badge__placeholder"
    >
      <span
        class="badge__spinner"
        aria-label="Loading badge"
      />
    </div>

    <p
      v-else-if="error"
      class="badge__placeholder badge__placeholder--text"
    >
      Couldn't load badge.
    </p>

    <img
      v-else-if="url"
      :src="url"
      :alt="`${leagueName} season badge`"
      class="badge__img"
      loading="lazy"
    />

    <p
      v-else
      class="badge__placeholder badge__placeholder--text"
    >
      No badge available.
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  url: string | null
  pending: boolean
  error: boolean
  leagueName: string
}>()
</script>

<style scoped lang="scss">
.badge {
  $media-height: 140px;
  margin-top: $space-md;
  padding-top: $space-md;
  border-top: 1px solid $color-border;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(#{$media-height} + #{$space-md} + 1px);

  &__img {
    max-height: $media-height;
    object-fit: contain;
  }

  &__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;

    &--text {
      margin: 0;
      color: $color-text-muted;
      font-size: 0.85rem;
    }
  }

  &__spinner {
    width: 24px;
    height: 24px;
    border: 3px solid $color-border;
    border-top-color: $color-accent;
    border-radius: 50%;
    animation: badge-spin 0.7s linear infinite;
  }
}

@keyframes badge-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
