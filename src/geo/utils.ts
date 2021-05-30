import { Position } from '../db/model';

export function getLatLngTuple(position: Position | null): L.LatLngTuple | null {
  if (position === null) {
    return null;
  }
  const { latitude, longitude } = position.coords;
  return [latitude, longitude];
}

export function watchPosition(
  onSuccess: PositionCallback,
  onError?: PositionErrorCallback,
  options?: PositionOptions,
): (() => void) | undefined {
  let clear: ReturnType<typeof watchPosition> = undefined;
  if (navigator.geolocation) {
    const id = navigator.geolocation.watchPosition(onSuccess, onError, options);
    clear = (): void => {
      navigator.geolocation.clearWatch(id);
    };
  } else {
    if (onError) {
      const error = { message: 'geolocation is not supported' };
      onError(error as GeolocationPositionError);
    }
  }
  return clear;
}
