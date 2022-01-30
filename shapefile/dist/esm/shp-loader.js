import { parseSHP, parseSHPInBatches } from './lib/parsers/parse-shp';
const VERSION = typeof "3.1.6" !== 'undefined' ? "3.1.6" : 'latest';
export const SHP_MAGIC_NUMBER = [0x00, 0x00, 0x27, 0x0a];
export const SHPWorkerLoader = {
  name: 'SHP',
  id: 'shp',
  module: 'shapefile',
  version: VERSION,
  worker: true,
  category: 'geometry',
  extensions: ['shp'],
  mimeTypes: ['application/octet-stream'],
  tests: [new Uint8Array(SHP_MAGIC_NUMBER).buffer],
  options: {
    shp: {
      _maxDimensions: 4
    }
  }
};
export const SHPLoader = { ...SHPWorkerLoader,
  parse: async (arrayBuffer, options) => parseSHP(arrayBuffer, options),
  parseSync: parseSHP,
  parseInBatches: parseSHPInBatches
};
//# sourceMappingURL=shp-loader.js.map