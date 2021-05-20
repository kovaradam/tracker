import { useCallback } from 'react';

import { atom, useAtom } from 'jotai';
import * as L from 'leaflet';

import { getLatLngTuple } from '../geo/utils';
import { useTracker } from '../tracker/use-tracker';

type MapState = L.Map | null;

const mapState = atom<MapState>(null);

type UseMapReturnType = [
  map: MapState,
  udaters: { centerMapView: () => void; setMap: (map: L.Map) => void },
];

function useMap(): UseMapReturnType {
  const [map, setMap] = useAtom(mapState);
  const [position] = useTracker();

  const centerMapView = useCallback(() => {
    const newMapViewPosition = getLatLngTuple(position);
    if (newMapViewPosition) {
      map?.setView(newMapViewPosition);
    }
  }, [position, map]);

  return [map, { centerMapView, setMap }];
}

export default useMap;
