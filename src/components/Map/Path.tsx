import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import * as L from 'leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';

import useMap from '../../map/use-map';

type Path = { id: string; points: L.LatLngTuple[]; color: string };

type Props = Path & { showMarker?: boolean };

const Path: React.FC<Props> = (props) => {
  const { showMarker, color, points } = props;
  const [map] = useMap();
  const persisted = useRef<Partial<{ line: L.Polyline; marker: L.Marker }>>({
    line: undefined,
    marker: undefined,
  });

  useEffect(() => {
    if (!map) return;

    persisted.current.line = L.polyline(points as L.LatLngTuple[]);
    persisted.current.line.setStyle({ color, className: pathStyle });
    persisted.current.line.addTo(map);

    if (showMarker) {
      const [markerIcon, renderIconContent] = createIcon(props);
      persisted.current.marker = L.marker(points[points.length - 1] as L.LatLngTuple, {
        icon: markerIcon,
      });

      persisted.current.marker.addTo(map);
      renderIconContent();
    }
  }, [map]);

  useEffect(() => {
    if (persisted.current.line) {
      persisted.current.line.setStyle({ color });
    }
  }, [props]);

  return null;
};

export default Path;

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

function createIcon(path: Path): [L.DivIcon, () => void] {
  const icon = L.divIcon({
    className: `${path.id}`,
    iconSize: [30, 80],
  });

  function createIconContent(): void {
    const iconElement = document.getElementsByClassName(path.id)[0];
    if (!iconElement) {
      throw new Error('Icon element not found');
    }

    ReactDOM.render(<Icon color={path.color} />, iconElement);
  }
  return [icon, createIconContent];
}

const Icon = styled(FaMapMarkerAlt)<{ color: string }>`
  color: ${({ color }): string => color};
  width: min-content;
  height: min-content;
  font-size: 2rem;
  stroke-width: 35px;
  stroke: white;
`;
