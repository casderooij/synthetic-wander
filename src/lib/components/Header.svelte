<script lang="ts">
  import type { IUserData } from '$lib/interfaces';
  import { state, send, Point } from '$lib/route';
  import LetterCircle from '$lib/components/LetterCircle.svelte';
  import { matches } from 'lodash';

  $: userData = $state.context.userData;

  function submitUserData() {
    send('SET_USER_DATA', { data: userData });
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
    {#if $state.matches('idle')}
      <button on:click={() => send('START_PERSONAL_ROUTE')}
        >Start new route</button
      >
    {/if}

    {#if $state.matches('personal_route')}
      <p
        on:click={() => send('STOP_PERSONAL_ROUTE')}
        class="user_input_stop_button"
      >
        stop
      </p>
    {/if}

    {#if $state.matches('personal_route.setup_personal_route')}
      <form on:submit|preventDefault={submitUserData} class="user_input_form">
        <div class="user_input_container">
          <label class="user_input_name_label" for="username"
            >Enter your name (minimal 5 characters)</label
          >
          <input
            class="user_input_name_input"
            id="username"
            name="username"
            type="text"
            bind:value={userData.name}
          />
        </div>

        <p>Select a starting point</p>

        <input type="submit" value="Start route" />
      </form>
    {/if}

    {#if $state.matches('personal_route.run')}
      <div class="letter_circle_container">
        <LetterCircle />
      </div>
    {/if}
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

    z-index: 2;
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

  .user_input_stop_button {
    color: #ff5a5a;
    font-size: 1.5rem;
    text-decoration: underline;
  }

  .user_input_form {
    margin-top: 3rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2rem;
    font-size: 1.5rem;
  }
  .user_input_container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }
  .user_input_name_input {
    border-width: 2px;
    padding: 0.4rem;
  }
  .user_input_name_input:focus {
    outline-color: #a5a8ff;
  }

  .letter_circle_container {
    position: relative;
    margin-top: 2rem;
    padding: 0.4rem;
    border: 2px solid;
    border-radius: 50%;
    background: white;
  }
  .letter_circle_container::before {
    content: '';
    position: absolute;
    z-index: -1;
    width: 80%;
    height: 1rem;
    top: 0.8rem;
    left: -10%;
    border: 2px solid;
    background: #fff;
    transform: rotate(-28deg);
  }
  .letter_circle_container::after {
    content: '';
    position: absolute;
    z-index: -1;
    width: 80%;
    height: 1rem;
    bottom: -0.6rem;
    left: 20%;
    border: 2px solid;
    background: #fff;
    transform: rotate(-3deg);
  }
</style>
