class MockGeolocation {
  private static position: GeolocationPosition;
  static watchPosition = (
    onSuccess: PositionCallback,
    onError?: PositionErrorCallback,
    options?: PositionOptions,
  ): number => {
    if (!MockGeolocation.position) {
      navigator.geolocation.getCurrentPosition(
        (position) => (MockGeolocation.position = position),
      );
    }
    const timeout = options?.timeout || 1000;
    return setInterval(() => onSuccess(MockGeolocation.generatePosition()), timeout);
  };

  static clearWatch = (id: number): void => {
    clearInterval(id);
  };

  private static generatePosition = (): GeolocationPosition => {
    const { coords, timestamp: prevTimestamp } = MockGeolocation.position;
    const timestamp = prevTimestamp + 1000;
    const generateNextDirection = () => withRandomSign(Math.random() / 100);
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
