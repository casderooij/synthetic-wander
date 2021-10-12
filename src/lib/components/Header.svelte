<script lang="ts">
  import { state, send, Point } from '$lib/route';

  let radius = 2;

  function startRoute() {
    send('START_ROUTE');
  }

  function setRadius() {
    send('SET_RADIUS', { radius });
  }

  function getUniqueNeighbouringStreets(currentPoint: Point) {
    const seen = {};
    seen[currentPoint.parent.name] = true;

    return currentPoint.neighbourPoints.filter((point) => {
      return seen.hasOwnProperty(point.parent.name)
        ? false
        : (seen[point.parent.name] = true);
    });
  }

  $: neighbouringStreets = (() => {
    if ($state.context.currentPoint.neighbourPoints.length === 0) return;
    const seen = {};
    seen[$state.context.currentPoint.parent.name] = true;

    return $state.context.currentPoint.neighbourPoints.filter((point) => {
      return seen.hasOwnProperty(point.parent.name)
        ? false
        : (seen[point.parent.name] = true);
    });
  })();
</script>

<header>
  <section class="section_left">
    <div class="section_left__current_street">
      <div class="current_street__icon" />
      <p>{$state.context.currentPoint.parent.name}</p>
    </div>
    <div class="section_left__neighbouring_streets">
      <div class="neighbouring_streets__icon" />
      {#if $state.context.currentPoint.neighbourPoints.length > 0}
        {#each neighbouringStreets as street}
          <p>{street.parent.name}</p>
        {/each}
      {/if}
    </div>
  </section>

  <section class="section_right">
    <button>Start new route</button>
  </section>
</header>

<style>
  header {
    padding: 1rem;
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    font-size: 2rem;
    width: 100%;

    gap: 1rem;
  }

  .section_left {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 3.4rem;
    flex: 1;
  }
  .section_left::before {
    content: '';
    position: absolute;
    z-index: -1;
    width: 36%;
    height: 1rem;
    top: 3.8rem;
    left: 2%;
    border: 2px solid;
    background: #fff;
    transform: rotate(3deg);
  }
  .section_left::after {
    content: '';
    position: absolute;
    z-index: -1;
    width: 50%;
    height: 1rem;
    top: 2.8rem;
    left: 20%;
    border: 2px solid;
    background: #fff;
    transform: rotate(-3deg);
  }
  .section_right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .section_left__current_street {
    display: flex;
    align-items: center;
  }

  .current_street__icon {
    background: #ff5a5a;
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
    margin-right: 0.5rem;
  }

  .section_left__neighbouring_streets {
    display: flex;
    align-items: center;
    height: 2.4rem;
  }

  .neighbouring_streets__icon {
    background: url('/crossing-icon.svg');
    background-position: center;
    background-size: contain;
    width: 1.8rem;
    height: 1.8rem;
    margin-right: 0.5rem;
  }
</style>
