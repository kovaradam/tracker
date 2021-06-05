import React, { useCallback, useReducer } from 'react';

import { styled } from '@linaria/react';
import { useRead, useUpdate } from 'indexeddb-hooked';
import { BsThreeDotsVertical } from 'react-icons/bs';

import { StoreName } from '../../db/config';
import { Path } from '../../db/model';
import useOnClickOutside from '../../utils/use-on-click-outside';
import Dialog from '../Dialog';
import PathDetail from './PathDetail';

type Props = { id: number; hide: () => void };

const PathDetailDialog: React.FC<Props> = ({ id, hide }) => {
  const [path, { isLoading }] = useRead<Path>(StoreName.PATHS, { key: id });
  const [update] = useUpdate();

  const deletePath = useCallback(() => {
    update(StoreName.PATHS, { value: null, key: id });
  }, [update, id]);

  if (!path) return null;
  return (
    <Dialog onOverlayClick={hide}>
      <S.Header>
        Details
        <MenuWrapper>
          <button onClick={deletePath}>Delete</button>
        </MenuWrapper>
      </S.Header>
      <S.ContentWrapper>
        {!isLoading ? <PathDetail path={path} /> : 'Loading'}
      </S.ContentWrapper>
    </Dialog>
  );
};

export default PathDetailDialog;

const MenuWrapper: React.FC = ({ children }) => {
  const [isMenuOpen, toggleIsMenuOpen] = useReducer((p) => !p, false);
  const wrapperElement = useOnClickOutside<HTMLDivElement>(toggleIsMenuOpen);

  return (
    <S.MenuWrapper ref={wrapperElement}>
      <S.OptionsButton onClick={toggleIsMenuOpen}>
        <BsThreeDotsVertical />
      </S.OptionsButton>
      {isMenuOpen && <S.MenuContentWrapper>{children}</S.MenuContentWrapper>}
    </S.MenuWrapper>
  );
};

const S = {
  ContentWrapper: styled.div`
    flex-grow: 1;
  `,
  Header: styled(Dialog.Header)`
    display: flex;
    justify-content: space-between;
    position: relative;
  `,
  OptionsButton: styled(Dialog.Button)`
    font-size: 1.4rem;
    margin: 0px;
    padding: 0;
    border-radius: 5px;
  `,
  MenuWrapper: styled.div`
    display: flex;
    align-content: center;
  `,
  MenuContentWrapper: styled.menu`
    position: absolute;
    right: 10%;
    top: 50%;
    padding: 0;
    margin: 0;
    border-radius: 5px;
    box-shadow: 0 0 5px 2px #dcdcdc;
    background-color: white;
    display: flex;
    flex-direction: column;
    & > button {
      padding: 0.4rem 2rem;
      border-top: 1px solid #8080801a;
      &:active {
        background-color: #8080801a;
      }
      &:first-child {
        border-top: none;
      }
    }
    animation: show 100ms;
    transform-origin: top right;

    @keyframes show {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    }
  `,
};