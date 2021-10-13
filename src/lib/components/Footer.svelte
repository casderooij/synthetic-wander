<script lang="ts">
  import { state } from '$lib/route';
  import { randomRange } from '$lib/utils/math';
  import { tweened } from 'svelte/motion';

  let routeLength = tweened(Math.round($state.context.routeLength * 3.5), {
    duration: 500,
  });

  $: routeLength.set(Math.round($state.context.routeLength * 3.5));
</script>

<footer>
  <section class="street_list">
    {#each $state.context.points as points}
      <p style="padding-left: {randomRange(0, 40)}px">
        {points[0].parent.name}
      </p>
    {/each}
  </section>
  <section class="info">
    <p class="info__route-distance">
      Route distance: {$routeLength.toFixed(0)} m
    </p>
  </section>
</footer>

<style>
  footer {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 4rem;
    padding: 1rem;
    bottom: 0;
    font-size: 1.4rem;
    width: 100%;
    pointer-events: none;
  }

  .street_list {
    font-size: 1.2rem;
    margin-left: 10px;
  }

  .info {
    position: relative;
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-direction: row;
    margin-bottom: 2.4rem;
  }

  .info__route-distance::before {
    content: '';
    position: absolute;
    z-index: -1;
    width: 240px;
    height: 1rem;
    top: 2.3rem;
    left: 40px;
    border: 2px solid;
    background: #fff;
    transform: rotate(2deg);
  }
  .info__route-distance::after {
    content: '';
    position: absolute;
    z-index: -1;
    width: 140px;
    height: 1rem;
    top: 3rem;
    left: 20px;
    border: 2px solid;
    background: #fff;
    transform: rotate(-4deg);
  }
</style>
