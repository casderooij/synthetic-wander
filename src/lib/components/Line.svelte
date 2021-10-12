<script lang="ts">
  import { state } from '$lib/route';

  $: path = `M ${$state.context.points.map(
    (point) => `${point.position.x},${point.position.y}`
  )}`;
</script>

<path
  d={path}
  stroke="#A5A8FF"
  fill="transparent"
  stroke-width="6"
  stroke-linecap="round"
  stroke-linejoin="round"
/>

<style>
  path {
    mix-blend-mode: multiply;
  }
</style>
