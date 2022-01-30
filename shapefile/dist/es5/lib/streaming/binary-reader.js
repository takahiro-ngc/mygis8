"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var BinaryReader = function () {
  function BinaryReader(arrayBuffer) {
    (0, _classCallCheck2.default)(this, BinaryReader);
    (0, _defineProperty2.default)(this, "offset", void 0);
    (0, _defineProperty2.default)(this, "arrayBuffer", void 0);
    this.offset = 0;
    this.arrayBuffer = arrayBuffer;
  }

  (0, _createClass2.default)(BinaryReader, [{
    key: "hasAvailableBytes",
    value: function hasAvailableBytes(bytes) {
      return this.arrayBuffer.byteLength - this.offset >= bytes;
    }
  }, {
    key: "getDataView",
    value: function getDataView(bytes) {
      if (bytes && !this.hasAvailableBytes(bytes)) {
        throw new Error('binary data exhausted');
      }

      var dataView = bytes ? new DataView(this.arrayBuffer, this.offset, bytes) : new DataView(this.arrayBuffer, this.offset);
      this.offset += bytes;
      return dataView;
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
  return BinaryReader;
}();

exports.default = BinaryReader;
//# sourceMappingURL=binary-reader.js.map