<script lang="ts">
  import { state } from '$lib/route';

  $: path = `M ${$state.context.points.map(
    (point) => `${point.position.x},${point.position.y}`
  )}`;
</script>

<path d={path} stroke="red" fill="transparent" />
