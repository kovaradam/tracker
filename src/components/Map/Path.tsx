/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { useAtom } from 'jotai';
import * as L from 'leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';

import { Path as PathType, Position } from '../../db/model';
import { getLatLngTuple } from '../../geo/utils';
import useMap from '../../map/use-map';
import { selectedPathIdAtom } from '../Tracker/TrackerControls';
import { createMarkerIcon } from './UserMarker';

type Props = PathType & { showMarker?: boolean };

const Path: React.FC<Props> = (props) => {
  const { showMarker, color, positions, id } = props;
  const points = useMemo(() => getPointsFromPositions(positions), [positions]);
  const [map] = useMap();
  const persisted = useRef<
    Partial<{ line: L.Polyline; marker: L.Marker; startPoint: L.Circle }>
  >({
    line: undefined,
    marker: undefined,
    startPoint: undefined,
  });
  const [, setSelectedPathId] = useAtom(selectedPathIdAtom);

  const updateLine = useCallback(() => {
    if (!map) {
      return;
    }

    persisted.current.line = L.polyline(points as L.LatLngTuple[]);
    persisted.current.line.setStyle({ color, className: pathStyle });
    persisted.current.line.addTo(map);

    persisted.current.startPoint = L.circle((points as L.LatLngTuple[])[0], {
      radius: 2,
    });
    persisted.current.startPoint.setStyle({ color, className: startPointStyle });
    persisted.current.startPoint.addTo(map);

    if (showMarker !== false) {
      const [markerIcon, renderIconContent] = createMarkerIcon(
        `path-${id}`,
        <Icon color={color} />,
      );
      persisted.current.marker = L.marker(points[points.length - 1] as L.LatLngTuple, {
        icon: markerIcon,
      });

      persisted.current.marker.addTo(map);
      renderIconContent();
    }
  }, [persisted, points, color, map]);

  // on map init
  useEffect(() => {
    updateLine();
    const { line, marker, startPoint } = persisted.current;
    marker?.addEventListener('click', () => setSelectedPathId(id));

    return (): void => {
      line?.remove();
      marker?.remove();
      startPoint?.remove();
    };
  }, [map, points, color]);

  return null;
};

export default Path;

function getPointsFromPositions(positions: Position[]): L.LatLngTuple[] {
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

const startPointStyle = css`
  stroke-width: 10px;
  fill-opacity: 1;
`;

const Icon = styled(FaMapMarkerAlt)<{ color: string }>`
  color: ${({ color }): string => color};
  width: 100%;
  height: min-content;
  font-size: 2rem;
  stroke: white;
`;
