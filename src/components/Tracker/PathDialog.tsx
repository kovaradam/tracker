import React from 'react';

import { styled } from '@linaria/react';

import { useTracker } from '../../tracker/use-tracker';
import Dialog from '../Dialog';

type Props = { hide: () => void };

const PathDialog: React.FC<Props> = ({ hide }) => {
  const [, { currentPath }] = useTracker();

  return (
    <Dialog>
      <S.Form>
        <Dialog.FormValue label="name">
          <S.Input />
        </Dialog.FormValue>
        <Dialog.FormValue label="length">5 km</Dialog.FormValue>
        <Dialog.FormValue label="duration">3 h</Dialog.FormValue>
        <Dialog.FormValue label="date">30.5.2021</Dialog.FormValue>
      </S.Form>
      <S.ButtonWrapper>
        <S.Button onClick={hide}>Save</S.Button>
        <S.Button onClick={hide} color="#ff71718a">
          Discard
        </S.Button>
      </S.ButtonWrapper>
    </Dialog>
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
  Form: styled.form`
    padding: 1rem;
  `,
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
  Input: styled.input`
    border-style: none;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    height: 2rem;
  `,
};
