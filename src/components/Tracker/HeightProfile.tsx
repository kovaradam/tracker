import React, { useCallback, useEffect, useRef, useState } from 'react';

import { css } from '@linaria/core';

import { Path, Position } from '../../db/model';
import { canvasColor, pathColors } from '../../style';
import formatDistance from '../../utils/format-distance';
import { getPathDistance } from '../../utils/position-distance';
import useMatchMedia from '../../utils/use-match-media';
import Canvas, { DrawCallback } from '../Canvas';

type Props = { path: Path };

const defaultCanvasWidth = 1000;

const text = {
  size: 7,
  color: pathColors[2],
  backgroundColor: `${canvasColor}`,
};

const HeightProfile: React.FC<Props> = ({ path }) => {
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const [canvasDims, setCanvasDims] = useState({
    width: defaultCanvasWidth,
    height: defaultCanvasWidth / 3,
  });
  const isPortait = useMatchMedia('(orientation: portrait)');

  const padY = useCallback(
    (value: number) => {
      return padDimension(value, 0.9, canvasDims.height);
    },
    [canvasDims.height],
  );

  const padX = useCallback(
    (value: number) => {
      return padDimension(value, 0.9, canvasDims.width);
    },
    [canvasDims.width],
  );

  const drawPath = useCallback<DrawCallback>(
    (context, zoom) => {
      const nodes = getLineNodes(path.positions, canvasDims);

      context.lineWidth = 1.5 / zoom;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      const gradient = context.createLinearGradient(0, 0, canvasDims.width, 0);
      gradient.addColorStop(0, pathColors[2]);
      gradient.addColorStop(0.5, pathColors[0]);
      gradient.addColorStop(1, pathColors[2]);
      context.strokeStyle = gradient;
      context.beginPath();
      context.setLineDash([]);
      nodes.forEach(([x, y]) => {
        context.lineTo(padX(x) + 0.5, padY(canvasDims.height - y) + 0.5);
      });
      context.stroke();
    },
    [path, padY, padX, canvasDims],
  );

  const drawLabels = useCallback<DrawCallback>(
    (context, zoom) => {
      const nodes = getLineNodes(path.positions, canvasDims);
      const positionMap = augmentPositions(path.positions).map(
        ({ coords: { altitude }, distance }, index) => ({
          altitude,
          node: nodes[index],
          distance,
        }),
      );

      context.lineWidth = 1 / zoom;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = '#80808050';
      context.lineDashOffset = 50;
      context.font = `${text.size}px Arial`;
      context.fillStyle = pathColors[2];

      // vertical lines
      positionMap.forEach(({ distance, node }, index) => {
        if (index === 0) {
          return;
        }
        const [x, y] = node;
        context.beginPath();
        context.setLineDash([5, 4]);
        context.moveTo(padX(x) + 0.5, canvasDims.height + 0.5);
        context.lineTo(padX(x) + 0.5, padY(canvasDims.height - y) + 0.5);
        context.stroke();

        const textDims = [padX(x) + 4.5, canvasDims.height - 2];
        context.fillStyle = text.backgroundColor;
        context.fillRect(textDims[0] - 2, textDims[1] - 8, 25, 13);
        context.fillStyle = pathColors[2];
        context.fillText(formatDistance(distance, true), textDims[0], textDims[1]);
      });

      const extremes = getPathExtremes(path.positions);
      const showIndices = [0, positionMap.length - 1];
      context.lineWidth = 1 / zoom;

      // horizontal lines
      positionMap.forEach(({ altitude, node: [x, y] }, index) => {
        if (!showIndices.includes(index) && !extremes.includes(altitude || -1)) {
          return;
        }
        context.beginPath();
        context.moveTo(0.5, padY(canvasDims.height - y) + 0.5);
        context.lineTo(padX(x) + 0.5, padY(canvasDims.height - y) + 0.5);
        context.stroke();

        const textDims = [5.5, padY(canvasDims.height - y) - 2.5];
        context.fillStyle = text.backgroundColor;
        context.fillRect(textDims[0] - 3, textDims[1] - 7, 25, text.size + 3);
        context.fillStyle = pathColors[2];
        context.fillText(formatDistance(altitude ?? 0, true), textDims[0], textDims[1]);
      });
    },
    [path, padY, padX, canvasDims],
  );

  const updateDims = useCallback((element: HTMLCanvasElement | null) => {
    if (!element) {
      return;
    }
    const width = element.offsetWidth;
    const height = Math.round(width / getElementDimRatio(element));
    setCanvasDims({ width, height });
  }, []);

  useEffect(() => {
    if (!canvasElement.current) {
      return;
    }
    updateDims(canvasElement.current);
  }, [updateDims, isPortait]);

  return (
    <Canvas
      {...canvasDims}
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
  return offsetWidth / offsetHeight;
}
