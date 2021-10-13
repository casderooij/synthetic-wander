import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/svelte';
import streetData from '$lib/streetData-2';
import type { IPoint, IStreet, IUserData } from '$lib/interfaces';
import { squaredDistance, randomRange } from '$lib/utils/math';
import getCircle from '$lib/utils/axidraw/get-circle';

class Point {
  parent: Street;
  position: IPoint;
  neighbourPoints: Point[];
  otherPoint: Point;

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
    this.p1.otherPoint = this.p2;
    this.p2.otherPoint = this.p1;
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
const getStartingPoint = () =>
  streets.find((street) => street.id === '873a216f-dbc7-4b70-85f4-da05063b1cf0')
    .p1;

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

const getUniqueCharacters = (characters: string) => {
  let unique: string[] = [];

  for (let i = 0; i < characters.length; i++) {
    if (unique.includes(characters[i]) === false && characters[i] !== ' ') {
      unique.push(characters[i].toLowerCase());
    }
  }

  return unique;
};

// ??
const nextLetterIndex = (letterIndex: number, characterArray: string[]) => {
  const nextIndex = (letterIndex += 1);
  if (nextIndex > characterArray.length - 1) {
    console.log('DONE!');
  }
  return nextIndex;
};

const getAngle = (centerX: number, centerY: number, x: number, y: number) => {
  const dy = y - centerY;
  const dx = x - centerX;
  let theta = Math.atan2(dy, dx); // range (-PI, PI]
  // theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  if (theta < 0) theta = Math.PI * 2 + theta;
  return theta;
};

type RouteEvent =
  | { type: 'DONE' }
  | { type: 'NEXT_STEP' }
  | { type: 'START_PERSONAL_ROUTE' }
  | { type: 'STOP_PERSONAL_ROUTE' }
  | { type: 'START_ROUTE' }
  | { type: 'NEW_ROUTE' }
  | { type: 'SET_RADIUS'; radius: number }
  | { type: 'TOGGLE_JIGGLE_MODE' }
  | { type: 'SET_STARTING_POINT'; point: Point }
  | { type: 'SET_USER_DATA'; data: IUserData }
  | { type: 'FINISH' }
  | { type: 'USE_PRINTER'; data: boolean };

interface RouteContext {
  isDebug: boolean;
  streets: Street[];
  currentPoint: Point;
  previousPoint: Point;
  userData: IUserData;
  points: Point[][];
  maxPointsLength: number;
  routeLength: number;
  routeEnd: boolean;
  characterArray: string[];
  circlePoints: number[][];
  letterIndex: number;
  routeIndex: number;
  currentLetter: string;
  letters: string;
  usePrinter: boolean;
}

/**
 * Route machine
 */
const routeMachine = createMachine<RouteContext, RouteEvent>({
  id: 'route',
  initial: 'idle',
  context: {
    isDebug: true,
    streets,
    currentPoint: getStartingPoint(),
    previousPoint: undefined,
    userData: { name: '' },
    maxPointsLength: 0,
    points: [],
    routeLength: 0,
    routeEnd: false,
    characterArray: [],
    circlePoints: [],
    letterIndex: 0,
    routeIndex: 0,
    currentLetter: '',
    letters: '',
    usePrinter: false,
  },
  states: {
    idle: {
      initial: 'setup_random_route',
      states: {
        setup_random_route: {
          entry: assign(() => {
            return {
              points: [],
              currentPoint: getRandomStartingPoint(),
              maxPointsLength: randomRange(14, 26),
              routeLength: 0,
              streets: initializeData(),
            };
          }),
          after: {
            500: {
              actions: assign({
                points: (context) => [[context.currentPoint]],
              }),
            },
            1000: { target: 'move_to_other_point' },
          },
        },
        move_to_other_point: {
          entry: assign((context) => {
            const otherPoint = getOtherPoint(context.currentPoint);

            const newPointsArray = context.points;
            newPointsArray[newPointsArray.length - 1][1] = otherPoint;

            return {
              currentPoint: otherPoint,
              points: newPointsArray,
              routeLength:
                context.routeLength +
                squaredDistance(
                  [
                    context.currentPoint.position.x,
                    context.currentPoint.position.y,
                  ],
                  [otherPoint.position.x, otherPoint.position.y]
                ),
            };
          }),
          after: {
            500: [{ target: 'next_step' }],
          },
        },
        next_step: {
          always: [
            {
              target: 'choose_direction',
              cond: (context) =>
                context.points.length <= context.maxPointsLength &&
                context.currentPoint.neighbourPoints.length > 0,
            },
            { target: 'done' },
          ],
        },
        choose_direction: {
          entry: assign((context) => {
            if (context.currentPoint.neighbourPoints.length === 0) {
              send('DONE');
            }

            const neighbourPoint = getNeighbourPoint(context.currentPoint);

            return {
              points: [...context.points, [neighbourPoint]],
              currentPoint: neighbourPoint,
            };
          }),
          after: {
            500: { target: 'move_to_other_point' },
          },
          on: {
            DONE: { target: 'done' },
          },
        },
        done: {
          after: {
            10000: {
              target: 'setup_random_route',
            },
          },
        },
      },
      on: {
        START_PERSONAL_ROUTE: { target: 'personal_route' },
      },
    },
    personal_route: {
      id: 'personal_route',
      initial: 'setup_personal_route',
      states: {
        setup_personal_route: {
          entry: assign((_) => {
            const startingPoint = getStartingPoint();
            return {
              points: [[startingPoint]],
              currentPoint: startingPoint,
              routeLength: 0,
              userData: { name: '' },
              characterArray: [],
              letterIndex: 0,
              routeIndex: 0,
              usePrinter: false,
            };
          }),
          on: {
            SET_USER_DATA: {
              actions: assign({
                userData: (_, event) => event.data,
              }),
              target: 'run.setup',
            },
            SET_STARTING_POINT: {
              actions: assign({
                currentPoint: (_, event) => event.point,
                points: (_, event) => [[event.point]],
              }),
            },
            USE_PRINTER: {
              actions: assign({
                usePrinter: (_, event) => event.data,
              }),
            },
          },
        },
        run: {
          states: {
            setup: {
              entry: assign((context) => {
                const characters = 'abcdefghijklmnopqrstuvwxyz';
                const characterArray = characters.split('');

                const letterCircle = getCircle(
                  40,
                  characterArray.length,
                  50,
                  50
                );

                const name = context.userData.name
                  .split(' ')
                  .join('')
                  .toLowerCase();
                const letters = name.replace(/[^a-zA-Z]/g, '');

                // Get first letter using the letterIndex
                const currentLetter = letters[context.routeIndex];
                // Get the index corresponding with the currentLetter
                const letterIndex = characterArray.indexOf(currentLetter);

                return {
                  characterArray,
                  letterIndex,
                  currentLetter,
                  circlePoints: letterCircle,
                  letters: letters,
                  routeIndex: 0,
                };
              }),
              after: {
                1000: { target: 'choose_direction' },
              },
            },
            move_to_other_point: {
              entry: assign((context) => {
                const otherPoint = getOtherPoint(context.currentPoint);

                const newPointsArray = context.points;
                newPointsArray[newPointsArray.length - 1][1] = otherPoint;

                let nextRouteIndex = context.routeIndex;
                if (context.currentPoint.neighbourPoints.length > 1) {
                  nextRouteIndex++;
                }
                // if (nextRouteIndex > context.letters.length) {
                //   nextRouteIndex = 0;
                // }

                const currentLetter = context.letters[nextRouteIndex];
                const nextLetterIndex =
                  context.characterArray.indexOf(currentLetter);

                return {
                  routeIndex: nextRouteIndex,
                  letterIndex: nextLetterIndex,
                  currentLetter,
                  previousPoint: context.currentPoint,
                  currentPoint: otherPoint,
                  points: newPointsArray,
                  routeLength:
                    context.routeLength +
                    squaredDistance(
                      [
                        context.currentPoint.position.x,
                        context.currentPoint.position.y,
                      ],
                      [otherPoint.position.x, otherPoint.position.y]
                    ),
                };
              }),
              after: {
                500: [{ target: 'next_step' }],
              },
            },
            before_move_to_other_point: {
              always: [
                {
                  target: '#personal_route.done',
                  cond: (context) =>
                    context.routeIndex === context.letters.length - 1,
                },
                { target: 'move_to_other_point' },
              ],
            },
            next_step: {
              always: [
                {
                  target: 'choose_direction',
                  cond: (context) =>
                    !context.routeEnd &&
                    context.currentPoint.neighbourPoints.length > 0,
                },
                { target: '#personal_route.done' },
              ],
            },
            choose_direction: {
              entry: assign((context) => {
                if (context.currentPoint.neighbourPoints.length === 0) {
                  send('DONE');
                }

                if (context.currentPoint.neighbourPoints.length === 1) {
                  return {
                    points: [
                      ...context.points,
                      [context.currentPoint.neighbourPoints[0]],
                    ],
                    currentPoint: context.currentPoint.neighbourPoints[0],
                  };
                }

                const currentAngle = getAngle(
                  50,
                  50,
                  context.circlePoints[context.letterIndex][0],
                  context.circlePoints[context.letterIndex][1]
                );

                const ownAngle = getAngle(
                  context.currentPoint.position.x,
                  context.currentPoint.position.y,
                  context.currentPoint.otherPoint.position.x,
                  context.currentPoint.otherPoint.position.y
                );

                const neighbourAngles =
                  context.currentPoint.neighbourPoints.map((point) => {
                    const angle = getAngle(
                      point.position.x,
                      point.position.y,
                      point.otherPoint.position.x,
                      point.otherPoint.position.y
                    );
                    return {
                      point,
                      angle,
                      differenceBetweenAngles: Math.abs(angle - currentAngle),
                    };
                  });
                neighbourAngles.push({
                  point: context.currentPoint,
                  angle: ownAngle,
                  differenceBetweenAngles: Math.abs(ownAngle - currentAngle),
                });

                const sortedNeighbouringAngles = [...neighbourAngles].sort(
                  (a, b) =>
                    a.differenceBetweenAngles - b.differenceBetweenAngles
                );

                if (
                  context.previousPoint &&
                  context.previousPoint.parent.id ===
                    sortedNeighbouringAngles[0].point.parent.id
                ) {
                  return {
                    points: [
                      ...context.points,
                      [sortedNeighbouringAngles[1].point],
                    ],
                    currentPoint: sortedNeighbouringAngles[1].point,
                  };
                }

                return {
                  points: [
                    ...context.points,
                    [sortedNeighbouringAngles[0].point],
                  ],
                  currentPoint: sortedNeighbouringAngles[0].point,
                };
              }),
              after: {
                1000: { target: 'before_move_to_other_point' },
              },
              on: {
                DONE: { target: '#personal_route.done' },
              },
            },
          },
        },
        done: {
          on: {
            FINISH: { target: '#route.idle' },
          },
          after: {
            10000: { target: '#route.idle' },
          },
        },
      },
      on: {
        STOP_PERSONAL_ROUTE: { target: 'idle' },
      },
      // initial: 'personal_route.setup',
      // entry: assign((context) => {
      //   return {
      //     currentPoint: startingPoint,
      //     points: [],
      //   };
      // }),
      // states: {
      //   setup: {
      //     on: {
      //       SET_STARTING_POINT: {
      //         actions: assign({
      //           currentPoint: (_, event) => event.point,
      //         }),
      //       },
      //       SET_USER_DATA: {
      //         actions: assign({
      //           userData: (_, event) => event.data,
      //         }),
      //       },
      //       START_ROUTE: {
      //         target: 'personal_route.run',
      //       },
      //     },
      //   },
      //   run: {
      //     initial: 'personal_route.run.setup',
      //     states: {
      //       setup: {
      //         entry: assign({
      //           points: (context) => [[context.currentPoint]],
      //         }),
      //         after: {
      //           500: { target: 'personal_route.run.move_to_other_point' },
      //         },
      //       },
      //       move_to_other_point: {
      //         entry: assign((context) => {
      //           const otherPoint = getOtherPoint(context.currentPoint);

      //           const newPointsArray = context.points;
      //           newPointsArray[newPointsArray.length - 1][1] = otherPoint;

      //           return {
      //             currentPoint: otherPoint,
      //             points: newPointsArray,
      //             routeLength:
      //               context.routeLength +
      //               squaredDistance(
      //                 [
      //                   context.currentPoint.position.x,
      //                   context.currentPoint.position.y,
      //                 ],
      //                 [otherPoint.position.x, otherPoint.position.y]
      //               ),
      //           };
      //         }),
      //         // after: {
      //         //   500: [{ target: 'next_step' }],
      //         // },
      //       },
      //     },
      //   },
      // },
      // on: {
      //   SET_USER_DATA: {
      //     actions: assign({
      //       userData: (_, event) => event.data,
      //     }),
      //   },
      //   SET_STARTING_POINT: {
      //     actions: assign({
      //       currentPoint: (_, event) => event.point,
      //       startingPoint: (_, event) => event.point,
      //     }),
      //   },
      //   SET_RADIUS: {
      //     actions: assign({
      //       streets: (_, event) => initializeData(event.radius),
      //     }),
      //   },
      //   START_ROUTE: {
      //     target: 'run',
      //   },
      // },
    },
  },
});

const { state, send } = useMachine(routeMachine);

export { Point, Street, state, send };
