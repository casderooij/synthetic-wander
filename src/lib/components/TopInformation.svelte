<script lang="ts">
  import { state } from '$lib/route';
</script>

<p>Starting point: {$state.context.startingPoint.parent.name}</p>
{#if $state.context.isDebug}
  <p>State: {$state.value}</p>
{/if}
