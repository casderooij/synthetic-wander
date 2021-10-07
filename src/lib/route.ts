import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/svelte';
import streetData from '$lib/streetData';
import type { IPoint, IStreet } from '$lib/interfaces';
import { squaredDistance } from '$lib/utils/math';

class Point {
  parent: Street;
  position: IPoint;
  neighbourPoints: Point[];

  constructor(parent: Street, position: IPoint) {
    this.parent = parent;
    this.position = position;
    this.neighbourPoints = [];
  }

  findNeighbourPoints(points: Point[], radius: number) {
    points.forEach((point) => {
      if (point === this || point.parent === this.parent) return;

      if (
        squaredDistance(
          [this.position.x, this.position.y],
          [point.position.x, point.position.y]
        ) < radius
      ) {
        this.neighbourPoints.push(point);
      }
    });
  }
}

class Street {
  id: string;
  name: string;
  p1: Point;
  p2: Point;

  constructor(data: IStreet) {
    this.id = data.id;
    this.name = data.name;
    this.p1 = new Point(this, data.p1);
    this.p2 = new Point(this, data.p2);
  }
}

/**
 * Create array of Street classes
 * @returns Array of Street classes
 */
const createStreetArray = () => {
  return streetData.map((streetInfo) => new Street(streetInfo));
};

/**
 * Initialize all data for route creation
 * All points check for their neighbouring points
 * @returns Array of street classes
 */
const initializeData = () => {
  const streets = createStreetArray();

  const pointArray: Point[] = streets.flatMap((street) => [
    street.p1,
    street.p2,
  ]);

  // All points check for neighbouring points
  pointArray.forEach((point) => point.findNeighbourPoints(pointArray, 2));

  return streets;
};

const streets = initializeData();

const startingPoint = streets.find(
  (street) => street.id === '873a216f-dbc7-4b70-85f4-da05063b1cf0'
).p1;

type RouteEvent =
  | { type: 'SET_RADIUS'; radius: number }
  | { type: 'SET_STARTING_POINT'; point: Point };

interface RouteContext {
  isDebug: boolean;
  streets: Street[];
  startingPoint: Point;
  currentPoint: Point;
}

const routeMachine = createMachine<RouteContext, RouteEvent>({
  key: 'route',
  initial: 'idle',
  context: {
    isDebug: true,
    streets,
    startingPoint: startingPoint,
    currentPoint: startingPoint,
  },
  states: {
    idle: {
      on: {
        SET_STARTING_POINT: {
          actions: assign({
            currentPoint: (_, event) => event.point,
            startingPoint: (_, event) => event.point,
          }),
        },
      },
    },
    initializeData: {
      // entry: Initialize data
      // on: SET_RADIUS: Initialize data with given radius
    },
    selectStartPoint: {
      // Select the starting point of the route
      // on: SET_STARTING_POINT: set current point
    },
  },
});

const { state, send } = useMachine(routeMachine);

export { Point, Street, state, send };
