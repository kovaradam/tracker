export function requestWatchPosition(
  onSuccess: PositionCallback,
  onError?: PositionErrorCallback,
  options?: PositionOptions,
): (() => void) | undefined {
  let clear: ReturnType<typeof requestWatchPosition> = undefined;
  if (navigator.geolocation) {
    const id = navigator.geolocation.watchPosition(onSuccess, onError, options);
    clear = (): void => {
      navigator.geolocation.clearWatch(id);
    };
  } else {
    console.log('geolocation is not supported');
  }
  return clear;
}
