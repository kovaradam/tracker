import React, { useMemo } from 'react';

import { styled } from '@linaria/react';

import { Path } from '../../db/model';
import { getPositionDistance } from '../../utils/position-distance';
import Dialog from '../Dialog';

type Props = { path: Path };

const PathDetail: React.FC<Props> = ({ path }) => {
  const elapsedTime = useMemo(() => {
    const fallbackValue = formatDuration(0);
    if (!path) {
      return fallbackValue;
    }
    const timestamps = path.positions.map(({ timestamp }) => timestamp);
    if (!timestamps || timestamps.length < 2) {
      return fallbackValue;
    }
    const timeInSeconds = Math.round(
      (timestamps[timestamps.length - 1] - timestamps[0]) / 1000,
    );
    return formatDuration(timeInSeconds);
  }, [path]);

  const pathDistance = useMemo(() => {
    const fallbackValue = formatDistance(0);
    if (!path) {
      return fallbackValue;
    }
    const positions = path.positions.filter((position) => position !== null);
    if (!positions || positions.length < 2) {
      return fallbackValue;
    }
    let sum = 0;
    positions.reduce((prev, current) => {
      sum += getPositionDistance(prev, current);
      return current;
    });
    return formatDistance(sum);
  }, [path]);

  return (
    <S.Wrapper>
      <Dialog.FormValue label="length">{pathDistance}</Dialog.FormValue>
      <Dialog.FormValue label="duration">{elapsedTime}</Dialog.FormValue>
      <Dialog.FormValue label="date">{getDate()}</Dialog.FormValue>
    </S.Wrapper>
  );
};

export default PathDetail;

function getDate(): string {
  return new Date().toLocaleDateString();
}

function formatDistance(inputInMeters: number): string {
  const meters = Math.round(inputInMeters);
  if (meters < 1000) {
    return `${meters} meter${meters === 1 ? '' : 's'}`;
  }
  const km = Math.round(meters / 1000);
  return `${km}.${meters % 1000} km`;
}

function formatDuration(timeInSeconds: number): string {
  if (timeInSeconds < 60) {
    return `${timeInSeconds} seconds`;
  }
  const minutes = Math.round(timeInSeconds / 60) % 60;
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}, ${timeInSeconds % 60} sec`;
  }
  const hours = Math.round(timeInSeconds / 3600);
  return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes % 60} min`;
}

const S = {
  Wrapper: styled.form`
    padding: 0 1rem;
    flex-grow: 1;
  `,
};
