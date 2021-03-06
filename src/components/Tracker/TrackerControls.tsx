import React, { useCallback, useMemo, useReducer } from 'react';

import { styled } from '@linaria/react';
import { atom, useAtom } from 'jotai';
import { FiX } from 'react-icons/fi';
import { GoThreeBars } from 'react-icons/go';
import { MdCenterFocusWeak } from 'react-icons/md';

import useMap from '../../map/use-map';
import { useTracker } from '../../tracker/use-tracker';
import formatDistance from '../../utils/format-distance';
import { getPathDistance } from '../../utils/position-distance';
import { settingsViewState } from '../Settings/index';
import { TrackerWrapperComponent } from './';
import Message from './Message';
import NewPathDialog from './NewPathDialog';
import PathDetailDialog from './PathDetailDialog';
import Timer from './Timer';

export const selectedPathIdAtom = atom<null | number>(null);

const TrackerControls: TrackerWrapperComponent = ({ isVisible }) => {
  const [, { end, start, isTracking, currentPath }] = useTracker();
  const [, { centerMapView }] = useMap();
  const [isPathDialogVisible, toggleIsPathDialogVisible] = useReducer((p) => !p, false);
  const [selectedPathId, setSelectedPathId] = useAtom(selectedPathIdAtom);
  const [, setIsSettingsVisible] = useAtom(settingsViewState);

  const showSettings = (): void => setIsSettingsVisible(true) as void;

  const toggleTracker = useCallback(() => {
    if (isTracking) {
      end();
      toggleIsPathDialogVisible();
    } else {
      start();
    }
  }, [isTracking, start, end]);

  const pathDistance = useMemo((): string => {
    if (!currentPath) {
      return formatDistance(0);
    }
    return formatDistance(getPathDistance(currentPath.positions));
  }, [currentPath]);

  return (
    <S.Wrapper isVisible={isVisible}>
      <S.TopPanelWrapper>
        <S.StateButton onClick={toggleTracker} isTracking={isTracking}>
          {isTracking ? 'Stop' : 'Start'}
        </S.StateButton>
        <Message />
        <S.DistanceWrapper isHidden={!isTracking}>{pathDistance}</S.DistanceWrapper>
      </S.TopPanelWrapper>
      <S.LeftPanelWrapper isVisible={!isTracking}>
        <S.UtilsButton onClick={centerMapView}>
          <S.CenterIcon />
        </S.UtilsButton>
        <S.UtilsButton onClick={showSettings}>
          <S.SettingsIcon />
        </S.UtilsButton>
      </S.LeftPanelWrapper>
      <S.BottomPanelWrapper isVisible={isTracking}>
        <Timer isActive={isTracking} />
      </S.BottomPanelWrapper>
      {isPathDialogVisible && <NewPathDialog hide={toggleIsPathDialogVisible} />}
      {selectedPathId !== null && (
        <PathDetailDialog
          id={selectedPathId}
          hide={(): void => {
            setSelectedPathId(null);
          }}
        />
      )}
    </S.Wrapper>
  );
};

export default TrackerControls;

const S = {
  Wrapper: styled.div<{ isVisible: boolean }>`
    visibility: ${({ isVisible }): string => (isVisible ? 'auto' : 'hidden')};
    & > div > button {
      box-shadow: var(--common-shadow);
      width: min-content;
      height: min-content;
    }
    & > div {
      z-index: 1000;
      padding: 1rem;
      position: fixed;
      display: flex;
    }
  `,
  TopPanelWrapper: styled.div`
    top: 0;
    right: 0;
    align-items: space-between;
    justify-content: space-between;
    flex-direction: row-reverse;
    width: 100vw;
    padding: 0;
    box-sizing: border-box;
  `,

  LeftPanelWrapper: styled.div<{ isVisible: boolean }>`
    width: min-content;
    flex-direction: column;
    bottom: 0;
    left: ${({ isVisible }): number => (isVisible ? 0 : -80)}px;
    transition: left 200ms;
    align-items: flex-start;
  `,
  BottomPanelWrapper: styled.div<{ isVisible: boolean }>`
    bottom: ${({ isVisible }): number => (isVisible ? 0 : -100)}px;
    transition: bottom 200ms;
    right: 0;
    align-items: center;
    justify-content: center;
    width: 100vw;
    box-sizing: border-box;
  `,

  StateButton: styled.button<{ isTracking: boolean }>`
    background-color: ${({ isTracking }): string =>
      isTracking ? 'var(--base-red)' : 'var(--green-main)'};
    border-radius: 10px;
    color: white;
    padding: 0.5rem;
    font-size: 1.5rem;
    z-index: 1;
  `,
  UtilsButton: styled.button`
    font-size: 1.5rem;
    padding: 1rem;
    border-radius: 50%;
    background-color: #fffafac7;
    color: #5b5959;
    display: flex;
    margin-top: 1rem;
  `,
  CloseIcon: styled(FiX)``,
  CenterIcon: styled(MdCenterFocusWeak)``,
  SettingsIcon: styled(GoThreeBars)``,
  DistanceWrapper: styled.code<{ isHidden: boolean }>`
    position: absolute;
    bottom: 0;
    transition: all 200ms;
    transform: translateX(${({ isHidden }): number => (isHidden ? 120 : 0)}%);
    margin-bottom: -25px;
    visibility: ${({ isHidden }): string => (isHidden ? 'hidden' : 'visible')};
    background-color: #80808054;
    border-radius: 5px;
    padding: 5px;
    color: white;
  `,
};
