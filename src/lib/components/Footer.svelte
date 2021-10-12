<script lang="ts">
  import { state } from '$lib/route';
  import { tweened } from 'svelte/motion';

  let routeLength = tweened(Math.round($state.context.routeLength * 3.5), {
    duration: 500,
  });

  $: routeLength.set(Math.round($state.context.routeLength * 3.5));
</script>

<footer>
  <section class="info">
    <p>Route distance: {$routeLength.toFixed(0)} m</p>
  </section>
</footer>

<style>
  footer {
    position: absolute;
    padding: 1rem;
    bottom: 0;
    font-size: 2rem;
    width: 100%;
  }

  .info {
    position: relative;
    display: flex;
    flex-direction: column;
    margin-bottom: 2.4rem;
  }
  .info::before {
    content: '';
    position: absolute;
    z-index: -1;
    width: 20%;
    height: 1rem;
    top: 2.8rem;
    left: 2%;
    border: 2px solid black;
    background: #fff;
    transform: rotate(2deg);
  }
  .info::after {
    content: '';
    position: absolute;
    z-index: -1;
    width: 30%;
    height: 1rem;
    top: 3.2rem;
    left: 8%;
    border: 2px solid black;
    background: #fff;
    transform: rotate(-4deg);
  }
</style>
