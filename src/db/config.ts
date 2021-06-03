import { Config } from 'indexeddb-hooked';

import { Path } from './model';

const defaultPaths: Path[] = [
  {
    id: 0,
    positions: [
      {
        coords: { latitude: 50.103017631955716, longitude: 14.422289852142328 },
        timestamp: 1621773352155,
      },
      {
        coords: { latitude: 50.10202858292974, longitude: 14.433631896972658 },
        timestamp: 1621773352155,
      },
      {
        coords: { latitude: 50.1005421090992, longitude: 14.421529769897463 },
        timestamp: 1621773352155,
      },
    ],
    color: '#0078a8',
  },
  {
    id: 1,
    positions: [
      {
        coords: { latitude: 50.108249250710514, longitude: 14.443244934082033 },
        timestamp: 1621773352155,
      },
      {
        coords: { latitude: 50.098560072241156, longitude: 14.443244934082033 },
        timestamp: 1621773352155,
      },
    ],
    color: '#9a3f50',
  },
];

export enum StoreName {
  PATHS = 'paths',
}

const config: Config = {
  name: 'tracker-db',
  objectStores: [
    {
      name: StoreName.PATHS,
      options: { keyPath: 'id', autoIncrement: true },
      data: defaultPaths,
    },
  ],
};

export default config;
