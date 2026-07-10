<template>
  <article
    class="league-card"
    :class="{ 'league-card--open': isOpen }"
    role="button"
    tabindex="0"
    :aria-expanded="isOpen"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
  >
    <div class="league-card__head">
      <h2 class="league-card__title">{{ league.strLeague }}</h2>
      <span class="league-card__sport">{{ league.strSport }}</span>
    </div>

    <p
      v-if="league.strLeagueAlternate"
      class="league-card__alt"
    >
      {{ league.strLeagueAlternate }}
    </p>

    <span class="league-card__hint">
      {{ isOpen ? 'Hide badge' : 'Click to view badge' }}
    </span>

    <BadgeImage
      v-if="isOpen"
      :url="badgeUrl"
      :pending="pending"
      :error="!!error"
      :league-name="league.strLeague"
    />
  </article>
</template>

<script setup lang="ts">
import { useBadge } from '@/composables/useBadge'
import BadgeImage from '@/components/BadgeImage.vue'
import type { League } from '@/types/league'

const props = defineProps<{ league: League }>()

const { badgeUrl, isOpen, pending, error, toggle } = useBadge(props.league.idLeague)
</script>

<style scoped lang="scss">
.league-card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: $space-md;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.15s ease;

  &:hover {
    background: $color-surface-hover;
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid $color-accent;
    outline-offset: 2px;
  }

  &--open {
    border-color: $color-accent;
  }

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: $space-sm;
  }

  &__title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 600;
  }

  &__sport {
    flex: 0 0 auto;
    padding: 2px $space-sm;
    background: rgba($color-accent, 0.15);
    color: $color-accent-hover;
    border-radius: $radius-sm;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    white-space: nowrap;
  }

  &__alt {
    margin: $space-xs 0 0;
    color: $color-text-muted;
    font-size: 0.85rem;
  }

  &__hint {
    display: inline-block;
    margin-top: $space-sm;
    color: $color-text-muted;
    font-size: 0.78rem;
  }
}
</style>
