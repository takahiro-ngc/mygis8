"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHPLoader = exports.SHPWorkerLoader = exports.SHP_MAGIC_NUMBER = void 0;
const parse_shp_1 = require("./lib/parsers/parse-shp");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
exports.SHP_MAGIC_NUMBER = [0x00, 0x00, 0x27, 0x0a];
/**
 * SHP file loader
 */
exports.SHPWorkerLoader = {
    name: 'SHP',
    id: 'shp',
    module: 'shapefile',
    version: VERSION,
    worker: true,
    category: 'geometry',
    extensions: ['shp'],
    mimeTypes: ['application/octet-stream'],
    // ISSUE: This also identifies SHX files, which are identical to SHP for the first 100 bytes...
    tests: [new Uint8Array(exports.SHP_MAGIC_NUMBER).buffer],
    options: {
        shp: {
            _maxDimensions: 4
        }
    }
};
/** SHP file loader */
exports.SHPLoader = {
    ...exports.SHPWorkerLoader,
    parse: async (arrayBuffer, options) => (0, parse_shp_1.parseSHP)(arrayBuffer, options),
    parseSync: parse_shp_1.parseSHP,
    parseInBatches: parse_shp_1.parseSHPInBatches
};
