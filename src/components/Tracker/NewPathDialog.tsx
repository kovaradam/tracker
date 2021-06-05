import React, { useCallback, useRef } from 'react';

import { styled } from '@linaria/react';
import { useUpdate } from 'indexeddb-hooked';

import { StoreName } from '../../db/config';
import { Path } from '../../db/model';
import { CurrentPath, useCurrentPath } from '../../tracker/use-current-path';
import { useTracker } from '../../tracker/use-tracker';
import Dialog from '../Dialog';
import PathDetail from './PathDetail';

type Props = { hide: () => void };

const NewPathDialog: React.FC<Props> = ({ hide }) => {
  const [, { currentPath }] = useTracker();
  const [update] = useUpdate<Omit<Path, 'id'>>();
  const deletePath = useCurrentPath()[2];

  const persistedPath = useRef(currentPath);

  const savePath = useCallback(() => {
    if (!persistedPath.current) {
      hide();
      return;
    }
    const positions =
      persistedPath.current.positions.map(({ coords, timestamp }) => ({
        coords: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        timestamp,
      })) || [];
    const newRecord = {
      color: persistedPath.current.color,
      positions,
    };
    update(StoreName.PATHS, {
      value: newRecord,
    });
    hide();
    deletePath();
  }, [hide, persistedPath, update, deletePath]);

  const discardPath = useCallback(() => {
    hide();
    deletePath();
  }, [hide, deletePath]);

  const updatePath = useCallback(
    (path: NonNullable<CurrentPath>) => {
      persistedPath.current = path;
    },
    [persistedPath],
  );

  return (
    <Dialog>
      <Dialog.Header>New entry</Dialog.Header>
      {persistedPath.current && (
        <PathDetail updatePath={updatePath} path={persistedPath.current} />
      )}
      <S.ButtonWrapper>
        <S.Button onClick={savePath}>Save</S.Button>
        <S.Button onClick={discardPath} color="var(--discard-red)">
          Discard
        </S.Button>
      </S.ButtonWrapper>
    </Dialog>
  );
};

export default NewPathDialog;

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

  ButtonWrapper: styled.div`
    width: 100%;
    height: min-content;
    display: flex;
    justify-content: space-around;
  `,
  Button: styled(Dialog.Button)<{ color?: string }>`
    color: ${({ color }) => color || 'auto'};
    font-size: 1.2rem;
    padding: 0.8rem 0;
    box-sizing: border-box;
    width: 50%;
    border: 0px solid #bbb8b842;
    border-top-width: 1px;
    &:first-child {
      border-right-width: 1px;
    }
    &:active {
      background-color: #f5f5f5;
    }
  `,
};
