import { useCallback } from 'react';

import { atom, useAtom } from 'jotai';

import useLocationWatcher from '../../geo/use-location-watcher';

type TrackerState = {
  isTracking: boolean;
  position: GeolocationPosition | null;
};

const trackerState = atom<TrackerState>({ isTracking: false, position: null });

type UseTrackerReturnType = [
  position: GeolocationPosition | null,
  tracking: { isTracking: boolean; start: () => void; end: () => void },
];

export function useTracker(): UseTrackerReturnType {
  const [state, setState] = useAtom(trackerState);
  const [subscribe, { unsubscribeCurrent }] = useLocationWatcher();

  const start = useCallback(() => {
    setState((prev) => ({ ...prev, isTracking: true }));
    subscribe((position) => setState((prev) => ({ ...prev, position })));
  }, [setState, subscribe]);

  const end = useCallback(() => {
    setState((prev) => ({ ...prev, isTracking: false }));
    if (unsubscribeCurrent) {
      unsubscribeCurrent();
    }
  }, [setState, unsubscribeCurrent]);
  return [state.position, { start, end, ...state }];
}
