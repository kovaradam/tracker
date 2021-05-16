import React, { useEffect } from 'react';

import { styled } from '@linaria/react';
import * as L from 'leaflet';

import tileLayers from './tile-layers';

const Map: React.FC = () => {
  const mapId = 'mapId';
  useEffect(() => {
    const map = L.map(mapId).setView([51.505, -0.09], 13);
    const layer = tileLayers.openStreetMap;
    L.tileLayer(layer.url, layer.options).addTo(map);
  });

  return <S.Map id={mapId} />;
};

export default Map;

const S = {
  Map: styled.div`
    height: 100%;
  `,
};
