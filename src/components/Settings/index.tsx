import React from 'react';

import { styled } from '@linaria/react';
import { atom, useAtom } from 'jotai';
import { FiX, MdUpdate } from 'react-icons/all';

import { Overlay } from '../../style';
import { SettingsItem } from './SettingsItem';
import {IntervalUpdateInput} from './IntervalUpdateInput';

export const settingsViewState = atom(true);

const Settings: React.FC = () => {
  const [isVisible, setIsVisible] = useAtom(settingsViewState);
  const hide = (): void => {
    if (isVisible) {
      setIsVisible(false);
    }
  };

  return (
    <>
      {isVisible && <S.Overlay onClick={hide} />}
      <S.Wrapper isVisible={isVisible}>
        <S.Heading>Preferences</S.Heading>
        <S.CloseButton onClick={hide}>
          <FiX />
        </S.CloseButton>
        <S.Line />
        <S.Form>
          <SettingsItem icon={<MdUpdate />} legend="Location update interval">
            <IntervalUpdateInput />
          </SettingsItem>
        </S.Form>
      </S.Wrapper>
    </>
  );
};

export default Settings;

const S = {
  Overlay: styled(Overlay)`
    z-index: 1000;
  `,
  Wrapper: styled.div<{ isVisible: boolean }>`
    position: absolute;
    height: 80vh;
    width: 100vw;
    bottom: 0;
    background-color: #fffffff7;
    transform: translateY(${({ isVisible }): number => +!isVisible * 100}%);
    transition: transform 150ms ease-in;
    z-index: 1000;
    border-radius: 10px 10px 0 0;
    box-shadow: ${({ isVisible }): string => (isVisible ? 'var(--common-shadow)' : '')};
    padding: 1rem;
    box-sizing: border-box;
  `,
  CloseButton: styled.button`
    position: absolute;
    right: 0;
    top: 0;
    margin: 1rem;
    padding: 0;
    font-size: 1.5rem;
    color: grey;
  `,
  Heading: styled.h1`
    margin: 0;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    transform: translateY(-3px);
    font-weight: normal;
  `,
  Line: styled.hr`
    height: 1px;
    border-width: 0;
    background-color: gray;
    background-color: gray;
    opacity: 0.5;
    margin: 0;
  `,
  Form: styled.form`
    padding-top: 1rem;
  `,
};
