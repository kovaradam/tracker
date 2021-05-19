import React, { useCallback } from 'react';

import { styled } from '@linaria/react';
import { FiX } from 'react-icons/fi';
import { MdCenterFocusWeak } from 'react-icons/md';

import { getLatLngTuple } from '../../geo/utils';
import useMap from '../../map/use-map';
import { TrackerWrapperComponent } from './model';
import { useTracker } from './store';

const TrackerControls: TrackerWrapperComponent = ({ isVisible }) => {
  const [, { end }] = useTracker();
  const [map] = useMap();
  const [position] = useTracker();

  const centerMapView = useCallback(() => {
    const newMapViewPosition = getLatLngTuple(position);
    if (newMapViewPosition) {
      map?.setView(newMapViewPosition);
    }
  }, [position, map]);

  return (
    <S.Wrapper isVisible={isVisible}>
      <S.Button onClick={end}>
        <S.CloseIcon />
      </S.Button>
      <S.Button onClick={centerMapView}>
        <S.CenterIcon />
      </S.Button>
    </S.Wrapper>
  );
};

export default TrackerControls;

const S = {
  Wrapper: styled.div<{ isVisible: boolean }>`
    visibility: ${({ isVisible }): string => (isVisible ? 'auto' : 'hidden')};
  `,
  Button: styled.button`
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
  CenterIcon: styled(MdCenterFocusWeak)``,
};
