import React, { useEffect, useRef } from 'react';

import { styled } from '@linaria/react';
import { useRead } from 'indexeddb-hooked';
import * as L from 'leaflet';

import { StoreName } from '../../db/config';
import { Path as DBPath } from '../../db/model';
import { getLatLngTuple } from '../../geo/utils';
import useMap from '../../map/use-map';
import { useTracker } from '../../tracker/use-tracker';
import Path from './Path';
import UserMarker from './UserMarker';
import tileLayers, { createTileLayer } from './tile-layers';

const defaultPosition: L.LatLngTuple = [51.505, -0.09];
const defaultZoom = 13;

const Map: React.FC = () => {
  const mapId = 'mapId';
  const [map, { setMap }] = useMap();
  const [userPosition, { currentPath, isTracking }] = useTracker();
  const viewPosition = useRef(defaultPosition);

  const [paths] = useRead<DBPath>(StoreName.PATHS);

  useEffect(() => {
    viewPosition.current = getLatLngTuple(userPosition) || viewPosition.current;
    if (map !== null) {
      map.setView(viewPosition.current);
    }
  }, [map, userPosition]);

  useEffect(() => {
    const map = L.map(mapId);
    map.setView(viewPosition.current, defaultZoom);
    const layer = createTileLayer(tileLayers.openStreetMap);
    layer.addTo(map);
    setMap(map);
  }, [setMap]);

  const arePathsVisible = !isTracking && paths !== null;
  const isCurrentPathVisible = isTracking;

  return (
    <S.Map id={mapId}>
      <UserMarker />
      {isCurrentPathVisible && currentPath && (
        <Path {...currentPath} showMarker={false} />
      )}
      {arePathsVisible && paths?.map((path) => <Path key={path.id} {...path} />)}
    </S.Map>
  );
};

export default Map;

const S = {
  Map: styled.div`
    height: 100%;
  `,
};
