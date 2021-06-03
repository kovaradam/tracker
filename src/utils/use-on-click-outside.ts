import { useEffect, useRef } from 'react';

const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  callback?: () => void,
): React.MutableRefObject<T | null> => {
  const element = useRef<T | null>(null);
  const listener = (event: MouseEvent): void => {
    if (
      callback &&
      element.current &&
      document.contains(event.target as Node) &&
      !element.current.contains(event.target as Node)
    ) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener('click', listener);
    return (): void => {
      document.removeEventListener('click', listener);
    };
  });
  return element;
};

export default useOnClickOutside;
