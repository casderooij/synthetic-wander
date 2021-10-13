<script lang="ts">
  import { state } from '$lib/route';
</script>

<g
  transform={`translate(${$state.context.currentPoint.position.x} ${$state.context.currentPoint.position.y})`}
>
  <circle class="current-point" r="5" />
</g>

<!-- {#if $state.matches('personal_route')}
  {#each $state.context.currentPoint.neighbourPoints as point}
    <path
      d={`M ${$state.context.currentPoint.position.x},${$state.context.currentPoint.position.y} ${point.position.x},${point.position.y}`}
    />
  {/each}

  <g
    transform={`translate(${$state.context.currentPoint.position.x} ${$state.context.currentPoint.position.y}) rotate(239)`}
  >
    <path class="wijzer" d={`M 0,0 30,0`} style="--angle: {angle}deg" />
  </g>
{/if} -->
<style>
  g {
    transition: transform 600ms ease-out;
  }
  .current-point {
    transform: scale(2);
    animation: pulse 3s infinite;
    fill: #ff5a5a;
    mix-blend-mode: multiply;
  }

  path {
    stroke: #cfcfcf;
    stroke-width: 1;
    mix-blend-mode: multiply;
  }

  .wijzer {
    stroke: red;
    mix-blend-mode: none;
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
