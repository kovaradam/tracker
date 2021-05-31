import React, { useCallback, useMemo } from 'react';

import { styled } from '@linaria/react';
import { useUpdate } from 'indexeddb-hooked';

import { StoreName } from '../../db/config';
import { Path } from '../../db/model';
import { useCurrentPath } from '../../tracker/use-current-path';
import { useTracker } from '../../tracker/use-tracker';
import Dialog from '../Dialog';

type Props = { hide: () => void };

const PathDialog: React.FC<Props> = ({ hide }) => {
  const [, { currentPath }] = useTracker();
  const [update] = useUpdate<Omit<Path, 'id'>>();
  const deletePath = useCurrentPath()[2];

  const elapsedTime = useMemo(() => {
    const fallbackValue = '0 sec';
    if (!currentPath) {
      return fallbackValue;
    }
    const timestamps = currentPath.positions.map(({ timestamp }) => timestamp);
    if (!timestamps || timestamps.length < 2) {
      return fallbackValue;
    }
    const timeInSeconds = Math.round(
      (timestamps[timestamps.length - 1] - timestamps[0]) / 1000,
    );
    if (timeInSeconds < 60) {
      return `${timeInSeconds} sec`;
    }
    const minutes = Math.round(timeInSeconds / 60) % 60;
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? 's' : ''}, ${timeInSeconds % 60} sec`;
    }
    const hours = Math.round(timeInSeconds / 3600);
    return `${hours} hour${hours === 1 ? 's' : ''}, ${minutes % 60} min`;
  }, [currentPath]);

  const savePath = useCallback(() => {
    if (!currentPath) {
      hide();
      return;
    }
    const positions =
      currentPath.positions.map(({ coords, timestamp }) => ({
        coords: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        timestamp,
      })) || [];
    const newRecord = {
      color: currentPath.color,
      positions,
    };
    update(StoreName.PATHS, {
      value: newRecord,
    });
    hide();
    deletePath();
  }, [hide, currentPath, update, deletePath]);

  const discardPath = useCallback(() => {
    hide();
    deletePath();
  }, [hide, deletePath]);

  return (
    <Dialog>
      <Dialog.Header>New entry</Dialog.Header>
      <S.Form>
        <Dialog.FormValue label="length">5 km</Dialog.FormValue>
        <Dialog.FormValue label="duration">{elapsedTime}</Dialog.FormValue>
        <Dialog.FormValue label="date">
          {new Date().toLocaleDateString()}
        </Dialog.FormValue>
      </S.Form>
      <S.ButtonWrapper>
        <S.Button onClick={savePath}>Save</S.Button>
        <S.Button onClick={discardPath} color="#ff0a0a8a">
          Discard
        </S.Button>
      </S.ButtonWrapper>
    </Dialog>
  );
};

export default PathDialog;

const S = {
  Overlay: styled.div`
    width: 100vw;
    height: 100vh !important;
    position: absolute;
    background-color: #27252555;
    top: 0;
    left: 0;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    animation: show 200ms;

    @keyframes show {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    } ;
  `,
  Wrapper: styled.div`
    width: 70vw;
    height: 70vh;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 0 6px 3px #00000030;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    animation: show 200ms;

    @keyframes show {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    } ;
  `,
  Form: styled.form`
    padding: 0 1rem;
    flex-grow: 1;
  `,
  ButtonWrapper: styled.div`
    width: 100%;
    height: min-content;
    display: flex;
    justify-content: space-around;
  `,
  Button: styled.button<{ color?: string }>`
    color: ${({ color }) => color || 'auto'};
    font-size: 1.5rem;
    padding: 1rem 0;
    box-sizing: border-box;
    width: 50%;
    border: 0px solid #bbb8b8;
    border-top-width: 1px;
    &:first-child {
      border-right-width: 1px;
    }
  `,
};
