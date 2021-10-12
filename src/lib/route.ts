import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/svelte';
import streetData from '$lib/streetData';
import type { IPoint, IStreet, IUserData } from '$lib/interfaces';
import { squaredDistance, randomRange } from '$lib/utils/math';

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

/**
 * Initialize all streets
 */
const streets = initializeData();

/**
 * Get the startingPoint located at Tante Netty
 */
const startingPoint = streets.find(
  (street) => street.id === '873a216f-dbc7-4b70-85f4-da05063b1cf0'
).p1;

/**
 * Random point from streets array
 * @returns Point
 */
const getRandomStartingPoint = () =>
  streets[randomRange(0, streets.length - 1)].p1;

/**
 * Get the other point from the street
 * @param currentPoint
 * @returns Point
 */
const getOtherPoint = (currentPoint: Point) => {
  const p1 = currentPoint.parent.p1;
  const p2 = currentPoint.parent.p2;
  if (
    currentPoint.position.x === p1.position.x &&
    currentPoint.position.y === p1.position.y
  ) {
    return p2;
  } else {
    return p1;
  }
};

/**
 * Get random point from neighbouring points
 * @param currentPoint
 * @returns Point
 */
const getNeighbourPoint = (currentPoint: Point) => {
  return currentPoint.neighbourPoints[
    randomRange(0, currentPoint.neighbourPoints.length - 1)
  ];
};

type RouteEvent =
  | { type: 'NEW_ROUTE' }
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
  points: Point[];
  maxPointsLength: number;
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
    maxPointsLength: 0,
    points: [],
  },
  states: {
    idle: {
      initial: 'random_route',
      states: {
        random_route: {
          entry: assign({
            startingPoint: getRandomStartingPoint(),
            maxPointsLength: randomRange(14, 26),
          }),
          after: {
            300: {
              actions: assign({ points: (context) => [context.currentPoint] }),
            },
            1000: { target: 'move_to_other_point' },
          },
        },
        move_to_other_point: {
          entry: assign({
            points: (context) => [
              ...context.points,
              getOtherPoint(context.currentPoint),
            ],
          }),
          after: {
            100: {
              actions: assign({
                currentPoint: (context) =>
                  context.points[context.points.length - 1],
              }),
            },
            500: {
              target: 'choose_direction',
              cond: (context) =>
                context.points.length <= context.maxPointsLength,
            },
          },
        },
        choose_direction: {
          entry: assign({
            currentPoint: (context) => getNeighbourPoint(context.currentPoint),
          }),
          after: {
            500: { target: 'move_to_other_point' },
          },
        },
      },
    },
    setup: {
      on: {
        SET_USER_DATA: {
          actions: assign({
            userData: (_, event) => event.data,
          }),
        },
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
    run: {},
    finish: {},
  },
});

const { state, send } = useMachine(routeMachine);

export { Point, Street, state, send };
