import { __DEV__ } from '../config';

const initPosition = {
  coords: { latitude: 50.101378516542226, longitude: 14.421355384713491 },
  timestamp: 1622966535918,
} as GeolocationPosition;

class MockGeolocation {
  private static position: GeolocationPosition;
  static watchPosition = (
    onSuccess: PositionCallback,
    onError?: PositionErrorCallback,
    options?: PositionOptions,
  ): number => {
    if (!MockGeolocation.position) {
      MockGeolocation.initPosition();
    }
    const timeout = options?.timeout || 1000;

    return setInterval(() => onSuccess(MockGeolocation.generatePosition()), timeout);
  };

  static clearWatch = (id: number): void => {
    clearInterval(id);
  };

  static initPosition = (): void => {
    if (__DEV__) {
      MockGeolocation.position = initPosition;
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => (MockGeolocation.position = position),
      );
    }
  };

  private static generatePosition = (): GeolocationPosition => {
    const { coords, timestamp: prevTimestamp } = MockGeolocation.position;
    const timestamp = prevTimestamp + 1000;
    const generateNextDirection = () => withRandomSign(Math.random() / 1000);
    const latitude = coords.latitude + generateNextDirection();
    const longitude = coords.longitude + generateNextDirection();
    const newPosition = {
      timestamp,
      coords: { latitude, longitude },
    } as unknown as GeolocationPosition;
    MockGeolocation.position = newPosition;

    return MockGeolocation.position;
  };
}

export default MockGeolocation;

function withRandomSign(input: number): number {
  const rand = Math.random();
  const sign = rand > 0.5 ? 1 : -1;
  return sign * input;
}
