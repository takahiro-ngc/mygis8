import { parseDBF, parseDBFInBatches } from './lib/parsers/parse-dbf';
const VERSION = typeof "3.1.6" !== 'undefined' ? "3.1.6" : 'latest';
export const DBFWorkerLoader = {
  name: 'DBF',
  id: 'dbf',
  module: 'shapefile',
  version: VERSION,
  worker: true,
  category: 'table',
  extensions: ['dbf'],
  mimeTypes: ['application/x-dbf'],
  options: {
    dbf: {
      encoding: 'latin1'
    }
  }
};
export const DBFLoader = { ...DBFWorkerLoader,
  parse: async (arrayBuffer, options) => parseDBF(arrayBuffer, options),
  parseSync: parseDBF,
  parseInBatches: parseDBFInBatches
};
//# sourceMappingURL=dbf-loader.js.map