<script lang="ts">
  import { state } from '$lib/route';
</script>

<svg viewBox="0 0 100 100">
  {#each $state.context.circlePoints as point, index}
    {#if index < $state.context.characterArray.length}
      <text x={point[0] - 3} y={point[1] + 2.5}
        >{$state.context.characterArray[index]}</text
      >
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
  }

  text {
    font-size: 10px;
  }

  path {
    transform-origin: center;
    transform: scale(0.8);
    stroke: black;
  }
</style>
