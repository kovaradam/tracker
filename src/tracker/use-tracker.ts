import { useCallback, useEffect } from 'react';

import { atom, useAtom } from 'jotai';

import { Position } from '../db/model';
import useLocationWatcher from '../geo/use-location-watcher';
import { CurrentPath, useCurrentPath } from './use-current-path';

type TrackerState = {
  isTracking: boolean;
  position: Position | null;
};

const trackerState = atom<TrackerState>({ isTracking: false, position: null });

type UseTrackerReturnType = [
  position: Position | null,
  tracking: {
    start: () => void;
    end: () => void;
    isTracking: boolean;
    currentPath: CurrentPath;
  },
];

export function useTracker(): UseTrackerReturnType {
  const [state, setState] = useAtom(trackerState);
  const [subscribe, { unsubscribeCurrent, error }] = useLocationWatcher();
  const [currentPath, updateCurrentPath] = useCurrentPath();

  const start = useCallback(() => {
    setState((prev) => ({ ...prev, isTracking: true }));
    subscribe((position) => {
      const newPosition = getPositionCopy(position);
      updateCurrentPath(newPosition);
      setState((prev) => ({ ...prev, position: newPosition }));
    });
  }, [setState, subscribe, updateCurrentPath]);

  const end = useCallback(() => {
    setState((prev) => ({ ...prev, isTracking: false }));
    if (unsubscribeCurrent) {
      unsubscribeCurrent();
    }
  }, [setState, unsubscribeCurrent]);

  useEffect(() => {
    if (error) {
      end();
    }
  }, [error, end]);

  return [state.position, { start, end, isTracking: state.isTracking, currentPath }];
}

function getPositionCopy(position: GeolocationPosition): Position {
  const newPosition: Position = {
    coords: {
      heading: position.coords.heading,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude,
    },
    timestamp: position.timestamp,
  };
  return newPosition;
}
