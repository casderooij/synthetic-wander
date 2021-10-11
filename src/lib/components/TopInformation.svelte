<script lang="ts">
  import { state, send, Point } from '$lib/route';
  import { debounce } from 'lodash-es';
  import Range from '$lib/components/Range.svelte';

  let radius = 2;

  function startRoute() {
    send('START_ROUTE');
  }

  function setRadius() {
    send('SET_RADIUS', { radius });
  }

  function getUniqueNeighbouringStreets(currentPoint: Point) {
    const seen = {};
    seen[currentPoint.parent.name] = true;

    return currentPoint.neighbourPoints.filter((point) => {
      return seen.hasOwnProperty(point.parent.name)
        ? false
        : (seen[point.parent.name] = true);
    });
  }
</script>

<header>
  <div>
    <p>Starting point: {$state.context.startingPoint.parent.name}</p>
    {#if getUniqueNeighbouringStreets($state.context.currentPoint).length > 0}
      <p>
        Neighbouring streets:
        {#each getUniqueNeighbouringStreets($state.context.currentPoint) as street}
          <p>{street.parent.name}</p>
        {/each}
      </p>
    {/if}
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
