import { useCallback } from 'react';

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
  const [subscribe, { unsubscribeCurrent }] = useLocationWatcher();
  const [currentPath, updateCurrentPath] = useCurrentPath();

  const start = useCallback(() => {
    setState((prev) => ({ ...prev, isTracking: true }));
    subscribe((position) => {
      updateCurrentPath(position);
      setState((prev) => ({ ...prev, position }));
    });
  }, [setState, subscribe, updateCurrentPath]);

  const end = useCallback(() => {
    setState((prev) => ({ ...prev, isTracking: false }));
    if (unsubscribeCurrent) {
      unsubscribeCurrent();
    }
  }, [setState, unsubscribeCurrent]);

  return [state.position, { start, end, isTracking: state.isTracking, currentPath }];
}
