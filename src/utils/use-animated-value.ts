import { useEffect, useRef } from 'react';

function useAnimatedValueLoading<T extends HTMLElement = HTMLElement>(options: {
  target: number;
  duration?: number;
  rate?: number;
  start?: number;
  formatter?: (value: number) => string;
}): React.MutableRefObject<T | null> {
  const { target } = options;
  const timeout = (options.duration || 1) / target;
  const rate = options.rate || 1;
  const formatter = options.formatter || String;
  const start = options.rate || 0;

  const element = useRef<T | null>(null);
  useEffect(() => {
    (function iterateWithTimeout(iteration: number): void {
      setTimeout(() => {
        if (!element.current) {
          return;
        }
        const value = formatter(iteration);
        element.current.innerHTML = value;
        if (iteration < target) {
          iterateWithTimeout(iteration + rate);
        } else {
          element.current.innerHTML = formatter(target);
        }
      }, timeout);
    })(start);
    // iterateWithTimeout(start);
  }, [element, target, timeout, rate, formatter, start]);
  return element;
}

export default useAnimatedValueLoading;
