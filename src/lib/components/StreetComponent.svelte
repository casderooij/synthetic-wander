<script lang="ts">
  import { state, send } from '$lib/route';
  import type { Street as StreetClass } from '$lib/route';

  export let street: StreetClass;

  $: isSelected = $state.context.currentPoint.parent === street;

  function selectStartPoint() {
    send('SET_STARTING_POINT', { point: street.p1 });
  }
</script>

{#if $state.context.isDebug}
  <circle
    cx={street.p1.position.x}
    cy={street.p1.position.y}
    r="0.5"
    fill={isSelected ? 'red' : 'black'}
  />
{/if}

<circle
  class="selector"
  cx={street.p1.position.x}
  cy={street.p1.position.y}
  r="4"
  fill="transparent"
  stroke-width="0.5"
  on:click={selectStartPoint}
/>

{#if isSelected}
  <circle
    cx={street.p1.position.x}
    cy={street.p1.position.y}
    r="4"
    fill="transparent"
    stroke-width="0.5"
    stroke={isSelected ? 'red' : 'black'}
  />
{/if}

<style>
  .selector:hover {
    stroke: red;
  }
</style>
