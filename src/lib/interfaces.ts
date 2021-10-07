export interface Size {
  width: number;
  height: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IStreet {
  id: string;
  name: string;
  p1: IPoint;
  p2: IPoint;
  isDeadEnd?: boolean;
}
