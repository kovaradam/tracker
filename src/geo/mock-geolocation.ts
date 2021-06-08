import { Position } from '../db/model';
import { getLatLngTuple } from './utils';

const initPosition = {
  coords: { latitude: 50.101378516542226, longitude: 14.421355384713491, heading: 0 },
  timestamp: 1622966535918,
} as Position;

class MockGeolocation {
  private static positions: Position[] = [];

  static watchPosition = (
    onSuccess: PositionCallback,
    onError?: PositionErrorCallback,
    options?: PositionOptions,
  ): number => {
    if (!MockGeolocation.position) {
      MockGeolocation.initPosition();
    }
    const timeout = options?.timeout || 1000;

    return setInterval(
      () => onSuccess(MockGeolocation.generatePosition() as GeolocationPosition),
      timeout,
    );
  };

  static clearWatch = (id: number): void => {
    clearInterval(id);
  };

  static addPosition = (position: Position): void => {
    MockGeolocation.positions.push(position);
  };

  static get position(): Position {
    const positionsLength = MockGeolocation.positions.length;
    if (positionsLength === 0) {
      MockGeolocation.initPosition();
    }
    return MockGeolocation.positions[positionsLength - 1];
  }

  static initPosition = (): void => {
    MockGeolocation.addPosition(initPosition);
  };

  private static generatePosition = (): Position => {
    const { coords, timestamp: prevTimestamp } = MockGeolocation.position;
    const timestamp = prevTimestamp + 1000;

    const generateNextDirection = (): number => withRandomSign(Math.random() / 1000);
    const latitude = coords.latitude + generateNextDirection();
    const longitude = coords.longitude + generateNextDirection();

    const newPosition = {
      timestamp,
      coords: { latitude, longitude, heading: 0 },
    };

    const heading =
      getHeadingFromPositions([...MockGeolocation.positions, newPosition as Position]) ??
      0;
    newPosition.coords.heading = heading;

    MockGeolocation.addPosition(newPosition as Position);

    return MockGeolocation.position;
  };
}

export default MockGeolocation;

function withRandomSign(input: number): number {
  const rand = Math.random();
  const sign = rand > 0.5 ? 1 : -1;
  return sign * input;
}

function getHeadingFromPositions(positions: Position[]): number | null {
  const errorValue = null;
  const pathPositionsLength = positions.length || 0;
  if (pathPositionsLength < 2) {
    return errorValue;
  }
  const lastTwoPositions = [
    positions[pathPositionsLength - 2],
    positions[pathPositionsLength - 1],
  ];

  const positionTuples = lastTwoPositions
    .map(getLatLngTuple)
    .filter((tuple) => tuple !== null);

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const dx = positionTuples[0]![0] - positionTuples[1]![0];
  const dy = positionTuples[0]![1] - positionTuples[1]![1];
  if (dx === 0) {
    return errorValue;
  }
  const degrees = (Math.atan(Math.abs(dy / dx)) * 180) / Math.PI + 180;

  if (dx < 0 && dy >= 0) {
    return 180 - degrees;
  } else if (dx < 0 && dy < 0) {
    return degrees + 180;
  } else if (dx >= 0 && dy < 0) {
    return -degrees;
  } else {
    return degrees;
  }
}
