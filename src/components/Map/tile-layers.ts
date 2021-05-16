type TileLayer = { url: string; options?: L.TileLayerOptions };

const tileLayers: Record<string, TileLayer> = {
  openStreetMap: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
};

export default tileLayers;
