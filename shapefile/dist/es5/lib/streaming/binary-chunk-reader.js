"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var BinaryChunkReader = function () {
  function BinaryChunkReader(options) {
    (0, _classCallCheck2.default)(this, BinaryChunkReader);
    (0, _defineProperty2.default)(this, "offset", void 0);
    (0, _defineProperty2.default)(this, "arrayBuffers", void 0);
    (0, _defineProperty2.default)(this, "ended", void 0);
    (0, _defineProperty2.default)(this, "maxRewindBytes", void 0);

    var _ref = options || {},
        _ref$maxRewindBytes = _ref.maxRewindBytes,
        maxRewindBytes = _ref$maxRewindBytes === void 0 ? 0 : _ref$maxRewindBytes;

    this.offset = 0;
    this.arrayBuffers = [];
    this.ended = false;
    this.maxRewindBytes = maxRewindBytes;
  }

  (0, _createClass2.default)(BinaryChunkReader, [{
    key: "write",
    value: function write(arrayBuffer) {
      this.arrayBuffers.push(arrayBuffer);
    }
  }, {
    key: "end",
    value: function end() {
      this.arrayBuffers = [];
      this.ended = true;
    }
  }, {
    key: "hasAvailableBytes",
    value: function hasAvailableBytes(bytes) {
      var bytesAvailable = -this.offset;

      var _iterator = _createForOfIteratorHelper(this.arrayBuffers),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var arrayBuffer = _step.value;
          bytesAvailable += arrayBuffer.byteLength;

          if (bytesAvailable >= bytes) {
            return true;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return false;
    }
  }, {
    key: "findBufferOffsets",
    value: function findBufferOffsets(bytes) {
      var offset = -this.offset;
      var selectedBuffers = [];

      for (var i = 0; i < this.arrayBuffers.length; i++) {
        var buf = this.arrayBuffers[i];

        if (offset + buf.byteLength <= 0) {
          offset += buf.byteLength;
          continue;
        }

        var start = offset <= 0 ? Math.abs(offset) : 0;
        var end = void 0;

        if (start + bytes <= buf.byteLength) {
          end = start + bytes;
          selectedBuffers.push([i, [start, end]]);
          return selectedBuffers;
        }

        end = buf.byteLength;
        selectedBuffers.push([i, [start, end]]);
        bytes -= buf.byteLength - start;
        offset += buf.byteLength;
      }

      return null;
    }
  }, {
    key: "getDataView",
    value: function getDataView(bytes) {
      var bufferOffsets = this.findBufferOffsets(bytes);

      if (!bufferOffsets && this.ended) {
        throw new Error('binary data exhausted');
      }

      if (!bufferOffsets) {
        return null;
      }

      if (bufferOffsets.length === 1) {
        var _bufferOffsets$ = (0, _slicedToArray2.default)(bufferOffsets[0], 2),
            bufferIndex = _bufferOffsets$[0],
            _bufferOffsets$$ = (0, _slicedToArray2.default)(_bufferOffsets$[1], 2),
            start = _bufferOffsets$$[0],
            end = _bufferOffsets$$[1];

        var arrayBuffer = this.arrayBuffers[bufferIndex];

        var _view = new DataView(arrayBuffer, start, end - start);

        this.offset += bytes;
        this.disposeBuffers();
        return _view;
      }

      var view = new DataView(this._combineArrayBuffers(bufferOffsets));
      this.offset += bytes;
      this.disposeBuffers();
      return view;
    }
  }, {
    key: "disposeBuffers",
    value: function disposeBuffers() {
      while (this.arrayBuffers.length > 0 && this.offset - this.maxRewindBytes >= this.arrayBuffers[0].byteLength) {
        this.offset -= this.arrayBuffers[0].byteLength;
        this.arrayBuffers.shift();
      }
    }
  }, {
    key: "_combineArrayBuffers",
    value: function _combineArrayBuffers(bufferOffsets) {
      var byteLength = 0;

      var _iterator2 = _createForOfIteratorHelper(bufferOffsets),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var bufferOffset = _step2.value;

          var _bufferOffset$ = (0, _slicedToArray2.default)(bufferOffset[1], 2),
              start = _bufferOffset$[0],
              end = _bufferOffset$[1];

          byteLength += end - start;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      var result = new Uint8Array(byteLength);
      var resultOffset = 0;

      var _iterator3 = _createForOfIteratorHelper(bufferOffsets),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _bufferOffset = _step3.value;

          var _bufferOffset2 = (0, _slicedToArray2.default)(_bufferOffset, 2),
              bufferIndex = _bufferOffset2[0],
              _bufferOffset2$ = (0, _slicedToArray2.default)(_bufferOffset2[1], 2),
              _start = _bufferOffset2$[0],
              _end = _bufferOffset2$[1];

          var sourceArray = new Uint8Array(this.arrayBuffers[bufferIndex]);
          result.set(sourceArray.subarray(_start, _end), resultOffset);
          resultOffset += _end - _start;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return result.buffer;
    }
  }, {
    key: "skip",
    value: function skip(bytes) {
      this.offset += bytes;
    }
  }, {
    key: "rewind",
    value: function rewind(bytes) {
      this.offset -= bytes;
    }
  }]);
  return BinaryChunkReader;
}();

exports.default = BinaryChunkReader;
//# sourceMappingURL=binary-chunk-reader.js.map