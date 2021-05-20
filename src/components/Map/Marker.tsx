import React, { useCallback, useEffect, useRef } from 'react';

import * as L from 'leaflet';

import useMap from '../../map/use-map';
import { useTracker } from '../../tracker/use-tracker';

const Marker: React.FC = () => {
  const [position, { isTracking }] = useTracker();
  const [map] = useMap();
  const marker = useRef<L.Marker | null>(null);

  const removeMarker = useCallback((): void => {
    marker.current?.remove();
  }, [marker]);

  useEffect(() => {
    if (!isTracking) {
      removeMarker();
    }
  }, [removeMarker, isTracking]);

  useEffect(() => {
    if (map !== null && position !== null) {
      const { latitude, longitude } = position.coords;
      marker.current = L.marker([latitude, longitude]);
      marker.current.addTo(map);
    }
    return removeMarker;
  }, [map, position, removeMarker]);

  return null;
};

export default Marker;
