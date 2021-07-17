import { useEffect } from 'react';

import { atom, useAtom } from 'jotai';
import { SetStateAction } from 'jotai/core/types';

import { createWebStorageAccess } from '../utils/web-storage';

type UserStore = {
  preferences: {
    geolocationInterval: number;
  };
};

const defaultValue: UserStore = {
  preferences: {
    geolocationInterval: 1000,
  },
};

const [getUserSettings, setUserSettings] = createWebStorageAccess<typeof defaultValue>(
  'user',
  {
    defaultValue,
    transforms: [JSON.parse, JSON.stringify],
  },
);

const userAtom = atom<typeof defaultValue>(getUserSettings() || defaultValue);

type UseUserReturnType = Pick<UserStore, 'preferences'> & {
  setUser: (update: SetStateAction<UserStore>) => void | Promise<void>;
};

export function useUser(): UseUserReturnType {
  const [user, setUser] = useAtom(userAtom);
  useEffect(() => {
    setUserSettings(user);
  }, [user]);
  return { ...user, setUser };
}
