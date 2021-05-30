export type Position = {
  coords: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>;
  timestamp: number;
};

export type Path = {
  id: number;
  positions: Position[];
  color: string;
};
