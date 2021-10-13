<script lang="ts">
  import { state } from '$lib/route';
</script>

<svg viewBox="0 0 100 100">
  {#each $state.context.circlePoints as point, index}
    {#if index < $state.context.characterArray.length}
      {#if index === $state.context.letterIndex}
        <text x={point[0] - 2} y={point[1] + 2} fill="#ff5a5a"
          >{$state.context.characterArray[index]}</text
        >
      {:else}
        <text x={point[0] - 2} y={point[1] + 2} fill="#2a2a2a"
          >{$state.context.characterArray[index]}</text
        >
      {/if}
    {/if}
  {/each}

  <circle cx="50" cy="50" r="2" />
  <path
    d={`M 50,50 ${$state.context.circlePoints[$state.context.letterIndex][0]},${
      $state.context.circlePoints[$state.context.letterIndex][1]
    }`}
  />
</svg>

<style>
  svg {
    width: 200px;
    display: block;
    transform-origin: center;
    transform: scale(1.2);
  }

  text {
    font-size: 7px;
  }

  path {
    transform-origin: center;
    transform: scale(0.9);
    stroke: #2a2a2a;
  }
  circle {
    fill: #2a2a2a;
  }
</style>
