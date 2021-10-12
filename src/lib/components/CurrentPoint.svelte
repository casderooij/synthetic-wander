<script lang="ts">
  import { state } from '$lib/route';
</script>

<g
  transform={`translate(${$state.context.currentPoint.position.x} ${$state.context.currentPoint.position.y})`}
>
  <circle class="current-point" r="5" />
</g>

<style>
  g {
    transition: transform 600ms ease-out;
  }
  .current-point {
    transform: scale(2);
    animation: pulse 3s infinite;
    fill: #ff5a5a;
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
