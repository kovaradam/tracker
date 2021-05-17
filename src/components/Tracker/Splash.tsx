import React, { useCallback } from 'react';

import { styled } from '@linaria/react';
import { useAtom } from 'jotai';

import useLocationWatcher from '../../geo/use-location-watcher';
import { TrackerWrapperComponent } from './model';
import { trackerState } from './store';

const Splash: TrackerWrapperComponent = ({ isVisible }) => {
  const [, setIsTracking] = useAtom(trackerState);

  const [subscribe] = useLocationWatcher();

  const startTracking = useCallback(() => {
    setIsTracking(true);
    subscribe(console.log);
  }, [setIsTracking, subscribe]);

  return (
    <S.Wrapper isVisible={isVisible}>
      <S.TrackButton onClick={startTracking}>Start trackin'</S.TrackButton>
    </S.Wrapper>
  );
};

export default Splash;

const S = {
  Wrapper: styled.div<{ isVisible: boolean }>`
    top: ${({ isVisible }): number => (isVisible ? 0 : -100)}vh;
    position: absolute;
    z-index: 1000;
    width: 100vw;
    height: 100vh;
    background-color: #ffffffc2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    transition: top 200ms;
  `,
  TrackButton: styled.button`
    background-color: var(--green-main);
    padding: 1rem;
    font-size: 2rem;
    color: white;
    border-radius: 1rem;
  `,
};
