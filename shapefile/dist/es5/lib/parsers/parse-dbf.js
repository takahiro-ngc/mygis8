"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDBF = parseDBF;
exports.parseDBFInBatches = parseDBFInBatches;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));

var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));

var _asyncIterator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncIterator"));

var _schema = require("@loaders.gl/schema");

var _binaryChunkReader = _interopRequireDefault(require("../streaming/binary-chunk-reader"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var LITTLE_ENDIAN = true;
var DBF_HEADER_SIZE = 32;
var STATE;

(function (STATE) {
  STATE[STATE["START"] = 0] = "START";
  STATE[STATE["FIELD_DESCRIPTORS"] = 1] = "FIELD_DESCRIPTORS";
  STATE[STATE["FIELD_PROPERTIES"] = 2] = "FIELD_PROPERTIES";
  STATE[STATE["END"] = 3] = "END";
  STATE[STATE["ERROR"] = 4] = "ERROR";
})(STATE || (STATE = {}));

var DBFParser = function () {
  function DBFParser(options) {
    (0, _classCallCheck2.default)(this, DBFParser);
    (0, _defineProperty2.default)(this, "binaryReader", new _binaryChunkReader.default());
    (0, _defineProperty2.default)(this, "textDecoder", void 0);
    (0, _defineProperty2.default)(this, "state", STATE.START);
    (0, _defineProperty2.default)(this, "result", {
      data: []
    });
    this.textDecoder = new TextDecoder(options.encoding);
  }

  (0, _createClass2.default)(DBFParser, [{
    key: "write",
    value: function write(arrayBuffer) {
      this.binaryReader.write(arrayBuffer);
      this.state = parseState(this.state, this.result, this.binaryReader, this.textDecoder);
    }
  }, {
    key: "end",
    value: function end() {
      this.binaryReader.end();
      this.state = parseState(this.state, this.result, this.binaryReader, this.textDecoder);

      if (this.state !== STATE.END) {
        this.state = STATE.ERROR;
        this.result.error = 'DBF incomplete file';
      }
    }
  }]);
  return DBFParser;
}();

function parseDBF(arrayBuffer) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var loaderOptions = options.dbf || {};
  var encoding = loaderOptions.encoding;
  var dbfParser = new DBFParser({
    encoding: encoding
  });
  dbfParser.write(arrayBuffer);
  dbfParser.end();
  var _dbfParser$result = dbfParser.result,
      data = _dbfParser$result.data,
      schema = _dbfParser$result.schema;

  switch (options.tables && options.tables.format) {
    case 'table':
      return {
        schema: schema,
        rows: data
      };

    case 'rows':
    default:
      return data;
  }
}

function parseDBFInBatches(_x) {
  return _parseDBFInBatches.apply(this, arguments);
}

function _parseDBFInBatches() {
  _parseDBFInBatches = (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee(asyncIterator) {
    var options,
        loaderOptions,
        encoding,
        parser,
        headerReturned,
        _iteratorNormalCompletion,
        _didIteratorError,
        _iteratorError,
        _iterator,
        _step,
        _value,
        arrayBuffer,
        _args = arguments;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            loaderOptions = options.dbf || {};
            encoding = loaderOptions.encoding;
            parser = new DBFParser({
              encoding: encoding
            });
            headerReturned = false;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _context.prev = 7;
            _iterator = (0, _asyncIterator2.default)(asyncIterator);

          case 9:
            _context.next = 11;
            return (0, _awaitAsyncGenerator2.default)(_iterator.next());

          case 11:
            _step = _context.sent;
            _iteratorNormalCompletion = _step.done;
            _context.next = 15;
            return (0, _awaitAsyncGenerator2.default)(_step.value);

          case 15:
            _value = _context.sent;

            if (_iteratorNormalCompletion) {
              _context.next = 30;
              break;
            }

            arrayBuffer = _value;
            parser.write(arrayBuffer);

            if (!(!headerReturned && parser.result.dbfHeader)) {
              _context.next = 23;
              break;
            }

            headerReturned = true;
            _context.next = 23;
            return parser.result.dbfHeader;

          case 23:
            if (!(parser.result.data.length > 0)) {
              _context.next = 27;
              break;
            }

            _context.next = 26;
            return parser.result.data;

          case 26:
            parser.result.data = [];

          case 27:
            _iteratorNormalCompletion = true;
            _context.next = 9;
            break;

          case 30:
            _context.next = 36;
            break;

          case 32:
            _context.prev = 32;
            _context.t0 = _context["catch"](7);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 36:
            _context.prev = 36;
            _context.prev = 37;

            if (!(!_iteratorNormalCompletion && _iterator.return != null)) {
              _context.next = 41;
              break;
            }

            _context.next = 41;
            return (0, _awaitAsyncGenerator2.default)(_iterator.return());

          case 41:
            _context.prev = 41;

            if (!_didIteratorError) {
              _context.next = 44;
              break;
            }

            throw _iteratorError;

          case 44:
            return _context.finish(41);

          case 45:
            return _context.finish(36);

          case 46:
            parser.end();

            if (!(parser.result.data.length > 0)) {
              _context.next = 50;
              break;
            }

            _context.next = 50;
            return parser.result.data;

          case 50:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[7, 32, 36, 46], [37,, 41, 45]]);
  }));
  return _parseDBFInBatches.apply(this, arguments);
}

