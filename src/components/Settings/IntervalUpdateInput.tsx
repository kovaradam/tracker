import React from 'react';

import { styled } from '@linaria/react';

import { useUser } from '../../user/use-user';

const modeInputId = 'mode-input-id';

export const IntervalUpdateInput: React.FC = () => {
  const { preferences, setUser } = useUser();

  const setIntervalValue = (event: React.FormEvent<HTMLInputElement>): void => {
    setUser((prev) => {
      const newInterval = Number((event.target as HTMLInputElement).value);
      const newPreferences = {
        ...prev.preferences,
        geolocationInterval: newInterval,
      };

      return { ...prev, preferences: newPreferences };
    });
  };

  return (
    <S.Wrapper>
      <S.Label htmlFor={modeInputId}>Auto:</S.Label>
      <S.ModeInput type="checkbox" id={modeInputId} />
      <S.ValueInput
        type="range"
        min="1000"
        max="10000"
        value={preferences.geolocationInterval}
      onInput={setIntervalValue}
      />
    </S.Wrapper>
  );
};

const S = {
  Wrapper: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  ModeInput: styled.input``,
  ValueInput: styled.input`
    background-color: inherit;
    border: none;
    outline: none;
    &:focus {
      background-color: white;
    }
  `,
  Label: styled.label``,
};
