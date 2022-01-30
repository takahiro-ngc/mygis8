import { SHP_MAGIC_NUMBER } from './shp-loader';
import { parseShapefile, parseShapefileInBatches } from './lib/parsers/parse-shapefile';
const VERSION = typeof "3.1.6" !== 'undefined' ? "3.1.6" : 'latest';
export const ShapefileLoader = {
  name: 'Shapefile',
  id: 'shapefile',
  module: 'shapefile',
  version: VERSION,
  category: 'geometry',
  extensions: ['shp'],
  mimeTypes: ['application/octet-stream'],
  tests: [new Uint8Array(SHP_MAGIC_NUMBER).buffer],
  options: {
    shapefile: {},
    shp: {
      _maxDimensions: 4
    }
  },
  parse: parseShapefile,
  parseInBatches: parseShapefileInBatches
};
export const _typecheckShapefileLoader = ShapefileLoader;
//# sourceMappingURL=shapefile-loader.js.map