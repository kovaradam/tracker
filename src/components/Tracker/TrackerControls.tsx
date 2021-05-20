import React from 'react';

import { styled } from '@linaria/react';
import { FiX } from 'react-icons/fi';
import { GoThreeBars } from 'react-icons/go';
import { MdCenterFocusWeak } from 'react-icons/md';

import useMap from '../../map/use-map';
import { useTracker } from '../../tracker/use-tracker';
import Header from './Header';
import { TrackerWrapperComponent } from './model';

const TrackerControls: TrackerWrapperComponent = ({ isVisible }) => {
  const [, { end }] = useTracker();
  const [, { centerMapView }] = useMap();

  return (
    <S.Wrapper isVisible={isVisible}>
      <Header />
      <S.RightPanelWrapper>
        <S.StopButton onClick={end}>Stop</S.StopButton>
      </S.RightPanelWrapper>
      <S.LeftPanelWrapper>
        <S.UtilsButton onClick={centerMapView}>
          <S.CenterIcon />
        </S.UtilsButton>
        <S.UtilsButton>
          <S.SettingsIcon />
        </S.UtilsButton>
      </S.LeftPanelWrapper>
    </S.Wrapper>
  );
};

export default TrackerControls;

const S = {
  Wrapper: styled.div<{ isVisible: boolean }>`
    visibility: ${({ isVisible }): string => (isVisible ? 'auto' : 'hidden')};
    & button {
      z-index: 1000;
      box-shadow: var(--common-shadow);
      width: min-content;
    }
    & > div {
      padding: 1rem;
      position: absolute;
      height: min-content;
      width: min-content;
      display: flex;
      flex-direction: column;
    }
  `,
  RightPanelWrapper: styled.div`
    top: 0;
    right: 0;
    align-items: flex-end;
  `,
  LeftPanelWrapper: styled.div`
    bottom: 0;
    left: 0;
    align-items: flex-start;
  `,
  StopButton: styled.button`
    background-color: var(--base-red);
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
