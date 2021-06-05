import React from 'react';

import { styled } from '@linaria/react';

type Label = string | JSX.Element;

type Props = { label: Label | Label[] };

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
    --animation-time: 200ms;
    --animation-init-delay: 100ms;
    height: min-content;
    display: flex;
    flex-direction: column;
    margin-bottom: 1.2rem;
    padding-left: 0.5rem;
    border-left: 2px dashed #a52a2a75;
    animation: show var(--animation-time) forwards;
    animation-delay: var(--animation-init-delay);
    transform: scaleX(0);
    transform-origin: left;

    &:nth-child(2) {
      animation-delay: calc(1 * var(--animation-time) + var(--animation-init-delay));
    }
    &:nth-child(3) {
      animation-delay: calc(2 * var(--animation-time) + var(--animation-init-delay));
    }

    @keyframes show {
      from {
        transform: scaleX(0);
      }
      to {
        transform: scaleX(1);
      }
    }
  `,
  Label: styled.label`
    color: #a52a2a75;
    margin-bottom: 0.4rem;
    font-weight: 500;

    & * {
      margin-right: 0.5rem;
    }
  `,
  Content: styled.span`
    font-size: 1.3rem;
  `,
};
