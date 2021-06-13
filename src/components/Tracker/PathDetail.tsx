import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

import { css } from '@linaria/core';
import { styled } from '@linaria/react';
import { read, update } from 'indexeddb-hooked';
import {
  GiPathDistance,
  IoIosTimer,
  BiCalendarWeek,
  HiOutlineColorSwatch,
} from 'react-icons/all';

import { StoreName } from '../../db/config';
import { Path } from '../../db/model';
import { pathColors } from '../../style';
import { CurrentPath } from '../../tracker/use-current-path';
import { useTracker } from '../../tracker/use-tracker';
import formatDistance from '../../utils/format-distance';
import { getPathDistance } from '../../utils/position-distance';
import useAnimatedValueLoading from '../../utils/use-animated-value';
import Dialog from '../Dialog';
import HeightProfile from './HeightProfile';

type Props = { path: Path; updatePath?: (path: NonNullable<CurrentPath>) => void };

const PathDetail: React.FC<Props> = ({ path, updatePath }) => {
  const [, { currentPath }] = useTracker();
  const [, forceUpdate] = useReducer((p) => !p, false);
  const persisted = useRef({ color: path.color, didUpdate: false });

  const isNewPath = currentPath !== null;

  useEffect(
    () => (): void => {
      // update color on unmount
      if (isNewPath || !persisted.current.didUpdate) {
        return;
      }

      read(StoreName.PATHS, { key: path.id }).then((result) => {
        if (!result) {
          return;
        }
        update(StoreName.PATHS, {
          key: path.id,
          value: { color: persisted.current.color },
        });
      });
    },
    [path.id, currentPath, isNewPath],
  );

  const setCurrentColor = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, color: string) => {
      event.preventDefault();
      persisted.current = { color, didUpdate: true };
      forceUpdate();
      if (isNewPath) {
        updatePath?.({ ...path, color });
      }
    },
    [persisted, forceUpdate, updatePath, path, isNewPath],
  );

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
    return getPathDistance(positions);
  }, [path]);

  const distanceTarget = Math.round(pathDistance);
  const distanceFormElement = useAnimatedValueLoading<HTMLSpanElement>({
    target: distanceTarget,
    rate: Math.round(5 * (Math.round(distanceTarget / 1000) + 1)),
    formatter: formatDistance,
  });

  const durationTarget = Math.round(duration);
  const durationFormElement = useAnimatedValueLoading<HTMLSpanElement>({
    target: durationTarget,
    rate: 5 * Math.round(durationTarget / 1000),
    duration: 500,
    formatter: formatDuration,
  });

  const wrapperElement = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const element = wrapperElement?.current;
    function listener(): void {
      if (!element) {
        return;
      }
      const className = wrapperScrollStyle;
      if (element.scrollTop > 0) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    }
    element?.addEventListener('scroll', listener);
    return (): void => element?.removeEventListener('scroll', listener);
  }, [wrapperElement]);

  return (
    <S.Wrapper ref={wrapperElement}>
      <Dialog.FormValue
        ref={distanceFormElement}
        label={[<GiPathDistance />, 'length']}
      />
      <Dialog.FormValue ref={durationFormElement} label={[<IoIosTimer />, 'duration']} />
      <Dialog.FormValue label={[<BiCalendarWeek />, 'date']}>
        {getDate()}
      </Dialog.FormValue>
      <Dialog.FormValue label={[<HiOutlineColorSwatch />, 'color']}>
        <S.ColorPicker>
          {pathColors.map((color) => (
            <S.ColorOptionButton
              onClick={(event): void => setCurrentColor(event, color)}
              fill={color}
              key={color}
              active={color === persisted.current.color}
            />
          ))}
        </S.ColorPicker>
      </Dialog.FormValue>
      <HeightProfile path={path} />
    </S.Wrapper>
  );
};

export default PathDetail;

function getDate(): string {
  return new Date().toLocaleDateString();
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

const wrapperScrollStyle = css`
  box-shadow: 0px 6px 14px -9px #ecebeb inset;
`;

const S = {
  Wrapper: styled.form`
    padding: 0 1rem;
    flex-grow: 1;
    overflow-y: scroll;
    transition: box-shadow 100ms;
  `,
  ColorPicker: styled.menu`
    margin: 0;
    padding: 0;
    display: flex;
  `,
  ColorOptionButton: styled.button<{ fill: string; active: boolean }>`
    background-color: ${({ fill }): string => fill};
    --size: 1.2rem;
    width: var(--size);
    height: var(--size);
    margin-right: 0.5rem;
    border-radius: 2px;
    opacity: ${({ active }): number => (active ? 1 : 0.5)};
    box-shadow: ${({ active, fill }): string =>
      active ? `0 0 0px 4px ${fill}99` : 'none'};
  `,
};
