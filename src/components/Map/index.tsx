import React, { useEffect, useRef } from 'react';

import { styled } from '@linaria/react';
import * as L from 'leaflet';

import { getLatLngTuple } from '../../geo/utils';
import useMap from '../../map/use-map';
import { useTracker } from '../../tracker/use-tracker';
import Marker from './Marker';
import Path from './Path';
import tileLayers, { createTileLayer } from './tile-layers';

const defaultPosition: L.LatLngTuple = [51.505, -0.09];
const defaultZoom = 13;

const Map: React.FC = () => {
  const mapId = 'mapId';
  const [map, { setMap }] = useMap();
  const [position] = useTracker();
  const viewPosition = useRef(defaultPosition);

  useEffect(() => {
    viewPosition.current = getLatLngTuple(position) || viewPosition.current;
    if (map !== null) {
      map.setView(viewPosition.current);
    }
  }, [map, position]);

  useEffect(() => {
    const map = L.map(mapId);
    map.setView(viewPosition.current, defaultZoom);
    const layer = createTileLayer(tileLayers.openStreetMap);
    layer.addTo(map);
    setMap(map);
    map.on('click', (e: any) => console.log(e.latlng));
  }, [setMap]);

  return (
    <S.Map id={mapId}>
      <Marker />
      {defaultPaths.map((path) => (
        <Path key={path.id} {...path} showMarker={path.id !== 'current'} />
      ))}
    </S.Map>
  );
};

export default Map;

const S = {
  Map: styled.div`
    height: 100%;
  `,
};

const defaultPaths: Path[] = [
  {
    id: 'id',
    points: [
      [50.09999155153073, 14.421787261962892],
      [50.10208363663026, 14.433803558349611],
      [50.10252406395657, 14.421100616455078],
    ],
    color: 'blue',
  },
  {
    id: 'current',
    points: [
      [50.108249250710514, 14.443244934082033],
      [50.098560072241156, 14.443244934082033],
    ],
    color: 'yellow',
  },
];
