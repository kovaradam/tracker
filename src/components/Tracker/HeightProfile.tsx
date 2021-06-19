import React, { useCallback, useEffect, useRef, useState } from 'react';

import { css } from '@linaria/core';

import { Path, Position } from '../../db/model';
import { pathColors } from '../../style';
import formatDistance from '../../utils/format-distance';
import { getPathDistance } from '../../utils/position-distance';
import useMatchMedia from '../../utils/use-match-media';
import Canvas, { DrawCallback } from '../Canvas';

const canvasWidth = 1000;

type Props = { path: Path };

const HeightProfile: React.FC<Props> = ({ path }) => {
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const [canvasHeight, setCanvasHeight] = useState(canvasWidth / 2);
  const isPortait = useMatchMedia('(orientation: portrait)');
  const padY = useCallback(
    (value: number) => {
      return padDimension(value, 0.9, canvasHeight);
    },
    [canvasHeight],
  );

  const padX = useCallback((value: number) => {
    return padDimension(value, 0.9, canvasWidth);
  }, []);

  const drawPath = useCallback<DrawCallback>(
    (context, zoom) => {
      const nodes = getLineNodes(path.positions, {
        width: canvasWidth,
        height: canvasHeight,
      });

      context.lineWidth = 5.5 / zoom;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      const gradient = context.createLinearGradient(0, 0, canvasWidth, 0);
      gradient.addColorStop(0, pathColors[2]);
      gradient.addColorStop(0.5, pathColors[0]);
      gradient.addColorStop(1, pathColors[2]);
      context.strokeStyle = gradient;
      context.beginPath();
      context.setLineDash([]);
      nodes.forEach(([x, y]) => {
        context.lineTo(padX(x) + 0.5, padY(canvasHeight - y) + 0.5);
      });
      context.stroke();
    },
    [path, padY, padX, canvasHeight],
  );

  const drawLabels = useCallback<DrawCallback>(
    (context, zoom) => {
      const nodes = getLineNodes(path.positions, {
        width: canvasWidth,
        height: canvasHeight,
      });
      const positionMap = augmentPositions(path.positions).map(
        ({ coords: { altitude }, distance }, index) => ({
          altitude,
          node: nodes[index],
          distance,
        }),
      );

      context.lineWidth = 3.5 / zoom;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = '#80808050';
      context.lineDashOffset = 50;
      context.font = '20px Arial';
      context.fillStyle = pathColors[2];

      // vertical lines
      positionMap.forEach(({ distance, node }, index) => {
        if (index === 0) {
          return;
        }
        const [x, y] = node;
        context.beginPath();
        context.setLineDash([5, 4]);
        context.moveTo(padX(x) + 0.5, canvasHeight + 0.5);
        context.lineTo(padX(x) + 0.5, padY(canvasHeight - y) + 0.5);
        context.stroke();
        context.fillText(formatDistance(distance, true), padX(x) + 4.5, canvasHeight - 2);
      });

      const extremes = getPathExtremes(path.positions);
      const showIndices = [0, positionMap.length - 1];
      context.lineWidth = 2 / zoom;
      // horizontal lines
      positionMap.forEach(({ altitude, node: [x, y] }, index) => {
        if (!showIndices.includes(index) && !extremes.includes(altitude || -1)) {
          return;
        }
        context.beginPath();
        context.moveTo(0.5, padY(canvasHeight - y) + 0.5);
        context.lineTo(padX(x) + 0.5, padY(canvasHeight - y) + 0.5);
        context.stroke();
        context.fillText(
          formatDistance(altitude ?? 0, true),
          5.5,
          padY(canvasHeight - y) - 4.5,
        );
      });
    },
    [path, padY, padX, canvasHeight],
  );

  const updateHeight = useCallback((element: HTMLCanvasElement | null) => {
    if (!element) {
      return;
    }
    const newHeight = Math.round(canvasWidth / getElementDimRatio(element));
    setCanvasHeight(newHeight);
  }, []);

  useEffect(() => {
    if (!canvasElement.current) {
      return;
    }
    updateHeight(canvasElement.current);
  }, [updateHeight, isPortait]);

  return (
    <Canvas
      width={canvasWidth}
      height={canvasHeight}
      className={style}
      draw={[drawLabels, drawPath]}
      ref={canvasElement}
    />
  );
};

export default HeightProfile;

const style = css`
  width: 100%;
  height: 85px;
  border-radius: 2px;
  margin-top: 1rem;
`;

function padDimension(value: number, rate: number, elementDimValue: number): number {
  const bottomPad = (1 - rate) * elementDimValue;
  const percentage = (100 * value) / elementDimValue;
  const outputHeight = elementDimValue - elementDimValue * (1 - rate) * 2;
  return bottomPad + (outputHeight / 100) * percentage;
}

function getLineNodes(
  positions: Position[],
  canvas: { width: number; height: number },
): [number, number][] {
  const augmentedPositions = augmentPositions(positions);
  const pathExtremes = getPathExtremes(positions);
  const normalizedPositionCoords = augmentedPositions.map((position) =>
    getNormalizedCoordinates(position, pathExtremes, canvas),
  );
  return normalizedPositionCoords;
}

type PositionWithDistance = Position & { distance: number };

function getPathExtremes(
  positions: Position[],
): [minHeight: number, maxHeight: number, distance: number] {
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
  canvas: { width: number; height: number },
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

function getElementDimRatio(element: HTMLElement): number {
  const { offsetWidth, offsetHeight } = element;
  console.log(offsetWidth, offsetHeight);

  return offsetWidth / offsetHeight;
}
