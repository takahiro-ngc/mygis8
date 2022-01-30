"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._typecheckShapefileLoader = exports.ShapefileLoader = void 0;
const shp_loader_1 = require("./shp-loader");
const parse_shapefile_1 = require("./lib/parsers/parse-shapefile");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
/**
 * Shapefile loader
 * @note Shapefile is multifile format and requires providing additional files
 */
exports.ShapefileLoader = {
    name: 'Shapefile',
    id: 'shapefile',
    module: 'shapefile',
    version: VERSION,
    category: 'geometry',
    extensions: ['shp'],
    mimeTypes: ['application/octet-stream'],
    tests: [new Uint8Array(shp_loader_1.SHP_MAGIC_NUMBER).buffer],
    options: {
        shapefile: {},
        shp: {
            _maxDimensions: 4
        }
    },
    parse: parse_shapefile_1.parseShapefile,
    parseInBatches: parse_shapefile_1.parseShapefileInBatches
};
exports._typecheckShapefileLoader = exports.ShapefileLoader;
