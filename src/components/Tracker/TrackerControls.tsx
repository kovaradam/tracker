import React, { useCallback } from 'react';

import { styled } from '@linaria/react';
import { useAtom } from 'jotai';
import { FiX } from 'react-icons/fi';

import useLocationWatcher from '../../geo/use-location-watcher';
import { TrackerWrapperComponent } from './model';
import { trackerState } from './store';

const TrackerControls: TrackerWrapperComponent = ({ isVisible }) => {
  const [, setIsTracking] = useAtom(trackerState);
  const [, { unsubscribeCurrent }] = useLocationWatcher();

  const endTracking = useCallback(() => {
    setIsTracking(false);
    if (unsubscribeCurrent) {
      unsubscribeCurrent();
    }
  }, [setIsTracking, unsubscribeCurrent]);

  return (
    <S.Wrapper isVisible={isVisible}>
      <S.CloseButton onClick={endTracking}>
        <S.CloseIcon />
      </S.CloseButton>
    </S.Wrapper>
  );
};

export default TrackerControls;

const S = {
  Wrapper: styled.div<{ isVisible: boolean }>`
    visibility: ${({ isVisible }): string => (isVisible ? 'auto' : 'hidden')};
  `,
  CloseButton: styled.button`
    top: auto;
    left: auto;
    bottom: 0;
    right: 0;
    position: absolute;
    margin: 2rem;
    border-radius: 50%;
    z-index: 1000;
    padding: 1rem;
    background-color: #fffafac7;
    color: #5b5959;
    font-size: 2rem;
    display: flex;
    box-shadow: var(--common-shadow);
  `,
  CloseIcon: styled(FiX)``,
};
