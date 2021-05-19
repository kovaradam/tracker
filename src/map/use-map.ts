import { SetStateAction, useCallback } from 'react';

import { atom, useAtom } from 'jotai';
import * as L from 'leaflet';

type MapState = L.Map | null;

const mapState = atom<MapState>(null);

type UseMapReturnType = [map: MapState, setMap: (map: L.Map) => void];

function useMap(): UseMapReturnType {
  const state = useAtom(mapState);
  return state as UseMapReturnType;
}

export default useMap;
