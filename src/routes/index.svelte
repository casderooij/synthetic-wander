<script context="module">
  export const ssr = false;
</script>

<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Map from '$lib/components/Map.svelte';

  import Plotter from '$lib/utils/axidraw/plot-coords';
  import getCircle from '$lib/utils/axidraw/get-circle';

  import { state } from '$lib/route';
  $: console.log($state.value);

  function checkPrintArea() {
    const PAPER_SIZE = {
      width: 160,
      height: 101,
    };

    const plotter = new Plotter();

    const paperBounds = [
      [0, 0],
      [PAPER_SIZE.width, 0],
      [PAPER_SIZE.width, PAPER_SIZE.height],
      [0, PAPER_SIZE.height],
      [0, 0],
    ];

    // plotter.coords = [paperBounds];

    const points = getCircle(
      20,
      30,
      PAPER_SIZE.width / 2,
      PAPER_SIZE.height / 2
    );
    plotter.coords = [points];
    plotter.print();
  }
</script>

<!-- <button on:click={checkPrintArea}>Check print area</button> -->

<div class="container">
  <Header />

  <!-- <UserInput /> -->
  <Map />

  <Footer />
</div>

<style>
  .container {
    position: relative;
  }
</style>
