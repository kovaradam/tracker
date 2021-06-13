import React, { useEffect, useRef } from 'react';

function useForwardedRef<T>(
  ref: React.ForwardedRef<T | null>,
): React.MutableRefObject<T | null> {
  const innerRef = useRef<T | null>(null);
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === 'function') {
      ref(innerRef.current);
    } else {
      ref.current = innerRef.current;
    }
  });

  return innerRef;
}

export default useForwardedRef;
