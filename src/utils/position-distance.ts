import { Position } from '../db/model';

function withDegToMeters(inputInDeg: number): number {
  const degToMeters = 111_139;
  return inputInDeg * degToMeters;
}

export function getPositionTupleDistance(
  a: [number, number],
  b: [number, number],
): number {
  const dx = b[0] - a[0];
  const dy = b[1] - b[1];
  const lengthInDeg = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  return withDegToMeters(lengthInDeg);
}
export function getPositionDistance(a: Position, b: Position): number {
  function getPositionTuple(position: Position): [number, number] {
    const { latitude, longitude } = position.coords;
    return [latitude, longitude];
  }
  return getPositionTupleDistance(getPositionTuple(a), getPositionTuple(b));
}
