import React from 'react';

import { styled } from '@linaria/react';

import icon from '../../assets/icon.svg';
import { useTracker } from '../../tracker/use-tracker';
import { TrackerWrapperComponent } from './';

const Splash: TrackerWrapperComponent = ({ isVisible }) => {
  const [, { start }] = useTracker();

  return (
    <S.Wrapper isVisible={isVisible}>
      <S.AppIcon src={icon} title="app icon" />
      <S.TrackButton onClick={start}>Start trackin'</S.TrackButton>
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
  AppIcon: styled.img`
    font-size: 10rem;
    color: gray;
    margin-bottom: 5vh;
    outline: white;
    width: 50vh;
  `,
};
