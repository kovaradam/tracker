/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';

import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import * as L from 'leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';

import { Path as PathType } from '../../db/model';
import { getLatLngTuple } from '../../geo/utils';
import useMap from '../../map/use-map';
import { createMarkerIcon } from './UserMarker';

type Props = PathType & { showMarker?: boolean };

const Path: React.FC<Props> = (props) => {
  const { showMarker, color, positions, id } = props;
  const points = useMemo(() => getPointsFromPositions(positions), [positions]);
  const [map] = useMap();
  const persisted = useRef<Partial<{ line: L.Polyline; marker: L.Marker }>>({
    line: undefined,
    marker: undefined,
  });

  const updateLine = useCallback(() => {
    if (!map) {
      return;
    }
    if (persisted.current.line) {
      persisted.current.line.remove();
    }
    persisted.current.line = L.polyline(points as L.LatLngTuple[]);
    persisted.current.line.setStyle({ color, className: pathStyle });
    persisted.current.line.addTo(map);
  }, [persisted, points, color, map]);

  // on map init
  useEffect(() => {
    if (!map) return;

    updateLine();

    if (showMarker !== false) {
      const [markerIcon, renderIconContent] = createMarkerIcon(
        id,
        <Icon color={color} />,
      );
      persisted.current.marker = L.marker(points[points.length - 1] as L.LatLngTuple, {
        icon: markerIcon,
      });

      persisted.current.marker.addTo(map);
      renderIconContent();
    }
  }, [map]);

  useEffect(() => {
    updateLine();
    const elements = persisted.current;
    return () => {
      elements.line?.remove();
      elements.marker?.remove();
    };
  }, [points, color]);

  return null;
};

export default Path;

function getPointsFromPositions(positions: GeolocationPosition[]): L.LatLngTuple[] {
  return positions
    .map(getLatLngTuple)
    .filter((tuple) => tuple !== null) as L.LatLngTuple[];
}

const pathStyle = css`
  stroke-dasharray: 8;
  stroke-width: 6;
  animation: flow 70s linear infinite;

  @keyframes flow {
    to {
      stroke-dashoffset: -1000;
    }
  }
`;

const Icon = styled(FaMapMarkerAlt)<{ color: string }>`
  color: ${({ color }): string => color};
  width: min-content;
  height: min-content;
  font-size: 2rem;
  stroke-width: 35px;
  stroke: white;
`;
