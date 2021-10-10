import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/svelte';
import streetData from '$lib/streetData';
import type { IPoint, IStreet, IUserData } from '$lib/interfaces';
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
      if (point === this || point.parent.id === this.parent.id) return;

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
const initializeData = (radius = 2) => {
  const streets = createStreetArray();

  const pointArray: Point[] = streets.flatMap((street) => [
    street.p1,
    street.p2,
  ]);

  // All points check for neighbouring points
  pointArray.forEach((point) => point.findNeighbourPoints(pointArray, radius));

  return streets;
};

const streets = initializeData();
console.log(
  streets.find((street) => street.id === 'ec962c58-6311-434d-87c2-bf969e3b553f')
);

const startingPoint = streets.find(
  (street) => street.id === '873a216f-dbc7-4b70-85f4-da05063b1cf0'
).p1;

type RouteEvent =
  | { type: 'SET_RADIUS'; radius: number }
  | { type: 'SET_STARTING_POINT'; point: Point }
  | { type: 'SET_USER_DATA'; data: IUserData }
  | { type: 'START_ROUTE' };

interface RouteContext {
  isDebug: boolean;
  streets: Street[];
  startingPoint: Point;
  currentPoint: Point;
  userData?: IUserData;
}

/**
 * Route machine
 */
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
        SET_RADIUS: {
          actions: assign({
            streets: (_, event) => initializeData(event.radius),
          }),
        },
        START_ROUTE: {
          target: 'run',
        },
      },
    },
    input: {
      on: {
        SET_USER_DATA: {
          actions: assign({
            userData: (_, event) => event.data,
          }),
        },
      },
    },
    run: {},
  },
});

const { state, send } = useMachine(routeMachine);

export { Point, Street, state, send };
