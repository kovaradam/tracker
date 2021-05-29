import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import * as L from 'leaflet';
import { FaCircle, FaLocationArrow } from 'react-icons/fa';

import { getLatLngTuple } from '../../geo/utils';
import useMap from '../../map/use-map';
import { useTracker, CurrentPath } from '../../tracker/use-tracker';

type Props = { isActive: boolean };

const defaultDirection = 0;
const activeIconFixDirection = -45;
const iconId = 'marker-icon';

const UserMarker: React.FC<Props> = ({ isActive }) => {
  const [position, { currentPath }] = useTracker();
  const [map] = useMap();
  const marker = useRef<L.Marker | null>(null);
  const direction = useRef(defaultDirection);

  const removeMarker = useCallback((): void => {
    marker.current?.remove();
    marker.current = null;
    direction.current = defaultDirection;
  }, [marker]);

  const createMarker = useCallback(() => {
    if (map !== null && position !== null) {
      const [icon, renderIconContent] = createUserMarkerIcon(isActive);
      const { latitude, longitude } = position.coords;
      marker.current = L.marker([latitude, longitude], { icon });
      marker.current.addTo(map);
      renderIconContent();
    }
  }, [map, position, isActive]);

  useEffect(() => {
    // change marker on active change
    createMarker();
    return removeMarker;
  }, [isActive]);

  useEffect(() => {
    if (!position) {
      return;
    }
    if (!marker.current) {
      createMarker();
    }
    direction.current = getMarkerDirection(currentPath) || direction.current;
    const { latitude, longitude } = position.coords;
    marker.current?.setLatLng([latitude, longitude]);
    const iconElement = document.getElementById(iconId);
    if (iconElement) {
      const rotation = isActive
        ? direction.current + activeIconFixDirection
        : defaultDirection;
      iconElement.style.transform = `rotate(${rotation}deg)`;
    }
  }, [position, removeMarker, currentPath, direction, isActive, createMarker]);

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
    const markerElement = document.getElementsByClassName(className)[0];
    if (markerElement) {
      ReactDOM.render(iconComponent, markerElement);
    }
  }
  return [icon, createIconContent];
}

function createUserMarkerIcon(isTracking: boolean): ReturnType<typeof createMarkerIcon> {
  const Icon = isTracking ? ActiveIcon : PassiveIcon;

  return createMarkerIcon('user-marker', <Icon id={iconId} className={commonStyle} />);
}

const commonStyle = css`
  color: #ffa6a69e;
  width: min-content;
  height: min-content;
  stroke-width: 35px;
  stroke: white;
  transition: transform 200ms;
  transform-origin: right top;
`;

const ActiveIcon = styled(FaLocationArrow)`
  font-size: 3rem;
  margin-top: 40px;
  margin-left: -100%;
  transform: rotate(${activeIconFixDirection}deg);
`;

const PassiveIcon = styled(FaCircle)`
  font-size: 2rem;
  margin-top: 20px;
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
