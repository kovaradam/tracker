import { __DEV__ } from '../config';
import { Position } from '../db/model';
import MockGeolocation from './mock-geolocation';

export function getLatLngTuple(position: Position | null): L.LatLngTuple | null {
  if (position === null) {
    return null;
  }
  const { latitude, longitude } = position.coords;
  return [latitude, longitude];
}

const geolocation = __DEV__ ? MockGeolocation : navigator.geolocation;

export function watchPosition(
  onSuccess: PositionCallback,
  onError?: PositionErrorCallback,
  options?: PositionOptions,
): (() => void) | undefined {
  let clear: ReturnType<typeof watchPosition> = undefined;
  if (!geolocation) {
    if (onError) {
      const error = { message: 'Geolocation is not supported' };
      onError(error as GeolocationPositionError);
    }
    return;
  }
  const id = geolocation.watchPosition(onSuccess, onError, { timeout: 500 });
  clear = (): void => {
    geolocation.clearWatch(id);
  };
  return clear;
}
