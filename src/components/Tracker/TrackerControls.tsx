import React, { useCallback } from 'react';

import { styled } from '@linaria/react';
import { FiX } from 'react-icons/fi';
import { GoThreeBars } from 'react-icons/go';
import { MdCenterFocusWeak } from 'react-icons/md';

import useMap from '../../map/use-map';
import { useTracker } from '../../tracker/use-tracker';
import { TrackerWrapperComponent } from './';
import Message from './Message';
import Timer from './Timer';

const TrackerControls: TrackerWrapperComponent = ({ isVisible }) => {
  const [, { end, start, isTracking }] = useTracker();
  const [, { centerMapView }] = useMap();

  const toggleTracker = useCallback(() => {
    (isTracking ? end : start)();
  }, [isTracking, start, end]);

  return (
    <S.Wrapper isVisible={isVisible}>
      <S.TopPanelWrapper>
        <S.StateButton onClick={toggleTracker} isTracking={isTracking}>
          {isTracking ? 'Stop' : 'Start'}
        </S.StateButton>
        <Message />
      </S.TopPanelWrapper>
      <S.LeftPanelWrapper isVisible={!isTracking}>
        <S.UtilsButton onClick={centerMapView}>
          <S.CenterIcon />
        </S.UtilsButton>
        <S.UtilsButton>
          <S.SettingsIcon />
        </S.UtilsButton>
      </S.LeftPanelWrapper>
      <S.BottomPanelWrapper isVisible={isTracking}>
        <Timer isActive={isTracking} />
      </S.BottomPanelWrapper>
    </S.Wrapper>
  );
};

export default TrackerControls;

const S = {
  Wrapper: styled.div<{ isVisible: boolean }>`
    visibility: ${({ isVisible }): string => (isVisible ? 'auto' : 'hidden')};
    & button {
      box-shadow: var(--common-shadow);
      width: min-content;
      height: min-content;
    }
    & > div {
      z-index: 1000;
      padding: 1rem;
      position: fixed;
      height: min-content;
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
};
