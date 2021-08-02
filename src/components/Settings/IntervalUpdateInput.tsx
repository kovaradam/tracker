import React, { useRef } from 'react';

import { styled } from '@linaria/react';

import { useUser } from '../../user/use-user';

const modeInputId = 'mode-input-id';

export const IntervalUpdateInput: React.FC = () => {
  const { preferences, setUser } = useUser();
  const valueInputElement = useRef<HTMLInputElement>(null);

  const setIntervalValue = (): void => {
    if (!valueInputElement?.current) {
      return;
    }

    setUser((prev) => {
      const newInterval = Number(valueInputElement.current?.value);
      const newPreferences = {
        ...prev.preferences,
        geolocationInterval: newInterval,
      };

      return { ...prev, preferences: newPreferences };
    });
  };

  const toggleIntervalValue = (): void => {
    if (!valueInputElement?.current) {
      return;
    }

    setUser((prev) => {
      const prevInterval = prev.preferences.geolocationInterval;
      const newInterval = prevInterval
        ? undefined
        : Number(valueInputElement.current?.value);
      const newPreferences = {
        ...prev.preferences,
        geolocationInterval: newInterval,
      };

      return { ...prev, preferences: newPreferences };
    });
  };

  return (
    <S.Wrapper>
      <S.Label htmlFor={modeInputId} isSelected={!preferences.geolocationInterval}>
        Auto
      </S.Label>
      <S.ModeInput type="checkbox" id={modeInputId} onInput={toggleIntervalValue} />
      <S.ValueInput
        type="range"
        min="1000"
        max="10000"
        value={preferences.geolocationInterval}
        onInput={setIntervalValue}
        ref={valueInputElement}
        disabled={!preferences.geolocationInterval}
      />
    </S.Wrapper>
  );
};

const S = {
  Wrapper: styled.div`
    display: flex;
    justify-content: space-between;
    --input-green: #c8e6c9;
  `,
  ModeInput: styled.input`
    display: none;
  `,
  ValueInput: styled.input``,
  Label: styled.label<{ isSelected: boolean }>`
    padding: 5px 10px;
    border-radius: 5px;
    background-color: ${({ isSelected }): string => (isSelected ? '#c8e6c9' : '#e0e0e0')};
  `,
};
