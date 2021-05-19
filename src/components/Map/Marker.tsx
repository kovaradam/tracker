import React, { useEffect } from 'react';

import * as L from 'leaflet';

import useMap from '../../map/use-map';
import { useTracker } from '../Tracker/store';

const Marker: React.FC = () => {
  const [position] = useTracker();
  const [map] = useMap();

  useEffect(() => {
    if (map !== null && position !== null) {
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);

      L.marker([latitude, longitude]).addTo(map);
    }
  }, [map, position]);

  return null;
};

export default Marker;
