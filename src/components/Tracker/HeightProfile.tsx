import React, { useCallback } from 'react';

import { css } from '@linaria/core';

import { Path, Position } from '../../db/model';
import { pathColors } from '../../style';
import formatDistance from '../../utils/format-distance';
import { getPathDistance } from '../../utils/position-distance';
import Canvas from '../Canvas';

const canvas = { width: 1000, height: 300 };

type Props = { path: Path };

const HeightProfile: React.FC<Props> = ({ path }) => {
  const padY = useCallback((value: number) => {
    return padHeight(value, 0.9, canvas.height);
  }, []);

  const padX = useCallback((value: number) => {
    return padHeight(value, 0.95, canvas.width);
  }, []);

  const drawPath = useCallback(
    (context: CanvasRenderingContext2D) => {
      const nodes = getLineNodes(path.positions);
      const { height, width } = canvas;

      context.lineWidth = 5.5;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      const gradient = context.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, pathColors[2]);
      gradient.addColorStop(0.5, pathColors[0]);
      gradient.addColorStop(1, pathColors[2]);
      context.strokeStyle = gradient;
      context.beginPath();
      context.setLineDash([]);
      nodes.forEach(([x, y]) => {
        context.lineTo(padX(x) + 0.5, padY(height - y) + 0.5);
      });
      context.stroke();
    },
    [path, padY, padX],
  );

  const drawLabels = useCallback(
    (context: CanvasRenderingContext2D) => {
      const nodes = getLineNodes(path.positions);
      const positionMap = augmentPositions(path.positions).map(
        ({ coords: { altitude }, distance }, index) => ({
          altitude,
          node: nodes[index],
          distance,
        }),
      );

      context.lineWidth = 3.5;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = '#80808050';
      context.lineDashOffset = 50;
      context.font = '15px Arial';
      context.fillStyle = pathColors[2];
      const { height } = canvas;

      positionMap.forEach(({ distance, node }, index) => {
        if (index === 0) {
          return;
        }
        const [x, y] = node;
        context.beginPath();
        context.setLineDash([5, 4]);
        context.moveTo(padX(x) + 0.5, height + 0.5);
        context.lineTo(padX(x) + 0.5, padY(height - y) + 0.5);
        context.stroke();
        context.fillText(formatDistance(distance, true), padX(x) + 4.5, height - 2);
      });

      const extremes = getPathExtremes(path.positions);
      const showIndices = [0, positionMap.length - 1];
      context.lineWidth = 2;
      positionMap.forEach(({ altitude, node: [x, y] }, index) => {
        if (!showIndices.includes(index) && !extremes.includes(altitude || -1)) {
          return;
        }
        context.beginPath();
        context.moveTo(0.5, padY(height - y) + 0.5);
        context.lineTo(padX(x) + 0.5, padY(height - y) + 0.5);
        context.stroke();
        context.fillText(
          formatDistance(altitude ?? 0, true),
          5.5,
          padY(height - y) - 4.5,
        );
      });
    },
    [path, padY, padX],
  );

  return <Canvas {...canvas} className={style} draw={[drawLabels, drawPath]} />;
};

export default HeightProfile;

const style = css`
  width: 100%;
  height: 85px;
  box-shadow: 0 0 1px 0px #a52a2a75;
  border-radius: 2px;
`;
function padHeight(value: number, rate: number, height: number): number {
  const bottomPad = (1 - rate) * height;
  const percentage = (100 * value) / height;
  const outputHeight = height - height * (1 - rate) * 2;
  return bottomPad + (outputHeight / 100) * percentage;
}

function getLineNodes(positions: Position[]): [number, number][] {
  const augmentedPositions = augmentPositions(positions);
  const pathExtremes = getPathExtremes(positions);
  const normalizedPositionCoords = augmentedPositions.map((position) =>
    getNormalizedCoordinates(position, pathExtremes),
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
