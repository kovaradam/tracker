import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { styled } from '@linaria/react';
import * as L from 'leaflet';
import { FaLocationArrow } from 'react-icons/fa';

import { getLatLngTuple } from '../../geo/utils';
import useMap from '../../map/use-map';
import { useTracker, CurrentPath } from '../../tracker/use-tracker';

const UserMarker: React.FC = () => {
  const [position, { isTracking, currentPath }] = useTracker();
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
      const direction = getMarkerDirection(currentPath);
      const [icon, renderIconContent] = createUserMarkerIcon(direction);
      const { latitude, longitude } = position.coords;
      marker.current = L.marker([latitude, longitude], { icon });
      marker.current.addTo(map);
      renderIconContent();
    }
    return removeMarker;
  }, [map, position, removeMarker, currentPath]);

  return null;
};

export default UserMarker;

export function createMarkerIcon(
  className: string,
  iconComponent: JSX.Element,
): [L.DivIcon, () => void] {
  const icon = L.divIcon({
    className,
    iconSize: [30, 80],
  });

  function createIconContent(): void {
    const iconElement = document.getElementsByClassName(className)[0];
    if (iconElement) {
      ReactDOM.render(iconComponent, iconElement);
    }
  }
  return [icon, createIconContent];
}

function createUserMarkerIcon(
  directionInDeg: number,
): ReturnType<typeof createMarkerIcon> {
  return createMarkerIcon(
    'user-marker-icon',
    <Icon
      color={'#ffa6a69e'}
      style={{ transform: `rotate(${directionInDeg - 45}deg)` }}
    />,
  );
}

const Icon = styled(FaLocationArrow)<{ color: string }>`
  color: ${({ color }): string => color};
  width: min-content;
  height: min-content;
  font-size: 3rem;
  stroke-width: 35px;
  stroke: white;
  transition: transform 200ms;
  margin-top: 40px;
  margin-left: -100%;
  transform-origin: right top;
`;

function getMarkerDirection(path: CurrentPath): number {
  const defaultDirection = 0;
  const pathPositionsLength = path?.positions.length || 0;
  if (!path || pathPositionsLength < 2) {
    return defaultDirection;
  }
  const lastTwoPositions = [
    path.positions[pathPositionsLength - 2],
    path.positions[pathPositionsLength - 1],
  ];
  const positionTuples = lastTwoPositions
    .map(getLatLngTuple)
    .filter((tuple) => tuple !== null);

  const dx = positionTuples[0]![0] - positionTuples[1]![0];
  const dy = positionTuples[0]![1] - positionTuples[1]![1];
  const degrees = (Math.atan(Math.abs(dy / dx)) * 180) / Math.PI;
  if (dx < 0 && dy >= 0) {
    return degrees + 90;
  } else if (dx < 0 && dy < 0) {
    return degrees + 180;
  } else if (dx >= 0 && dy < 0) {
    return degrees - 90;
  } else {
    return degrees;
  }
}
