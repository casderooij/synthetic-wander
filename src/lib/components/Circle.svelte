<script lang="ts">
  import { scale } from 'svelte/transition';
  import { randomRange } from '$lib/utils/math';
  import type { Point } from '$lib/route';

  export let point: Point;
</script>

<g transform={`translate(${point.position.x} ${point.position.y})`}>
  <circle
    in:scale={{ duration: 1200 }}
    out:scale={{ duration: 800 }}
    r={randomRange(2, 8)}
    style="--fill-color: hsl(0, 100%, {randomRange(
      70,
      95
    )}%); --animation-duration: {randomRange(3, 6)}s"
  />
</g>

<style>
  circle {
    transform: scale(2);
    /* animation: pulse var(--animation-duration) infinite; */
    fill: var(--fill-color);
  }

  /* @keyframes pulse {
    0% {
      transform: scale(0.5);
    }

    50% {
      transform: scale(2);
    }

    100% {
      transform: scale(0.5);
    }
  } */
</style>
