import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import * as L from 'leaflet';
import { FaCircle, FaLocationArrow } from 'react-icons/fa';

import { getHeadingFromPositions } from '../../geo/mock-geolocation';
import useMap from '../../map/use-map';
import { useTracker } from '../../tracker/use-tracker';

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

  const getHeading = useCallback((): number => {
    const positions = currentPath?.positions;
    const heading = position?.coords.heading;
    if (!heading && !positions) {
      return 0;
    }
    if (!heading) {
      return getHeadingFromPositions(positions!);
    }
    return heading;
  }, [currentPath, position]);

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
    direction.current = getHeading();
    const { latitude, longitude } = position.coords;
    marker.current?.setLatLng([latitude, longitude]);
    const iconElement = document.getElementById(iconId);
    if (iconElement) {
      const rotation = isActive
        ? direction.current + activeIconFixDirection
        : defaultDirection;
      iconElement.style.transform = `rotate(${rotation}deg)`;
    }
  }, [
    position,
    removeMarker,
    currentPath,
    direction,
    isActive,
    createMarker,
    getHeading,
  ]);

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
  width: 100%;
  height: min-content;
  stroke-width: 35px;
  stroke: white;
  transition: transform 200ms;
`;

const ActiveIcon = styled(FaLocationArrow)`
  font-size: 3rem;
  transform: rotate(${activeIconFixDirection}deg);
`;

const PassiveIcon = styled(FaCircle)`
  font-size: 2rem;
  border-radius: 100%;
`;
