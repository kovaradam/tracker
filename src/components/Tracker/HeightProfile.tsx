import React, { useCallback, useEffect, useRef } from 'react';

import { styled } from '@linaria/react';

import { Path, Position } from '../../db/model';
import { pathColors } from '../../style';
import { getPathDistance } from '../../utils/position-distance';

const canvas = { width: 300, height: 200 };

type Props = { path: Path };

const HeightProfile: React.FC<Props> = ({ path }) => {
  const canvasElement = useRef<HTMLCanvasElement | null>(null);

  const drawPath = useCallback(
    (context: CanvasRenderingContext2D) => {
      const nodes = getLineNodes(path.positions);
      const { height, width } = canvas;
      context.lineWidth = 5;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      const gradient = context.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, pathColors[0]);
      gradient.addColorStop(0.5, pathColors[3]);
      gradient.addColorStop(1, pathColors[0]);
      context.strokeStyle = gradient;
      context.beginPath();
      nodes.forEach(([x, y]) => {
        context.lineTo(x + 0.5, height - y + 0.5);
      });
      context.stroke();
    },
    [path],
  );

  useEffect(() => {
    if (!canvasElement.current) {
      return;
    }
    const context = canvasElement.current.getContext('2d');
    if (!context) {
      return;
    }
    drawPath(context);
  }, [canvasElement, drawPath]);

  return <S.Canvas {...canvas} ref={canvasElement} />;
};

export default HeightProfile;

const S = {
  Canvas: styled.canvas`
    width: 100%;
    height: 85px;
    box-shadow: 0 0 2px 2px #80808026;
    border-radius: 5px;
  `,
};

function getLineNodes(positions: Position[]): [number, number][] {
  const augmentedPositions = augmentPositions(positions);
  const pathExtremes = getPathExtremes(positions);
  const normalizedPositionCoords = augmentedPositions.map((position) =>
    getNormalizedCoordinates(position, pathExtremes),
  );
  return normalizedPositionCoords;
}

type PositionWithDistance = Position & { distance: number };

function getPathExtremes(positions: Position[]): [number, number, number] {
  let [min, max] = [Number.MAX_SAFE_INTEGER, Number.MIN_VALUE];
  positions.forEach(({ coords: { altitude } }) => {
    if (!altitude) {
      return;
    }
    min = min < altitude ? min : altitude;
    max = max > altitude ? max : altitude;
  });
  const distance = getPathDistance(positions);
  return [min, max, distance];
}

function getNormalizedCoordinates(
  position: PositionWithDistance,
  extremes: ReturnType<typeof getPathExtremes>,
): [number, number] {
  const {
    distance,
    coords: { altitude },
  } = position;
  const [min, max, pathDistance] = extremes;
  const y = (canvas.height * (altitude! - min)) / (max - min);
  const x = (canvas.width * distance) / pathDistance;
  return [x, y];
}

function augmentPositions(positions: Position[]): PositionWithDistance[] {
  return positions.map((position, index) => ({
    ...position,
    distance: getPathDistance(positions.slice(0, index + 1)),
  }));
}
