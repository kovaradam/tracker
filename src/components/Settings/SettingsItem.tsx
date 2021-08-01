import React, { useReducer } from 'react';

import { styled } from '@linaria/react';
import { IoIosArrowDown } from 'react-icons/io';

type Props = { icon: React.ReactNode; legend: string };

export const SettingsItem: React.FC<Props> = ({ icon, legend, children }) => {
  const [isOpen, toggleIsOpen] = useReducer((p) => !p, true);
  return (
    <S.Wrapper isOpen={isOpen}>
      <S.Legend onClick={toggleIsOpen}>
        {icon}
        <S.LegendContent>{legend}</S.LegendContent>
        <S.Marker>
          <IoIosArrowDown />
        </S.Marker>
      </S.Legend>
      <div>
        <S.ContentWrapper>{children}</S.ContentWrapper>
      </div>
    </S.Wrapper>
  );
};

const S = {
  Wrapper: styled.fieldset<{ isOpen: boolean }>`
    --active-grey: ${({ isOpen }): string => (isOpen ? '#dbd9d936' : 'transparent')};
    --transition-time: 100ms;
    padding: 0;
    margin: 0;
    border: none;
    background-color: var(--active-grey);

    border-top: 2rem solid var(--active-grey);
    border-radius: 5px;
    box-shadow: 0px 0 0px 5px var(--active-grey);

    & > legend > marker > svg {
      transform: rotate(${({ isOpen }): number => +isOpen * 180}deg);
      transition: transform var(--transition-time);
    }

    & > div {
      overflow: hidden;
    }
    & > div > section {
      transform: translateY(${({ isOpen }): number => +!isOpen * -100}%);
      transition: transform var(--transition-time);
    }
  `,
  Legend: styled.legend`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    gap: 1rem;
    padding: 0;
    font-size: 1rem;

    & > svg {
      color: grey;
      font-size: 1.5rem;
    }
  `,
  LegendContent: styled.h2`
    font-size: 1rem;
    flex-grow: 2;
    font-weight: 400;
  `,
  Marker: styled.marker``,
  ContentWrapper: styled.section`
    padding: 1rem;
    display: flex;
    flex-direction: column;
  `,
};
