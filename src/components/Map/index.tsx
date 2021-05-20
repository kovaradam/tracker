import React, { useEffect, useRef } from 'react';

import { styled } from '@linaria/react';
import * as L from 'leaflet';

import { getLatLngTuple } from '../../geo/utils';
import useMap from '../../map/use-map';
import { useTracker } from '../../tracker/use-tracker';
import Marker from './Marker';
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
  }, [setMap]);

  return (
    <S.Map id={mapId}>
      <Marker />
    </S.Map>
  );
};

export default Map;

const S = {
  Map: styled.div`
    height: 100%;
  `,
};
