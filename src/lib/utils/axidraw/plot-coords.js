import createAxidraw from './axidraw';
import ProgressBar from './progress-bar';
import { renderSVGPaths } from './svg-tools';

const BOT_SCALE = {
  ratio: 6400 / 4040,
  factor: 1.6,
  offset: 0,
};

export default class Plotter {
  constructor(coords = []) {
    // this.svgContainer = document.createElement('svg');
    // this.progressBar = new ProgressBar(document.body);
    this.coords = coords;

    this.shouldAbortPrinting = false;
  }

  set coords(coords) {
    this._coords = coords;

    // this.svgContainer.innerHTML = '';

    this.svgPaths = renderSVGPaths(coords, { renderAs: 'nodes' });
    this.svgPaths.forEach((path) => {
      // this.svgContainer.appendChild(path);
    });
  }

  setAnimatedCoords(coords) {
    this._coords = coords;
    this.svgPaths = renderSVGPaths(coords, { renderAs: 'nodes' });
    this.svgPaths.forEach((path, index) => {
      // const oldPath = this.svgContainer.querySelector(
      //   `path:nth-child(${index + 1})`
      // );
      // if (!oldPath) {
      //   this.svgContainer.appendChild(path);
      //   return;
      // }
      // oldPath.setAttribute('d', path.getAttribute('d'));
    });
  }

  abort() {
    const response = window.confirm('This will abort the printing!');
    this.shouldAbortPrinting = response;
  }

  async moveTo(x, y) {
    if (!this.axidraw) {
      this.axidraw = await createAxidraw();
    }

    await this.axidraw.moveTo(x, y);
  }

  async park() {
    if (!this.axidraw) {
      this.axidraw = await createAxidraw();
    }

    await this.axidraw.parkPen();
  }

  async reset() {
    if (!this.axidraw) {
      this.axidraw = await createAxidraw();
    }

    await this.axidraw.resetMotor();
  }

  async penDown() {
    if (!this.axidraw) {
      this.axidraw = await createAxidraw();
    }

    await this.axidraw.penDown();
  }

  async penUp() {
    if (!this.axidraw) {
      this.axidraw = await createAxidraw();
    }

    await this.axidraw.penUp();
  }

  async print() {
    if (!this.axidraw) {
      this.axidraw = await createAxidraw();
    }

    this.svgPaths.forEach((path) => {
      path.setAttribute('class', 'pending');
    });

    for (let i = 0; i < this._coords.length; i++) {
      if (this.shouldAbortPrinting) {
        i = this._coords.length;
      }

      const line = this._coords[i];
      const path = this.svgPaths[i];

      path.setAttribute('class', 'current');

      const relativeLine = line.map((p) => [
        p[0] / BOT_SCALE.factor + BOT_SCALE.offset,
        (p[1] / BOT_SCALE.factor) * BOT_SCALE.ratio,
      ]);

      await this.axidraw.drawPath(relativeLine);
      path.removeAttribute('class');
      // this.progressBar.progress = i / (this._coords.length - 1);
    }

    // await this.axidraw.parkPen();
  }
}
