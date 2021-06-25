import React from 'react';

import { styled } from '@linaria/react';

import useLocationWatcher from '../../geo/use-location-watcher';

type Props = { className?: string };

const Message: React.FC<Props> = ({ className }) => {
  const [, { error }] = useLocationWatcher();

  if (!error) {
    return null;
  }
  return (
    <S.Wrapper>
      <S.Message className={className}>{error}</S.Message>
    </S.Wrapper>
  );
};

export default Message;

const S = {
  Wrapper: styled.div`
    z-index: 1000;
    top: 0;
    color: #434363;
  `,
  Message: styled.code`
    border-radius: 5px;
    padding: 0 0.1rem;
    animation: alert 1s linear;
    word-wrap: break-word;
    display: inline-block;
    position: absolute;
    max-width: 60vw;
    @keyframes alert {
      from {
        background-color: #ff9a4a;
      }

      to {
        background-color: transparent;
      }
    }
  `,
};
