"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseShx = parseShx;

var _parseShpHeader = require("./parse-shp-header");

var SHX_HEADER_SIZE = 100;
var BIG_ENDIAN = false;

function parseShx(arrayBuffer) {
  var headerView = new DataView(arrayBuffer, 0, SHX_HEADER_SIZE);
  var header = (0, _parseShpHeader.parseSHPHeader)(headerView);
  var contentLength = header.length - SHX_HEADER_SIZE;
  var contentView = new DataView(arrayBuffer, SHX_HEADER_SIZE, contentLength);
  var offsets = new Int32Array(contentLength);
  var lengths = new Int32Array(contentLength);

  for (var i = 0; i < contentLength / 8; i++) {
    offsets[i] = contentView.getInt32(i * 8, BIG_ENDIAN);
    lengths[i] = contentView.getInt32(i * 8 + 4, BIG_ENDIAN);
  }

  return {
    offsets: offsets,
    lengths: lengths
  };
}
//# sourceMappingURL=parse-shx.js.map