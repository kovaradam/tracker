import React, { useEffect, useRef } from 'react';

import { styled } from '@linaria/react';

type Label = string | JSX.Element;

type Props = { label: Label | Label[]; children?: React.ReactNode };

const [baseAnimationDelay, animationDuration] = [100, 200];

const FormValue = React.forwardRef<HTMLSpanElement, Props>(({ label, children }, ref) => {
  const wrapperElement = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!wrapperElement.current) {
      return;
    }
    const siblingPosition = getElementPositionInSiblings(wrapperElement.current);
    const animationDelay = `${
      baseAnimationDelay + animationDuration * siblingPosition
    }ms`;
    wrapperElement.current.style.animationDelay = animationDelay;
  }, [wrapperElement]);

  return (
    <S.Wrapper ref={wrapperElement}>
      <S.Label>{label}</S.Label>
      <S.Content ref={ref}>{children}</S.Content>
    </S.Wrapper>
  );
});

export default FormValue;

function getElementPositionInSiblings(element: HTMLElement): number {
  let previousSibling = element.previousSibling;
  let i = 0;
  for (; previousSibling !== null; i++) {
    previousSibling = previousSibling.previousSibling;
  }
  return i;
}

const S = {
  Wrapper: styled.div`
    --animation-time: 200ms;
    --animation-init-delay: 100ms;
    height: 3.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 1.2rem;
    padding-left: 0.5rem;
    border-left: 2px dashed #a52a2a75;
    animation: show var(--animation-time) forwards;
    transform: scaleX(0);
    transform-origin: left;

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
    font-weight: 500;
    display: flex;
    align-items: center;
    & * {
      margin-right: 0.3rem;
    }
  `,
  Content: styled.span`
    font-size: 1.3rem;
  `,
};
