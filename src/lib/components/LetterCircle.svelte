<script lang="ts">
  import { state } from '$lib/route';
  import getCircle from '$lib/utils/axidraw/get-circle';

  $: circlePoints = getCircle(40, $state.context.characterArray.length, 50, 50);
  console.log($state.context.characterArray.length);
</script>

<svg viewBox="0 0 100 100">
  {#each circlePoints as point, index}
    {#if index < $state.context.characterArray.length}
      <text x={point[0] - 3} y={point[1] + 2.5}
        >{$state.context.characterArray[index]}</text
      >
    {/if}
  {/each}

  <circle cx="50" cy="50" r="2" />
  <path
    d={`M 50,50 ${circlePoints[$state.context.letterIndex][0]},${
      circlePoints[$state.context.letterIndex][1]
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
