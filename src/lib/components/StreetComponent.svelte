<script lang="ts">
  import { state, send } from '$lib/route';
  import type { Street as StreetClass } from '$lib/route';
  import { matches } from 'lodash';

  export let street: StreetClass;

  function selectStartPoint() {
    send('SET_STARTING_POINT', { point: street.p1 });
  }
</script>

{#if $state.matches('personal_route.setup_personal_route')}
  <g transform={`translate(${street.p1.position.x} ${street.p1.position.y})`}>
    <rect
      class="selector"
      width="8"
      height="8"
      x="-4"
      y="-4"
      fill="transparent"
      stroke-width="0.5"
      on:click={selectStartPoint}
    />
  </g>
{/if}

<style>
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
