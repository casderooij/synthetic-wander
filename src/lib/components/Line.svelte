<script lang="ts">
  import { draw, fade } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import type { Point } from '$lib/route';

  export let points: Point[];
</script>

<path
  in:draw={{ duration: 400, easing: cubicInOut }}
  out:fade={{ duration: 1000 }}
  d={`M ${points[0].position.x},${points[0].position.y}L${points[1].position.x},${points[1].position.y}`}
/>

<style>
  path {
    mix-blend-mode: multiply;
    stroke: #a5a8ff;
    fill: transparent;
    stroke-width: 6;
  }
</style>
