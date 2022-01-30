"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckShapefileLoader = exports.ShapefileLoader = void 0;

var _shpLoader = require("./shp-loader");

var _parseShapefile = require("./lib/parsers/parse-shapefile");

var VERSION = typeof "3.1.6" !== 'undefined' ? "3.1.6" : 'latest';
var ShapefileLoader = {
  name: 'Shapefile',
  id: 'shapefile',
  module: 'shapefile',
  version: VERSION,
  category: 'geometry',
  extensions: ['shp'],
  mimeTypes: ['application/octet-stream'],
  tests: [new Uint8Array(_shpLoader.SHP_MAGIC_NUMBER).buffer],
  options: {
    shapefile: {},
    shp: {
      _maxDimensions: 4
    }
  },
  parse: _parseShapefile.parseShapefile,
  parseInBatches: _parseShapefile.parseShapefileInBatches
};
exports.ShapefileLoader = ShapefileLoader;
var _typecheckShapefileLoader = ShapefileLoader;
exports._typecheckShapefileLoader = _typecheckShapefileLoader;
//# sourceMappingURL=shapefile-loader.js.map