import { useCallback } from 'react';

import { atom, useAtom } from 'jotai';

import { Path, Position } from '../db/model';
import { pathColors } from '../style';

export type CurrentPath = Path | null;

const currentPath = atom<CurrentPath>(null);

type UseCurrentPathReturnType = [
  path: CurrentPath,
  updatePath: (position: Position) => void,
  deletePath: () => void,
];

export function useCurrentPath(): UseCurrentPathReturnType {
  const [path, setPath] = useAtom(currentPath);

  const updatePath = useCallback(
    (newPosition: Position) => {
      const applyPathUpdate = getPathUpdater(newPosition);
      setPath(applyPathUpdate);
    },
    [setPath],
  );

  const deletePath = useCallback(() => {
    setPath(null);
  }, [setPath]);

  return [path, updatePath, deletePath];
}

function getPathUpdater(newPosition: Position): (prev: CurrentPath) => CurrentPath {
  const updater: ReturnType<typeof getPathUpdater> = (prevPath: CurrentPath) => {
    if (prevPath === null) {
      const [id, color] = pathDataGenerator.next().value as [number, string];
      const newValue = {
        id,
        color,
        positions: [newPosition],
      };
      return newValue;
    }

    const newPositions = prevPath.positions.concat(newPosition);

    return { ...prevPath, positions: newPositions };
  };
  return updater;
}

function* createPathDataIterator(initValue = 0): Generator<[number, string]> {
  let i = initValue;
  while (true) {
    yield [i, pathColors[i++ % pathColors.length]];
  }
}
const pathDataGenerator = createPathDataIterator();
