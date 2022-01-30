"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseShapefileInBatches = parseShapefileInBatches;
exports.parseShapefile = parseShapefile;
exports.loadShapefileSidecarFiles = loadShapefileSidecarFiles;
exports.replaceExtension = replaceExtension;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));

var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));

var _asyncIterator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncIterator"));

var _gis = require("@loaders.gl/gis");

var _proj = require("@math.gl/proj4");

var _parseShx = require("./parse-shx");

var _zipBatchIterators = require("../streaming/zip-batch-iterators");

var _shpLoader = require("../../shp-loader");

var _dbfLoader = require("../../dbf-loader");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function parseShapefileInBatches(_x, _x2, _x3) {
  return _parseShapefileInBatches.apply(this, arguments);
}

function _parseShapefileInBatches() {
  _parseShapefileInBatches = (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee(asyncIterator, options, context) {
    var _ref, _ref$reproject, reproject, _ref$_targetCrs, _targetCrs, _yield$_awaitAsyncGen, shx, cpg, prj, shapeIterable, propertyIterable, dbfResponse, shapeHeader, dbfHeader, iterator, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, item, geometries, properties, _item, geojsonGeometries, features;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref = (options === null || options === void 0 ? void 0 : options.gis) || {}, _ref$reproject = _ref.reproject, reproject = _ref$reproject === void 0 ? false : _ref$reproject, _ref$_targetCrs = _ref._targetCrs, _targetCrs = _ref$_targetCrs === void 0 ? 'WGS84' : _ref$_targetCrs;
            _context.next = 3;
            return (0, _awaitAsyncGenerator2.default)(loadShapefileSidecarFiles(options, context));

          case 3:
            _yield$_awaitAsyncGen = _context.sent;
            shx = _yield$_awaitAsyncGen.shx;
            cpg = _yield$_awaitAsyncGen.cpg;
            prj = _yield$_awaitAsyncGen.prj;
            _context.next = 9;
            return (0, _awaitAsyncGenerator2.default)(context.parseInBatches(asyncIterator, _shpLoader.SHPLoader, options));

          case 9:
            shapeIterable = _context.sent;
            _context.next = 12;
            return (0, _awaitAsyncGenerator2.default)(context.fetch(replaceExtension((context === null || context === void 0 ? void 0 : context.url) || '', 'dbf')));

          case 12:
            dbfResponse = _context.sent;

            if (!dbfResponse.ok) {
              _context.next = 17;
              break;
            }

            _context.next = 16;
            return (0, _awaitAsyncGenerator2.default)(context.parseInBatches(dbfResponse, _dbfLoader.DBFLoader, _objectSpread(_objectSpread({}, options), {}, {
              dbf: {
                encoding: cpg || 'latin1'
              }
            })));

          case 16:
            propertyIterable = _context.sent;

          case 17:
            _context.next = 19;
            return (0, _awaitAsyncGenerator2.default)(shapeIterable.next());

          case 19:
            shapeHeader = _context.sent.value;

            if (!(shapeHeader && shapeHeader.batchType === 'metadata')) {
              _context.next = 24;
              break;
            }

            _context.next = 23;
            return (0, _awaitAsyncGenerator2.default)(shapeIterable.next());

          case 23:
            shapeHeader = _context.sent.value;

          case 24:
            dbfHeader = {};

            if (!propertyIterable) {
              _context.next = 33;
              break;
            }

            _context.next = 28;
            return (0, _awaitAsyncGenerator2.default)(propertyIterable.next());

          case 28:
            dbfHeader = _context.sent.value;

            if (!(dbfHeader && dbfHeader.batchType === 'metadata')) {
              _context.next = 33;
              break;
            }

            _context.next = 32;
            return (0, _awaitAsyncGenerator2.default)(propertyIterable.next());

          case 32:
            dbfHeader = _context.sent.value;

          case 33:
            if (propertyIterable) {
              iterator = (0, _zipBatchIterators.zipBatchIterators)(shapeIterable, propertyIterable);
            } else {
              iterator = shapeIterable;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _context.prev = 36;
            _iterator = (0, _asyncIterator2.default)(iterator);

          case 38:
            _context.next = 40;
            return (0, _awaitAsyncGenerator2.default)(_iterator.next());

          case 40:
            _step = _context.sent;
            _iteratorNormalCompletion = _step.done;
            _context.next = 44;
            return (0, _awaitAsyncGenerator2.default)(_step.value);

          case 44:
            _value = _context.sent;

            if (_iteratorNormalCompletion) {
              _context.next = 58;
              break;
            }

            item = _value;
            geometries = void 0;
            properties = void 0;

            if (!propertyIterable) {
              geometries = item;
            } else {
              _item = (0, _slicedToArray2.default)(item, 2);
              geometries = _item[0];
              properties = _item[1];
            }

            geojsonGeometries = parseGeometries(geometries);
            features = joinProperties(geojsonGeometries, properties);

            if (reproject) {
              features = reprojectFeatures(features, prj, _targetCrs);
            }

            _context.next = 55;
            return {
              encoding: cpg,
              prj: prj,
              shx: shx,
              header: shapeHeader,
              data: features
            };

          case 55:
            _iteratorNormalCompletion = true;
            _context.next = 38;
            break;

          case 58:
            _context.next = 64;
            break;

          case 60:
            _context.prev = 60;
            _context.t0 = _context["catch"](36);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 64:
            _context.prev = 64;
            _context.prev = 65;

            if (!(!_iteratorNormalCompletion && _iterator.return != null)) {
              _context.next = 69;
              break;
            }

            _context.next = 69;
            return (0, _awaitAsyncGenerator2.default)(_iterator.return());

          case 69:
            _context.prev = 69;

            if (!_didIteratorError) {
              _context.next = 72;
              break;
            }

            throw _iteratorError;

          case 72:
            return _context.finish(69);

          case 73:
            return _context.finish(64);

          case 74:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[36, 60, 64, 74], [65,, 69, 73]]);
  }));
  return _parseShapefileInBatches.apply(this, arguments);
}