function parseState(state, result, binaryReader, textDecoder) {
  while (true) {
    try {
      switch (state) {
        case STATE.ERROR:
        case STATE.END:
          return state;

        case STATE.START:
          var dataView = binaryReader.getDataView(DBF_HEADER_SIZE, 'DBF header');

          if (!dataView) {
            return state;
          }

          result.dbfHeader = parseDBFHeader(dataView);
          result.progress = {
            bytesUsed: 0,
            rowsTotal: result.dbfHeader.nRecords,
            rows: 0
          };
          state = STATE.FIELD_DESCRIPTORS;
          break;

        case STATE.FIELD_DESCRIPTORS:
          var fieldDescriptorView = binaryReader.getDataView(result.dbfHeader.headerLength - DBF_HEADER_SIZE, 'DBF field descriptors');

          if (!fieldDescriptorView) {
            return state;
          }

          result.dbfFields = parseFieldDescriptors(fieldDescriptorView, textDecoder);
          result.schema = new _schema.Schema(result.dbfFields.map(function (dbfField) {
            return makeField(dbfField);
          }));
          state = STATE.FIELD_PROPERTIES;
          binaryReader.skip(1);
          break;

        case STATE.FIELD_PROPERTIES:
          var _ref = (result === null || result === void 0 ? void 0 : result.dbfHeader) || {},
              _ref$recordLength = _ref.recordLength,
              recordLength = _ref$recordLength === void 0 ? 0 : _ref$recordLength,
              _ref$nRecords = _ref.nRecords,
              nRecords = _ref$nRecords === void 0 ? 0 : _ref$nRecords;

          while (result.data.length < nRecords) {
            var recordView = binaryReader.getDataView(recordLength - 1);

            if (!recordView) {
              return state;
            }

            binaryReader.skip(1);
            var row = parseRow(recordView, result.dbfFields, textDecoder);
            result.data.push(row);
            result.progress.rows = result.data.length;
          }

          state = STATE.END;
          break;

        default:
          state = STATE.ERROR;
          result.error = "illegal parser state ".concat(state);
          return state;
      }
    } catch (error) {
      state = STATE.ERROR;
      result.error = "DBF parsing failed: ".concat(error.message);
      return state;
    }
  }
}

function parseDBFHeader(headerView) {
  return {
    year: headerView.getUint8(1) + 1900,
    month: headerView.getUint8(2),
    day: headerView.getUint8(3),
    nRecords: headerView.getUint32(4, LITTLE_ENDIAN),
    headerLength: headerView.getUint16(8, LITTLE_ENDIAN),
    recordLength: headerView.getUint16(10, LITTLE_ENDIAN),
    languageDriver: headerView.getUint8(29)
  };
}

function parseFieldDescriptors(view, textDecoder) {
  var nFields = (view.byteLength - 1) / 32;
  var fields = [];
  var offset = 0;

  for (var i = 0; i < nFields; i++) {
    var name = textDecoder.decode(new Uint8Array(view.buffer, view.byteOffset + offset, 11)).replace(/\u0000/g, '');
    fields.push({
      name: name,
      dataType: String.fromCharCode(view.getUint8(offset + 11)),
      fieldLength: view.getUint8(offset + 16),
      decimal: view.getUint8(offset + 17)
    });
    offset += 32;
  }

  return fields;
}

function parseRow(view, fields, textDecoder) {
  var out = {};
  var offset = 0;

  var _iterator2 = _createForOfIteratorHelper(fields),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var field = _step2.value;
      var text = textDecoder.decode(new Uint8Array(view.buffer, view.byteOffset + offset, field.fieldLength));
      out[field.name] = parseField(text, field.dataType);
      offset += field.fieldLength;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return out;
}

function parseField(text, dataType) {
  switch (dataType) {
    case 'B':
      return parseNumber(text);

    case 'C':
      return parseCharacter(text);

    case 'F':
      return parseNumber(text);

    case 'N':
      return parseNumber(text);

    case 'O':
      return parseNumber(text);

    case 'D':
      return parseDate(text);

    case 'L':
      return parseBoolean(text);

    default:
      throw new Error('Unsupported data type');
  }
}

function parseDate(str) {
  return Date.UTC(str.slice(0, 4), parseInt(str.slice(4, 6), 10) - 1, str.slice(6, 8));
}

function parseBoolean(value) {
  return /^[nf]$/i.test(value) ? false : /^[yt]$/i.test(value) ? true : null;
}

function parseNumber(text) {
  var number = parseFloat(text);
  return isNaN(number) ? null : number;
}

function parseCharacter(text) {
  return text.trim() || null;
}

function makeField(_ref2) {
  var name = _ref2.name,
      dataType = _ref2.dataType,
      fieldLength = _ref2.fieldLength,
      decimal = _ref2.decimal;

  switch (dataType) {
    case 'B':
      return new _schema.Field(name, new _schema.Float64(), true);

    case 'C':
      return new _schema.Field(name, new _schema.Utf8(), true);

    case 'F':
      return new _schema.Field(name, new _schema.Float64(), true);

    case 'N':
      return new _schema.Field(name, new _schema.Float64(), true);

    case 'O':
      return new _schema.Field(name, new _schema.Float64(), true);

    case 'D':
      return new _schema.Field(name, new _schema.TimestampMillisecond(), true);

    case 'L':
      return new _schema.Field(name, new _schema.Bool(), true);

    default:
      throw new Error('Unsupported data type');
  }
}
//# sourceMappingURL=parse-dbf.js.map