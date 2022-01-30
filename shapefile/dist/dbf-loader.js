"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBFLoader = exports.DBFWorkerLoader = void 0;
const parse_dbf_1 = require("./lib/parsers/parse-dbf");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
/**
 * DBFLoader - DBF files are used to contain non-geometry columns in Shapefiles
 */
exports.DBFWorkerLoader = {
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
/** DBF file loader */
exports.DBFLoader = {
    ...exports.DBFWorkerLoader,
    parse: async (arrayBuffer, options) => (0, parse_dbf_1.parseDBF)(arrayBuffer, options),
    parseSync: parse_dbf_1.parseDBF,
    parseInBatches: parse_dbf_1.parseDBFInBatches
};
