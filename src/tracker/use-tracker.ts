import { useCallback } from 'react';

import { atom, useAtom } from 'jotai';

import { Path } from '../db/model';
import useLocationWatcher from '../geo/use-location-watcher';

type TrackerState = {
  isTracking: boolean;
  position: GeolocationPosition | null;
};

const trackerState = atom<TrackerState>({ isTracking: false, position: null });

type UseTrackerReturnType = [
  position: GeolocationPosition | null,
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

export type CurrentPath = Path | null;

const currentPath = atom<CurrentPath>(null);

type UseCurrentPathReturnType = [
  path: CurrentPath,
  updatePath: (position: GeolocationPosition) => void,
];

function useCurrentPath(): UseCurrentPathReturnType {
  const [path, setPath] = useAtom(currentPath);

  const updatePath = useCallback(
    (newPosition: GeolocationPosition) => {
      const applyPathUpdate = getPathUpdater(newPosition);
      setPath(applyPathUpdate);
    },
    [setPath],
  );

  return [path, updatePath];
}

function getPathUpdater(
  newPosition: GeolocationPosition,
): (prev: CurrentPath) => CurrentPath {
  const updater: ReturnType<typeof getPathUpdater> = (prevPath: CurrentPath) => {
    if (prevPath === null) {
      return {
        id: createPathId(),
        color: 'pink',
        positions: [],
      };
    }

    const newPositions = prevPath.positions.concat(newPosition);
    console.log(newPositions);

    return { ...prevPath, positions: newPositions };
  };
  return updater;
}

function createPathId(): string {
  const date = new Date();
  return date.toISOString();
}
