<script lang="ts">
  import StreetComponent from '$lib/components/StreetComponent.svelte';
  import Line from '$lib/components/Line.svelte';
  import CurrentPoint from '$lib/components/CurrentPoint.svelte';
  import Circle from '$lib/components/Circle.svelte';

  import { state } from '$lib/route';

  const width = 297;
  const height = 420;

  $: console.log($state);
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
  <img src="/woensel-west-crossings.svg" alt="" />
</div>

<style>
  div {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  img {
    position: absolute;
    display: block;
    width: 50%;
    pointer-events: none;
  }

  svg {
    position: relative;
    display: block;
    width: 50%;
  }
</style>
