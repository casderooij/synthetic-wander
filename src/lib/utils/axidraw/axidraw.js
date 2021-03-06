const API_URL = 'http://localhost:4242/v1';

class Axidraw {
  /**
   * Make axidraw bot draw a path consisting of multiple points. Coordinates
   * passed need to be in the range of [0, 100] (percent of drawing area).
   * @param {Array<array>} path  An array of points in form of [x, y]
   */
  async drawPath(path) {
    await this.setPenState({ state: 0 });

    for (let i = 0; i < path.length; i++) {
      const [x, y] = path[i];

      await this.setPenState({ x, y });

      if (i === 0) await this.setPenState({ state: 1 });
    }
  }

  /**
   * Set the state of the axidraw bot.
   * @param {Object} state  The state in ''application/x-www-form-urlencoded'
   *  encoding
   */
  async setPenState(state) {
    await fetch(`${API_URL}/pen`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    });
  }

  /**
   * Resets the axidraw bot motor.
   */
  async resetMotor() {
    await fetch(`${API_URL}/motors`, { method: 'DELETE' });
  }

  /**
   * Set pen state up and move to 0,0.
   */
  async parkPen() {
    await this.setPenState({ state: 0 });
    await this.setPenState({ x: 0, y: 0 });
  }

  async penUp() {
    await this.setPenState({ state: 0 });
  }

  async penDown() {
    await this.setPenState({ state: 1 });
  }

  async moveTo(x, y) {
    await this.setPenState({ x, y });
  }
}

export default async function () {
  const axidraw = new Axidraw();
  await axidraw.parkPen();
  return axidraw;
}
