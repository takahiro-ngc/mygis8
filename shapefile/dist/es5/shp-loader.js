"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SHPLoader = exports.SHPWorkerLoader = exports.SHP_MAGIC_NUMBER = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _parseShp = require("./lib/parsers/parse-shp");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var VERSION = typeof "3.1.6" !== 'undefined' ? "3.1.6" : 'latest';
var SHP_MAGIC_NUMBER = [0x00, 0x00, 0x27, 0x0a];
exports.SHP_MAGIC_NUMBER = SHP_MAGIC_NUMBER;
var SHPWorkerLoader = {
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
exports.SHPWorkerLoader = SHPWorkerLoader;

var SHPLoader = _objectSpread(_objectSpread({}, SHPWorkerLoader), {}, {
  parse: function () {
    var _parse = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer, options) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", (0, _parseShp.parseSHP)(arrayBuffer, options));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function parse(_x, _x2) {
      return _parse.apply(this, arguments);
    }

    return parse;
  }(),
  parseSync: _parseShp.parseSHP,
  parseInBatches: _parseShp.parseSHPInBatches
});

exports.SHPLoader = SHPLoader;
//# sourceMappingURL=shp-loader.js.map