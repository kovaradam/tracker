import React, { useCallback, useEffect, useRef } from 'react';

import { styled } from '@linaria/react';

import { formatTime } from '../../utils/format-time';

type Props = { className?: string; isActive: boolean };

const defaultValue = formatTime(0);
const timerDelayInMs = 1000;

const Timer: React.FC<Props> = ({ className, isActive }) => {
  const element = useRef<HTMLElement | null>(null);

  const setElementContent = useCallback(
    (formatedTime: string): void => {
      if (element.current) {
        element.current.innerHTML = formatedTime;
      }
    },
    [element],
  );

  useEffect(() => {
    if (!isActive) {
      return;
    }
    const intervald = setInterval(
      updateTimeSinceStart,
      timerDelayInMs,
      createTimeIterator(),
      (timeInSeconds: number) => setElementContent(formatTime(timeInSeconds)),
    );
    return () => {
      clearInterval(intervald);
      setElementContent(defaultValue);
    };
  }, [setElementContent, isActive]);

  return (
    <TimeWrapper ref={element} className={className}>
      {defaultValue}
    </TimeWrapper>
  );
};

export default Timer;

const TimeWrapper = styled.code`
  color: #ffffff;
  font-size: 4rem;
  background-color: #80808054;
  border-radius: 5px;
  padding: 0 5px;
`;

function updateTimeSinceStart(
  timeGenerator: Generator<number>,
  elementUpdater: (time: number) => void,
): void {
  const secondsSinceStart = timeGenerator.next();
  elementUpdater(secondsSinceStart.value);
}

function* createTimeIterator(initValue = 1) {
  let i = initValue;
  while (true) {
    yield i++;
  }
}
