"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseSHP = parseSHP;
exports.parseSHPInBatches = parseSHPInBatches;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));

var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));

var _asyncIterator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncIterator"));

var _binaryChunkReader = _interopRequireDefault(require("../streaming/binary-chunk-reader"));

var _parseShpHeader = require("./parse-shp-header");

var _parseShpGeometry = require("./parse-shp-geometry");

var LITTLE_ENDIAN = true;
var BIG_ENDIAN = false;
var SHP_HEADER_SIZE = 100;
var SHP_RECORD_HEADER_SIZE = 12;
var STATE = {
  EXPECTING_HEADER: 0,
  EXPECTING_RECORD: 1,
  END: 2,
  ERROR: 3
};

var SHPParser = function () {
  function SHPParser(options) {
    (0, _classCallCheck2.default)(this, SHPParser);
    (0, _defineProperty2.default)(this, "options", {});
    (0, _defineProperty2.default)(this, "binaryReader", new _binaryChunkReader.default({
      maxRewindBytes: SHP_RECORD_HEADER_SIZE
    }));
    (0, _defineProperty2.default)(this, "state", STATE.EXPECTING_HEADER);
    (0, _defineProperty2.default)(this, "result", {
      geometries: []
    });
    this.options = options;
  }

  (0, _createClass2.default)(SHPParser, [{
    key: "write",
    value: function write(arrayBuffer) {
      this.binaryReader.write(arrayBuffer);
      this.state = parseState(this.state, this.result, this.binaryReader, this.options);
    }
  }, {
    key: "end",
    value: function end() {
      this.binaryReader.end();
      this.state = parseState(this.state, this.result, this.binaryReader, this.options);

      if (this.state !== STATE.END) {
        this.state = STATE.ERROR;
        this.result.error = 'SHP incomplete file';
      }
    }
  }]);
  return SHPParser;
}();

function parseSHP(arrayBuffer, options) {
  var shpParser = new SHPParser(options);
  shpParser.write(arrayBuffer);
  shpParser.end();
  return shpParser.result;
}

function parseSHPInBatches(_x, _x2) {
  return _parseSHPInBatches.apply(this, arguments);
}

function _parseSHPInBatches() {
  _parseSHPInBatches = (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee(asyncIterator, options) {
    var parser, headerReturned, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, arrayBuffer;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            parser = new SHPParser(options);
            headerReturned = false;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _context.prev = 4;
            _iterator = (0, _asyncIterator2.default)(asyncIterator);

          case 6:
            _context.next = 8;
            return (0, _awaitAsyncGenerator2.default)(_iterator.next());

          case 8:
            _step = _context.sent;
            _iteratorNormalCompletion = _step.done;
            _context.next = 12;
            return (0, _awaitAsyncGenerator2.default)(_step.value);

          case 12:
            _value = _context.sent;

            if (_iteratorNormalCompletion) {
              _context.next = 27;
              break;
            }

            arrayBuffer = _value;
            parser.write(arrayBuffer);

            if (!(!headerReturned && parser.result.header)) {
              _context.next = 20;
              break;
            }

            headerReturned = true;
            _context.next = 20;
            return parser.result.header;

          case 20:
            if (!(parser.result.geometries.length > 0)) {
              _context.next = 24;
              break;
            }

            _context.next = 23;
            return parser.result.geometries;

          case 23:
            parser.result.geometries = [];

          case 24:
            _iteratorNormalCompletion = true;
            _context.next = 6;
            break;

          case 27:
            _context.next = 33;
            break;

          case 29:
            _context.prev = 29;
            _context.t0 = _context["catch"](4);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 33:
            _context.prev = 33;
            _context.prev = 34;

            if (!(!_iteratorNormalCompletion && _iterator.return != null)) {
              _context.next = 38;
              break;
            }

            _context.next = 38;
            return (0, _awaitAsyncGenerator2.default)(_iterator.return());

          case 38:
            _context.prev = 38;

            if (!_didIteratorError) {
              _context.next = 41;
              break;
            }

            throw _iteratorError;

          case 41:
            return _context.finish(38);

          case 42:
            return _context.finish(33);

          case 43:
            parser.end();

            if (!(parser.result.geometries.length > 0)) {
              _context.next = 47;
              break;
            }

            _context.next = 47;
            return parser.result.geometries;

          case 47:
            return _context.abrupt("return");

          case 48:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 29, 33, 43], [34,, 38, 42]]);
  }));
  return _parseSHPInBatches.apply(this, arguments);
}

function parseState(state, result, binaryReader, options) {
  while (true) {
    try {
      switch (state) {
        case STATE.ERROR:
        case STATE.END:
          return state;

        case STATE.EXPECTING_HEADER:
          var dataView = binaryReader.getDataView(SHP_HEADER_SIZE);

          if (!dataView) {
            return state;
          }

          result.header = (0, _parseShpHeader.parseSHPHeader)(dataView);
          result.progress = {
            bytesUsed: 0,
            bytesTotal: result.header.length,
            rows: 0
          };
          result.currentIndex = 1;
          state = STATE.EXPECTING_RECORD;
          break;

        case STATE.EXPECTING_RECORD:
          while (binaryReader.hasAvailableBytes(SHP_RECORD_HEADER_SIZE)) {
            var recordHeaderView = binaryReader.getDataView(SHP_RECORD_HEADER_SIZE);
            var recordHeader = {
              recordNumber: recordHeaderView.getInt32(0, BIG_ENDIAN),
              byteLength: recordHeaderView.getInt32(4, BIG_ENDIAN) * 2,
              type: recordHeaderView.getInt32(8, LITTLE_ENDIAN)
            };

            if (!binaryReader.hasAvailableBytes(recordHeader.byteLength - 4)) {
              binaryReader.rewind(SHP_RECORD_HEADER_SIZE);
              return state;
            }

            var invalidRecord = recordHeader.byteLength < 4 || recordHeader.type !== result.header.type || recordHeader.recordNumber !== result.currentIndex;

            if (invalidRecord) {
              binaryReader.rewind(SHP_RECORD_HEADER_SIZE - 4);
            } else {
              binaryReader.rewind(4);
              var recordView = binaryReader.getDataView(recordHeader.byteLength);
              var geometry = (0, _parseShpGeometry.parseRecord)(recordView, options);
              result.geometries.push(geometry);
              result.currentIndex++;
              result.progress.rows = result.currentIndex - 1;
            }
          }

          if (binaryReader.ended) {
            state = STATE.END;
          }

          return state;

        default:
          state = STATE.ERROR;
          result.error = "illegal parser state ".concat(state);
          return state;
      }
    } catch (error) {
      state = STATE.ERROR;
      result.error = "SHP parsing failed: ".concat(error === null || error === void 0 ? void 0 : error.message);
      return state;
    }
  }
}
//# sourceMappingURL=parse-shp.js.map