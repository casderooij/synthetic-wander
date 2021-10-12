<script lang="ts">
  import { state, send } from '$lib/route';
  import type { Street as StreetClass } from '$lib/route';

  export let street: StreetClass;

  $: isSelected = $state.context.currentPoint.parent.id === street.id;

  function selectStartPoint() {
    send('SET_STARTING_POINT', { point: street.p1 });
  }
</script>

<g transform={`translate(${street.p1.position.x} ${street.p1.position.y})`}>
  <!-- {#if $state.context.isDebug}
    <circle r="0.5" fill={isSelected ? 'red' : 'black'} />
  {/if} -->

  <circle
    class="selector"
    r="3"
    fill="transparent"
    stroke-width="0.5"
    on:click={selectStartPoint}
  />

  <!-- {#if isSelected}
    <circle class="current-point" r="4" />
  {/if} -->
</g>

{#if isSelected}
  {#each street.p1.neighbourPoints as neighbourPoint}
    <path
      d={`M${street.p1.position.x} ${street.p1.position.y}L${neighbourPoint.position.x} ${neighbourPoint.position.y}`}
      stroke="black"
      stroke-width="0.5"
    />
  {/each}
{/if}

<style>
  .current-point {
    transform: scale(2);
    animation: pulse 3s infinite;
    fill: #ff5a5a;
  }

  .selector:hover {
    stroke: black;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.5);
    }

    70% {
      transform: scale(2);
    }

    100% {
      transform: scale(0.5);
    }
  }
</style>
