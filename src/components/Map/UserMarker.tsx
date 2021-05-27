import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { styled } from '@linaria/react';
import * as L from 'leaflet';
import { FaCircle, FaLocationArrow } from 'react-icons/fa';

import { getLatLngTuple } from '../../geo/utils';
import useMap from '../../map/use-map';
import { useTracker, CurrentPath } from '../../tracker/use-tracker';

type Props = { isActive: boolean };

const defaultDirection = 0;

const UserMarker: React.FC<Props> = ({ isActive }) => {
  const [position, { currentPath }] = useTracker();
  const [map] = useMap();
  const marker = useRef<L.Marker | null>(null);
  const direction = useRef(defaultDirection);

  const removeMarker = useCallback((): void => {
    marker.current?.remove();
  }, [marker]);

  useEffect(() => {
    if (map !== null && position !== null) {
      direction.current = getMarkerDirection(currentPath) || direction.current;

      const [icon, renderIconContent] = createUserMarkerIcon(direction.current, isActive);
      const { latitude, longitude } = position.coords;
      marker.current = L.marker([latitude, longitude], { icon });
      marker.current.addTo(map);
      renderIconContent();
    }
    return removeMarker;
  }, [map, position, removeMarker, currentPath, direction, isActive]);

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
  isTracking: boolean,
): ReturnType<typeof createMarkerIcon> {
  const Icon = isTracking ? ActiveIcon : PassiveIcon;
  console.log(isTracking);

  return createMarkerIcon(
    'user-marker-icon',
    <Icon
      color={'#ffa6a69e'}
      style={{ transform: `rotate(${directionInDeg - 45}deg)` }}
    />,
  );
}

const ActiveIcon = styled(FaLocationArrow)<{ color: string }>`
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

const PassiveIcon = styled(FaCircle)<{ color: string }>`
  color: ${({ color }): string => color};
  width: min-content;
  height: min-content;
  font-size: 2rem;
  stroke-width: 35px;
  stroke: white;
  transition: transform 200ms;
  margin-top: 20px;
  margin-left: -55%;
  transform-origin: right top;
`;

function getMarkerDirection(path: CurrentPath): number | null {
  const errorValue = null;
  const pathPositionsLength = path?.positions.length || 0;
  if (!path || pathPositionsLength < 2) {
    return errorValue;
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
  if (dx === 0) {
    return errorValue;
  }
  const degrees = (Math.atan(Math.abs(dy / dx)) * 180) / Math.PI + 180;

  if (dx < 0 && dy >= 0) {
    return 180 - degrees;
  } else if (dx < 0 && dy < 0) {
    return degrees + 180;
  } else if (dx >= 0 && dy < 0) {
    return -degrees;
  } else {
    return degrees;
  }
}
