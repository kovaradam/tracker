import { useCallback } from 'react';

import { atom, useAtom } from 'jotai';

import { watchPosition } from './utils';

type Error = string | null;
type Listener = PositionCallback;
type Unsubscribe = ReturnType<typeof watchPosition>;

type HookState = { error: Error; unsubscribeCurrent: Unsubscribe };

const hookState = atom<HookState>({ error: null, unsubscribeCurrent: undefined });

type UseLocationReturntype = [
  subscribe: (listener: Listener) => Unsubscribe,
  state: HookState,
];

function useLocationWatcher(): UseLocationReturntype {
  const [state, setState] = useAtom(hookState);
  const onError = useCallback(
    (event: GeolocationPositionError) => {
      setState((prev) => ({ ...prev, error: event.message }));
    },
    [setState],
  );

  const subscribe = useCallback(
    (listener: Listener, options?: PositionOptions): Unsubscribe => {
      state.unsubscribeCurrent?.();
      const unsubscribeWatcher = watchPosition(listener, onError, options);
      function unsubscribe() {
        unsubscribeWatcher?.();
        setState((prev) => ({ ...prev, unsubscribeCurrent: undefined }));
      }
      setState((prev) => ({
        ...prev,
        unsubscribeCurrent: unsubscribe,
      }));
      return unsubscribe;
    },
    [setState, onError, state],
  );

  return [subscribe, state];
}

export default useLocationWatcher;
