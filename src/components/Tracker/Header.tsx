import React from 'react';

import { styled } from '@linaria/react';

import useLocationWatcher from '../../geo/use-location-watcher';

const Header: React.FC = () => {
  const [, { error }] = useLocationWatcher();

  if (!error) {
    return null;
  }
  return (
    <S.Wrapper>
      <S.Message>{error}</S.Message>
    </S.Wrapper>
  );
};

export default Header;

const S = {
  Wrapper: styled.header`
    position: absolute;
    z-index: 1000;
    top: 0;
    padding: 1rem;
    color: #434363;
  `,
  Message: styled.code`
    border-radius: 5px;
    padding: 0 0.1rem;
    animation: rotate 1s linear;

    @keyframes rotate {
      from {
        background-color: #ff9a4a;
      }

      to {
        background-color: transparent;
      }
    }
  `,
};
