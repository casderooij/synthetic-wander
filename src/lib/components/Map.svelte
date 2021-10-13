<script lang="ts">
  import StreetComponent from '$lib/components/StreetComponent.svelte';
  import Line from '$lib/components/Line.svelte';
  import CurrentPoint from '$lib/components/CurrentPoint.svelte';
  import Circle from '$lib/components/Circle.svelte';

  import { state } from '$lib/route';

  const width = 420;
  const height = 297;
</script>

<div>
  <svg viewBox={`0 0 ${width} ${height}`}>
    <g>
      {#each $state.context.streets as street}
        <StreetComponent {street} />
      {/each}
    </g>

    {#each $state.context.points as points (points)}
      {#if points.length > 1}
        <Circle point={points[0]} />
      {/if}
    {/each}

    <CurrentPoint />

    {#each $state.context.points as points (points)}
      {#if points.length > 1}
        <Line {points} />
      {/if}
    {/each}
  </svg>
  <img src="/woensel-west-crossings-horizontal.svg" alt="" />
</div>

<style>
  div {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
  }

  svg {
    position: relative;
    display: block;
    height: 100%;
  }

  img {
    position: absolute;
    display: block;
    pointer-events: none;
    max-width: 100%;
    height: 100%;
  }
</style>
