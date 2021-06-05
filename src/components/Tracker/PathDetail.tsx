import React, { useMemo } from 'react';

import { styled } from '@linaria/react';
import { GiPathDistance, IoIosTimer, BiCalendarWeek } from 'react-icons/all';

import { Path } from '../../db/model';
import { getPositionDistance } from '../../utils/position-distance';
import useAnimatedValueLoading from '../../utils/use-loading-value';
import Dialog from '../Dialog';

type Props = { path: Path };

const PathDetail: React.FC<Props> = ({ path }) => {
  const duration = useMemo(() => {
    const fallbackValue = 0;
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
    return timeInSeconds;
  }, [path]);

  const pathDistance = useMemo(() => {
    const fallbackValue = 0;
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
    return sum;
  }, [path]);

  const distanceTarget = Math.round(pathDistance);
  const distanceFormElement = useAnimatedValueLoading<HTMLSpanElement>({
    target: distanceTarget,
    rate: Math.round(5 * Math.round(distanceTarget / 1000)),
    formatter: formatDistance,
  });

  const durationTarget = Math.round(duration);
  const durationFormElement = useAnimatedValueLoading<HTMLSpanElement>({
    target: durationTarget,
    rate: 5 * Math.round(durationTarget / 1000),
    duration: 500,
    formatter: formatDuration,
  });

  return (
    <S.Wrapper>
      <Dialog.FormValue
        ref={distanceFormElement}
        label={[<GiPathDistance />, 'length']}
      ></Dialog.FormValue>
      <Dialog.FormValue
        ref={durationFormElement}
        label={[<IoIosTimer />, 'duration']}
      ></Dialog.FormValue>
      <Dialog.FormValue label={[<BiCalendarWeek />, 'date']}>
        {getDate()}
      </Dialog.FormValue>
      <div />
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
  const minutes = Math.round(timeInSeconds / 60);
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
    overflow-y: scroll;
  `,
};
