import React from 'react';

import { styled } from '@linaria/react';
import { useRead } from 'indexeddb-hooked';
import { BsThreeDotsVertical } from 'react-icons/bs';

import { StoreName } from '../../db/config';
import { Path } from '../../db/model';
import Dialog from '../Dialog';
import PathDetail from './PathDetail';

type Props = { id: number; hide: () => void };

const PathDetailDialog: React.FC<Props> = ({ id, hide }) => {
  const [path, { isLoading }] = useRead<Path>(StoreName.PATHS, { key: id });

  if (!path) return null;
  return (
    <Dialog onOverlayClick={hide}>
      <S.Header>
        Details
        <S.OptionsButton>
          <BsThreeDotsVertical />
        </S.OptionsButton>
      </S.Header>
      <S.Wrapper>{!isLoading ? <PathDetail path={path} /> : 'Loading'}</S.Wrapper>
    </Dialog>
  );
};

export default PathDetailDialog;

const S = {
  Wrapper: styled.div`
    flex-grow: 1;
  `,
  Header: styled(Dialog.Header)`
    display: flex;
    justify-content: space-between;
  `,
  OptionsButton: styled(Dialog.Button)`
    font-size: 1.4rem;
    margin: 0px;
    padding: 0;
    border-radius: 5px;
  `,
};
