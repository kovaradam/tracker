import React from 'react';

import { styled } from '@linaria/react';

import { useTracker } from '../../tracker/use-tracker';

type Props = { hide: () => void };

const PathDialog: React.FC<Props> = ({ hide }) => {
  const [, { currentPath }] = useTracker();

  return (
    <S.Overlay onClick={hide}>
      <S.Wrapper>
        <S.Form></S.Form>
        <S.ButtonWrapper>
          <S.Button>Save</S.Button>
          <S.Button color="#ff71718a">Discard</S.Button>
        </S.ButtonWrapper>
      </S.Wrapper>
    </S.Overlay>
  );
};

export default PathDialog;

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
  Form: styled.form``,
  ButtonWrapper: styled.div`
    width: 100%;
    height: min-content;
    display: flex;
    justify-content: space-around;
  `,
  Button: styled.button<{ color?: string }>`
    color: ${({ color }) => color || 'auto'};
    font-size: 1.5rem;
    padding: 0.5rem 0;
    margin: 0.5rem 0;
    box-sizing: border-box;
    width: 50%;
    &:first-child {
      border-right: 1px solid #bbb8b8;
    }
  `,
};
