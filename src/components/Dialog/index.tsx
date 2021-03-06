import React from 'react';

import { styled } from '@linaria/react';

import { Overlay } from '../../style';
import useOnClickOutside from '../../utils/use-on-click-outside';
import { Button, ActionButton } from './Buttons';
import FormValue from './FormValue';
import Header from './Header';

type Props = { onOverlayClick?: () => void };

type CompoundType = React.FC<Props> & {
  FormValue: typeof FormValue;
  Header: typeof Header;
  Button: typeof Button;
  ActionButton: typeof ActionButton;
};

const Dialog: CompoundType = ({ children, onOverlayClick }) => {
  const wrapperElement = useOnClickOutside<HTMLDivElement>(onOverlayClick);
  return (
    <S.Overlay>
      <S.Wrapper ref={wrapperElement}>{children}</S.Wrapper>
    </S.Overlay>
  );
};

Dialog.FormValue = FormValue;
Dialog.Header = Header;
Dialog.Button = Button;
Dialog.ActionButton = ActionButton;

export default Dialog;

const S = {
  Overlay: styled(Overlay)``,
  Wrapper: styled.div`
    width: 80vw;
    height: 75vh;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 0 6px 3px #00000030;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    animation: show 200ms;
    overflow: hidden;

    @keyframes show {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    } ;
  `,
};
