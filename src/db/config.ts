import { Path } from './model';

const defaultPaths: Path[] = [
  {
    id: 'id',
    positions: [
      {
        coords: { latitude: 50.103017631955716, longitude: 14.422289852142328 } as any,
        timestamp: 1621773352155,
      },
      {
        coords: { latitude: 50.10202858292974, longitude: 14.433631896972658 } as any,
        timestamp: 1621773352155,
      },
      {
        coords: { latitude: 50.1005421090992, longitude: 14.421529769897463 } as any,
        timestamp: 1621773352155,
      },
    ],
    color: 'blue',
  },
  {
    id: 'current',
    positions: [
      {
        coords: { latitude: 50.108249250710514, longitude: 14.443244934082033 } as any,
        timestamp: 1621773352155,
      },
      {
        coords: { latitude: 50.098560072241156, longitude: 14.443244934082033 } as any,
        timestamp: 1621773352155,
      },
    ],
    color: 'yellow',
  },
];

export enum StoreName {
  PATHS = 'paths',
}

const config = {
  name: 'tracker-db',
  objectStores: [
    {
      name: StoreName.PATHS,
      options: { keyPath: 'id' },
      data: defaultPaths,
    },
  ],
};

export default config;
