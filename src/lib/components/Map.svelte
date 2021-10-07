<script lang="ts">
  import StreetComponent from '$lib/components/StreetComponent.svelte';

  import { state } from '$lib/route';

  const width = 297;
  const height = 420;
</script>

<div>
  <svg viewBox={`0 0 ${width} ${height}`}>
    <g>
      {#each $state.context.streets as street}
        <StreetComponent {street} />
      {/each}
    </g>
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