function parseShapefile(_x4, _x5, _x6) {
  return _parseShapefile.apply(this, arguments);
}

function _parseShapefile() {
  _parseShapefile = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(arrayBuffer, options, context) {
    var _ref2, _ref2$reproject, reproject, _ref2$_targetCrs, _targetCrs, _yield$loadShapefileS, shx, cpg, prj, _yield$context$parse, header, geometries, geojsonGeometries, properties, dbfResponse, features;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _ref2 = (options === null || options === void 0 ? void 0 : options.gis) || {}, _ref2$reproject = _ref2.reproject, reproject = _ref2$reproject === void 0 ? false : _ref2$reproject, _ref2$_targetCrs = _ref2._targetCrs, _targetCrs = _ref2$_targetCrs === void 0 ? 'WGS84' : _ref2$_targetCrs;
            _context2.next = 3;
            return loadShapefileSidecarFiles(options, context);

          case 3:
            _yield$loadShapefileS = _context2.sent;
            shx = _yield$loadShapefileS.shx;
            cpg = _yield$loadShapefileS.cpg;
            prj = _yield$loadShapefileS.prj;
            _context2.next = 9;
            return context.parse(arrayBuffer, _shpLoader.SHPLoader, options);

          case 9:
            _yield$context$parse = _context2.sent;
            header = _yield$context$parse.header;
            geometries = _yield$context$parse.geometries;
            geojsonGeometries = parseGeometries(geometries);
            properties = [];
            _context2.next = 16;
            return context.fetch(replaceExtension(context.url, 'dbf'));

          case 16:
            dbfResponse = _context2.sent;

            if (!dbfResponse.ok) {
              _context2.next = 21;
              break;
            }

            _context2.next = 20;
            return context.parse(dbfResponse, _dbfLoader.DBFLoader, {
              dbf: {
                encoding: cpg || 'latin1'
              }
            });

          case 20:
            properties = _context2.sent;

          case 21:
            features = joinProperties(geojsonGeometries, properties);

            if (reproject) {
              features = reprojectFeatures(features, prj, _targetCrs);
            }

            return _context2.abrupt("return", {
              encoding: cpg,
              prj: prj,
              shx: shx,
              header: header,
              data: features
            });

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _parseShapefile.apply(this, arguments);
}

function parseGeometries(geometries) {
  var geojsonGeometries = [];

  var _iterator2 = _createForOfIteratorHelper(geometries),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var geom = _step2.value;
      geojsonGeometries.push((0, _gis.binaryToGeometry)(geom));
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return geojsonGeometries;
}

function joinProperties(geometries, properties) {
  var features = [];

  for (var i = 0; i < geometries.length; i++) {
    var geometry = geometries[i];
    var feature = {
      type: 'Feature',
      geometry: geometry,
      properties: properties && properties[i] || {}
    };
    features.push(feature);
  }

  return features;
}

function reprojectFeatures(features, sourceCrs, targetCrs) {
  if (!sourceCrs && !targetCrs) {
    return features;
  }

  var projection = new _proj.Proj4Projection({
    from: sourceCrs || 'WGS84',
    to: targetCrs || 'WGS84'
  });
  return (0, _gis.transformGeoJsonCoords)(features, function (coord) {
    return projection.project(coord);
  });
}

function loadShapefileSidecarFiles(_x7, _x8) {
  return _loadShapefileSidecarFiles.apply(this, arguments);
}

function _loadShapefileSidecarFiles() {
  _loadShapefileSidecarFiles = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(options, context) {
    var url, fetch, shxPromise, cpgPromise, prjPromise, shx, cpg, prj, shxResponse, arrayBuffer, cpgResponse, prjResponse;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            url = context.url, fetch = context.fetch;
            shxPromise = fetch(replaceExtension(url, 'shx'));
            cpgPromise = fetch(replaceExtension(url, 'cpg'));
            prjPromise = fetch(replaceExtension(url, 'prj'));
            _context3.next = 6;
            return Promise.all([shxPromise, cpgPromise, prjPromise]);

          case 6:
            _context3.next = 8;
            return shxPromise;

          case 8:
            shxResponse = _context3.sent;

            if (!shxResponse.ok) {
              _context3.next = 14;
              break;
            }

            _context3.next = 12;
            return shxResponse.arrayBuffer();

          case 12:
            arrayBuffer = _context3.sent;
            shx = (0, _parseShx.parseShx)(arrayBuffer);

          case 14:
            _context3.next = 16;
            return cpgPromise;

          case 16:
            cpgResponse = _context3.sent;

            if (!cpgResponse.ok) {
              _context3.next = 21;
              break;
            }

            _context3.next = 20;
            return cpgResponse.text();

          case 20:
            cpg = _context3.sent;

          case 21:
            _context3.next = 23;
            return prjPromise;

          case 23:
            prjResponse = _context3.sent;

            if (!prjResponse.ok) {
              _context3.next = 28;
              break;
            }

            _context3.next = 27;
            return prjResponse.text();

          case 27:
            prj = _context3.sent;

          case 28:
            return _context3.abrupt("return", {
              shx: shx,
              cpg: cpg,
              prj: prj
            });

          case 29:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _loadShapefileSidecarFiles.apply(this, arguments);
}

function replaceExtension(url, newExtension) {
  var baseName = basename(url);
  var extension = extname(url);
  var isUpperCase = extension === extension.toUpperCase();

  if (isUpperCase) {
    newExtension = newExtension.toUpperCase();
  }

  return "".concat(baseName, ".").concat(newExtension);
}

function basename(url) {
  var extIndex = url && url.lastIndexOf('.');

  if (typeof extIndex === 'number') {
    return extIndex >= 0 ? url.substr(0, extIndex) : '';
  }

  return extIndex;
}

function extname(url) {
  var extIndex = url && url.lastIndexOf('.');

  if (typeof extIndex === 'number') {
    return extIndex >= 0 ? url.substr(extIndex + 1) : '';
  }

  return extIndex;
}
//# sourceMappingURL=parse-shapefile.js.map