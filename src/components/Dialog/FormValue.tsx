import React from 'react';

import { styled } from '@linaria/react';

type Props = { label: string };

const FormValue: React.FC<Props> = ({ label, children }) => {
  return (
    <S.Wrapper>
      <S.Label>{label}</S.Label>
      <S.Content>{children}</S.Content>
    </S.Wrapper>
  );
};

export default FormValue;

const S = {
  Wrapper: styled.div`
    height: min-content;
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;
  `,
  Label: styled.label`
    color: #a52a2a75;
    margin-bottom: 0.2rem;
  `,
  Content: styled.span`
    font-size: 2rem; ;
  `,
};
