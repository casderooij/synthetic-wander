<script lang="ts">
  import Plotter from '$lib/utils/axidraw/plot-coords';
  import getCircle from '$lib/utils/axidraw/get-circle';
  const PAPER_SIZE = {
    width: 148,
    height: 105,
  };

  const plotter = new Plotter();

  const marginWidth = 0;
  const paperBounds = [
    [marginWidth, 0],
    [PAPER_SIZE.width - marginWidth, 0],
    [PAPER_SIZE.width - marginWidth, PAPER_SIZE.height],
    [marginWidth, PAPER_SIZE.height],
    [marginWidth, 0],
  ];

  plotter.coords = [paperBounds];

  function checkPrintArea() {
    const points = getCircle(
      10,
      30,
      PAPER_SIZE.width / 2,
      PAPER_SIZE.height / 2
    );
    plotter.coords = [points];
    plotter.print();
  }

  async function park() {
    const plotter = new Plotter();
    await plotter.park();
  }

  async function move(x, y) {
    const plotter = new Plotter();
    await plotter.moveTo(x, y);
  }

  async function reset() {
    const plotter = new Plotter();
    await plotter.reset();
  }
</script>

<button on:click={checkPrintArea}>Check print area</button>
<button on:click={park}>park</button>
<button on:click={() => move(50, 50)}>move to center</button>
<button on:click={() => move(100, 100)}>move to bottom right</button>
<button on:click={reset}>reset</button>
