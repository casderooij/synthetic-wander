<script lang="ts">
  import { state, send } from '$lib/route';
  import { debounce } from 'lodash-es';
  import Range from '$lib/components/Range.svelte';

  let radius = 2;

  function startRoute() {
    send('START_ROUTE');
  }

  function setRadius() {
    send('SET_RADIUS', { radius });
  }
</script>

<header>
  <div>
    <p>Starting point: {$state.context.startingPoint.parent.name}</p>
    <p>
      Neighbouring streets: {$state.context.currentPoint.neighbourPoints.length}
    </p>
    {#if $state.context.isDebug}
      <p>State: {$state.value}</p>
    {/if}
  </div>

  <div>
    {#if $state.matches('idle')}
      <button on:click={startRoute}>start route</button>

      <Range
        min={2}
        max={20}
        step={1}
        bind:value={radius}
        onChange={debounce(setRadius, 250)}
      />
    {/if}
  </div>
</header>

<style>
  header {
    padding: 1rem 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
</style>
