import React, { useEffect, useRef } from 'react';

import { styled } from '@linaria/react';
import { useRead } from 'indexeddb-hooked';

import { StoreName } from '../../db/config';
import { Path, Position } from '../../db/model';
import { getPathDistance } from '../../utils/position-distance';

const canvas = { width: 100, height: 100 };

const HeightProfile: React.FC = () => {
  const canvasElement = useRef<HTMLCanvasElement | null>(null);
  const [paths] = useRead<Path>(StoreName.PATHS);
  if (paths) {
    console.log(getLineNodes(paths[0].positions));
  }

  useEffect(() => {
    if (!canvasElement.current) {
      return;
    }
    const context = canvasElement.current.getContext('2d');
    if (!context) {
      return;
    }
    const { width, height } = canvas;

    context.moveTo(0, 0);
    context.lineTo(width / 3, height / 3);
    context.lineTo(width / 2, height / 1.2);
    context.lineTo(width / 1.2, height);
    context.lineTo(width, height / 3);
    context.stroke();
  }, [canvasElement]);

  return <S.Canvas {...canvas} ref={canvasElement} />;
};

export default HeightProfile;

const S = {
  Canvas: styled.canvas`
    width: 100%;
    height: 50px;
    border: 1px dashed #a52a2a75;
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
