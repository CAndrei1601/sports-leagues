<template>
  <div class="app">
    <header class="app__header">
      <h1 class="app__title">Sports Leagues</h1>
      <p class="app__subtitle">
        Browse leagues, filter by name or sport, and tap a league to reveal its season badge.
      </p>
    </header>

    <main class="app__main">
      <LeagueList />
    </main>
  </div>
</template>

<script setup lang="ts">
import LeagueList from '@/components/LeagueList.vue'
</script>

<style scoped lang="scss">
.app {
  max-width: 1100px;
  margin: 0 auto;
  padding: $space-lg $space-md $space-xl;

  &__header {
    margin-bottom: $space-lg;
  }

  &__title {
    margin: 0;
    font-size: 1.9rem;
    font-weight: 700;
  }

  &__subtitle {
    margin: $space-xs 0 0;
    color: $color-text-muted;
    font-size: 0.95rem;
    max-width: 60ch;
  }

  @media (min-width: $breakpoint-md) {
    padding: $space-xl $space-lg;
  }
}
</style>
