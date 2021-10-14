<script context="module">
  export const ssr = false;
</script>

<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Map from '$lib/components/Map.svelte';
  import PlotterButtons from '$lib/components/PlotterButtons.svelte';

  // import { state } from '$lib/route';
  // $: console.log($state.value);
</script>

<div class="container">
  <!-- <PlotterButtons /> -->
  <Header />

  <Map />

  <Footer />
</div>

<style>
  .container {
    position: relative;
  }
</style>
