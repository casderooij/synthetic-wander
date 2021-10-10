<script lang="ts">
  import type { IUserData } from '$lib/interfaces';
  import { send } from '$lib/route';

  let userData: IUserData = { name: '', age: undefined };

  function handleSubmit() {
    console.log(userData);
    send('SET_USER_DATA', { data: userData });
  }
</script>

<div>
  <form on:submit|preventDefault={handleSubmit}>
    <input type="text" bind:value={userData.name} />
    <input type="number" bind:value={userData.age} />
    <input type="submit" value="send" />
  </form>
</div>
