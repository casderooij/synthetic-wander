<script lang="ts">
  import type { IUserData } from '$lib/interfaces';
  import { send } from '$lib/route';

  let userData: IUserData = { name: '', age: undefined };

  function handleSubmit() {
    console.log(userData);
    send('SET_USER_DATA', { data: userData });
  }
</script>

<section>
  <form on:submit|preventDefault={handleSubmit}>
    <div>
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" bind:value={userData.name} />
    </div>
    <div>
      <label for="age">Age:</label>
      <input type="number" id="age" name="age" bind:value={userData.age} />
    </div>
    <input type="submit" value="send" />
  </form>
</section>

<style>
  section {
    display: inline-block;
    border: 1px solid black;
    padding: 1rem;
  }

  form {
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    gap: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.4rem;
  }

  input[type='submit'] {
    margin-top: 1rem;
  }
</style>
