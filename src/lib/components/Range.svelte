<script lang="ts">
  export let value = 0;
  export let min = 0;
  export let max = 1;
  export let step = 1;
  export let onChange: () => void;
</script>

<input type="range" {min} {max} {step} bind:value on:change={onChange} />

<style>
  input[type='text'],
  input[type='number'] {
    background: white;
    border: 1px solid black;
    padding: 0.25rem 0.5rem;
  }

  input[type='range'] {
    height: 29px;
    -webkit-appearance: none;
    margin: 10px 0;
    width: 100%;
  }
  input[type='range']:focus {
    outline: none;
  }
  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 6px;
    cursor: pointer;
    box-shadow: 0px 0px 1px #000000;
    background: #ffffff;
    border-radius: 0px;
    border: 1px solid #000000;
  }
  input[type='range']::-webkit-slider-thumb {
    box-shadow: 0px 0px 1px #000000;
    border: 1px solid #000000;
    height: 22px;
    width: 22px;
    border-radius: 22px;
    background: #ffffff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -9px;
  }
  input[type='range']:focus::-webkit-slider-runnable-track {
    background: #ffffff;
  }
  input[type='range']::-moz-range-track {
    width: 100%;
    height: 6px;
    cursor: pointer;
    box-shadow: 0px 0px 1px #000000;
    background: #ffffff;
    border-radius: 0px;
    border: 1px solid #000000;
  }
  input[type='range']::-moz-range-thumb {
    box-shadow: 0px 0px 1px #000000;
    border: 1px solid #000000;
    height: 22px;
    width: 22px;
    border-radius: 22px;
    background: #ffffff;
    cursor: pointer;
  }
  input[type='range']::-ms-track {
    width: 100%;
    height: 6px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type='range']::-ms-fill-lower {
    background: #ffffff;
    border: 1px solid #000000;
    border-radius: 0px;
    box-shadow: 0px 0px 1px #000000;
  }
  input[type='range']::-ms-fill-upper {
    background: #ffffff;
    border: 1px solid #000000;
    border-radius: 0px;
    box-shadow: 0px 0px 1px #000000;
  }
  input[type='range']::-ms-thumb {
    margin-top: 1px;
    box-shadow: 0px 0px 1px #000000;
    border: 1px solid #000000;
    height: 22px;
    width: 22px;
    border-radius: 22px;
    background: #ffffff;
    cursor: pointer;
  }
  input[type='range']:focus::-ms-fill-lower {
    background: #ffffff;
  }
  input[type='range']:focus::-ms-fill-upper {
    background: #ffffff;
  }
</style>
